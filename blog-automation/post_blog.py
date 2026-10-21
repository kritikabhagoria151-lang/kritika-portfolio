#!/usr/bin/env python3
"""
Write a fresh blog post with the Gemini API and send it to the secret
Blogger "post by email" address so it shows up in the blog.

Every run picks a different topic from TOPICS (rotation by date).

Secrets are read from environment variables only - nothing is hardcoded:
    GEMINI_API_KEY        Google AI Studio API key
    GMAIL_ADDRESS         Gmail address that sends the post
    GMAIL_APP_PASSWORD    16 character Gmail App Password
    BLOGGER_EMAIL         Blogger's secret posting email address

Usage:
    python post_blog.py               # rotate to the next topic
    python post_blog.py "SEO"         # force a specific topic
"""

import json
import os
import re
import smtplib
import ssl
import sys
import time
from datetime import date
from email.message import EmailMessage

import requests

PORTFOLIO_URL = "https://kritikabhagoria-portfolio.vercel.app/"

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465

GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

# Only current Gemini flash models. Older names (gemini-2.5-flash,
# gemini-2.0-flash, gemini-flash-latest) now return 404 and
# gemini-3.8-flash-lite does not exist, so the list stays this small.
GEMINI_MODELS = ["gemini-3.8-flash"]

# Seconds to wait for a single Gemini request before giving up on that attempt.
REQUEST_TIMEOUT = 300

# Extra tries each model gets after its first failed attempt.
RETRIES_PER_MODEL = 2

# Seconds to wait before retrying a model.
RETRY_DELAY_SECONDS = 10

# Keep replies quick: cap the output and ask for a minimal thinking budget.
MAX_OUTPUT_TOKENS = 3000
THINKING_BUDGET = 0

REQUIRED_SECRETS = ("GEMINI_API_KEY", "GMAIL_ADDRESS", "GMAIL_APP_PASSWORD", "BLOGGER_EMAIL")

# Topic list - the run rotates through these so no two runs repeat back to back.
TOPICS = [
    # --- digital marketing ---
    {"category": "Digital marketing", "topic": "How to plan a simple social media calendar for a small business",
     "angle": "A week-by-week routine a beginner can start with one hour and a notes app."},
    {"category": "Digital marketing", "topic": "Writing marketing copy that does not sound pushy",
     "angle": "Plain language, benefit first, one clear action for the reader."},
    {"category": "Digital marketing", "topic": "The first numbers worth looking at when you start marketing",
     "angle": "Clicks, replies and real conversations instead of vanity follower counts."},
    # --- SEO ---
    {"category": "SEO", "topic": "An on-page SEO checklist for every new page",
     "angle": "Title tag, one clear heading, image alt text, internal links and a meta description."},
    {"category": "SEO", "topic": "How to pick keywords you can actually rank for",
     "angle": "Matching search intent, starting narrow, and why tiny sites should avoid big terms."},
    {"category": "SEO", "topic": "Why page speed matters and the easy fixes first",
     "angle": "Compressing images, limiting fonts, and trimming extra scripts before anything fancy."},
    # --- web development ---
    {"category": "Web development", "topic": "What to decide before building your first website",
     "angle": "Goal, audience, pages, colours and mobile layout decided on one page first."},
    {"category": "Web development", "topic": "Designing mobile first instead of fixing the phone later",
     "angle": "Why starting on the smallest screen keeps layouts honest and simple."},
    {"category": "Web development", "topic": "Small details that make a website feel finished",
     "angle": "Spacing, buttons, form feedback, readable links and a friendly 404 page."},
    # --- AI tips ---
    {"category": "AI tips", "topic": "Better prompts start with context and examples",
     "angle": "Give the goal, the audience, a sample of the style, and ask for a clear format."},
    {"category": "AI tips", "topic": "Using AI to draft and then editing like a human",
     "angle": "Let AI handle the first pass, then rewrite in your own voice and cut the fluff."},
    {"category": "AI tips", "topic": "How I check AI output before trusting it",
     "angle": "Remove invented numbers, verify claims, read the tone aloud, and fix the structure."},
]


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr, flush=True)
    sys.exit(1)


def read_secrets() -> dict:
    missing = [name for name in REQUIRED_SECRETS if not os.environ.get(name, "").strip()]
    if missing:
        fail(
            "Missing secrets: "
            + ", ".join(missing)
            + ". Add them in GitHub > Settings > Secrets and variables > Actions "
            "(or export them locally before running)."
        )
    return {name: os.environ[name].strip() for name in REQUIRED_SECRETS}


def pick_topic(requested: str = "") -> dict:
    if requested.strip():
        needle = requested.strip().lower()
        for item in TOPICS:
            if needle in item["topic"].lower() or needle in item["category"].lower():
                return item
        return {"category": "General", "topic": requested.strip(),
                "angle": "Practical, beginner friendly advice the reader can apply today."}
    # Deterministic rotation: consecutive runs land on different topics.
    index = date.today().toordinal() % len(TOPICS)
    return TOPICS[index]


def build_prompt(item: dict) -> str:
    return f"""You are Kritika Bhagoria, a digital marketing student and AI creator from Pundri, Haryana,
India. Write one helpful blog post for her blog.

Topic: {item["topic"]}
Category: {item["category"]}
Angle: {item["angle"]}

Rules:
- Simple, friendly English, first person. Short sentences. No jargon.
- 400 to 600 words.
- 2 to 3 <h2> headings and normal <p> paragraphs. You may use a short <ul> list.
- NO invented numbers, percentages, statistics, revenue, client results or studies.
- Honest and practical. She is still learning, so do not pretend to be an expert.
- Mention the portfolio link naturally 1 or 2 times only, where it genuinely fits,
  for example when a reader might want to see her work. Use this exact link in an
  <a href> tag with friendly anchor text:
  {PORTFOLIO_URL}
- No emojis, no markdown, no "Introduction" heading, no call to buy anything.
- End with a short closing thought.

Return ONLY a JSON object, no code fences, in this exact shape:
{{"title": "Post title under 65 characters", "content": "<h2>...</h2><p>...</p>"}}"""


def build_payload(prompt: str, use_thinking: bool) -> dict:
    """Build a generateContent payload. Thinking is added only when asked for."""
    config = {
        "temperature": 0.8,
        "maxOutputTokens": MAX_OUTPUT_TOKENS,
        "responseMimeType": "application/json",
    }
    if use_thinking:
        config["thinkingConfig"] = {"thinkingBudget": THINKING_BUDGET}
    return {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": config,
    }


def generate_once(api_key: str, model: str, payload: dict) -> tuple[str | None, str]:
    """One generateContent call: returns (text, "") on success or (None, error)."""
    url = f"{GEMINI_BASE}/{model}:generateContent"
    try:
        response = requests.post(
            url, json=payload, headers={"x-goog-api-key": api_key}, timeout=REQUEST_TIMEOUT
        )
    except requests.RequestException as exc:
        return None, f"request failed ({exc})"

    if response.status_code != 200:
        try:
            detail = response.json().get("error", {}).get("message", response.text)
        except ValueError:
            detail = response.text
        return None, f"HTTP {response.status_code}: {detail[:200]}"

    try:
        parts = response.json()["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError, TypeError, ValueError):
        return None, "unexpected response shape"

    text = "".join(part.get("text", "") for part in parts).strip()
    if not text:
        return None, "empty response"
    return text, ""


def try_model(api_key: str, model: str, prompt: str, attempts: int = RETRIES_PER_MODEL + 1) -> tuple[str | None, str]:
    """Ask one model up to `attempts` times, pausing between tries.

    Returns (text, "") on success or (None, last_error) when every try failed.
    If the model rejects thinkingConfig the config is dropped and the same
    attempt is repeated without it.
    """
    last_error = "unknown error"
    use_thinking = True
    retries = max(attempts - 1, 0)

    for attempt in range(1, attempts + 1):
        text, error = generate_once(api_key, model, build_payload(prompt, use_thinking))

        if text is None and use_thinking and "thinking" in error.lower():
            print(f"  {model}: model rejects thinkingConfig, retrying without it", flush=True)
            use_thinking = False
            text, error = generate_once(api_key, model, build_payload(prompt, False))

        if text is not None:
            return text, ""

        last_error = error
        print(f"  {model}: {error}", flush=True)
        if attempt <= retries:
            print(
                f"  {model}: retry {attempt}/{retries} in {RETRY_DELAY_SECONDS}s",
                flush=True,
            )
            time.sleep(RETRY_DELAY_SECONDS)

    return None, last_error


def find_available_flash_model(api_key: str) -> str:
    """Log the models the API offers and return the first usable flash one.

    The key is sent as a header (never in the URL), so it cannot leak into
    the log output.
    """
    print("Every configured model failed. Asking the API which models exist...", flush=True)
    try:
        response = requests.get(
            GEMINI_BASE, headers={"x-goog-api-key": api_key}, timeout=REQUEST_TIMEOUT
        )
    except requests.RequestException as exc:
        print(f"  could not list models: {exc}", flush=True)
        return ""

    if response.status_code != 200:
        print(f"  could not list models: HTTP {response.status_code}", flush=True)
        return ""

    try:
        models = response.json().get("models", [])
    except ValueError:
        print("  could not list models: unexpected response", flush=True)
        return ""

    print("  Available models:", flush=True)
    candidate = ""
    for model in models:
        name = str(model.get("name", "")).split("/")[-1]
        methods = model.get("supportedGenerationMethods") or []
        print(f"    - {name} ({', '.join(methods) or 'no methods listed'})", flush=True)
        if not candidate and "flash" in name.lower() and "generateContent" in methods:
            candidate = name

    if candidate:
        print(f"  Using the first available flash model: {candidate}", flush=True)
    else:
        print("  No flash model with generateContent support was found.", flush=True)
    return candidate


def call_gemini(api_key: str, prompt: str) -> str:
    last_error = ""
    for model in GEMINI_MODELS:
        text, last_error = try_model(api_key, model, prompt)
        if text is not None:
            return text

    # Nothing configured worked - discover a usable model and try it once.
    fallback = find_available_flash_model(api_key)
    if fallback:
        text, last_error = try_model(api_key, fallback, prompt, attempts=1)
        if text is not None:
            return text

    fail(f"Gemini could not write the post. Last problem: {last_error}")


def parse_post(raw: str) -> dict:
    cleaned = raw.replace("```json", "").replace("```", "").strip()
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start == -1 or end == -1:
        fail("Gemini response did not contain JSON.")
    try:
        post = json.loads(cleaned[start:end + 1])
    except json.JSONDecodeError as exc:
        fail(f"Gemini returned invalid JSON: {exc}")

    title = str(post.get("title", "")).strip()
    content = str(post.get("content", "")).strip()
    if not title or not content:
        fail("Gemini response is missing a title or content.")
    return {"title": title, "content": content}


def word_count(html: str) -> int:
    return len(re.sub(r"<[^>]+>", " ", html).split())


def ensure_portfolio_link(html: str) -> str:
    """Make sure the portfolio link is there once, and at most twice."""
    pattern = re.compile(
        rf'<a[^>]*href="{re.escape(PORTFOLIO_URL)}"[^>]*>(.*?)</a>',
        flags=re.I | re.S,
    )
    found = list(pattern.finditer(html))

    if not found:
        html += (
            f'<p>You can see more of what I build on my '
            f'<a href="{PORTFOLIO_URL}" target="_blank" rel="noopener">portfolio</a>.</p>'
        )
        return html

    # Keep the first two links, turn any extra ones back into plain text.
    for match in reversed(found[2:]):
        html = html[:match.start()] + match.group(1) + html[match.end():]
    return html


def write_post(secrets: dict, item: dict) -> dict:
    prompt = build_prompt(item)
    for attempt in range(1, 4):
        raw = call_gemini(secrets["GEMINI_API_KEY"], prompt)
        post = parse_post(raw)
        post["content"] = ensure_portfolio_link(post["content"])
        count = word_count(post["content"])
        if 350 <= count <= 750:
            post["words"] = count
            return post
        print(f"  attempt {attempt}: {count} words, outside 400-600 target, retrying...", flush=True)
    fail("Could not get a post inside the word count after 3 attempts.")


def strip_tags(html: str) -> str:
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</(p|h2|h3|li|ul)>", "\n\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def send_to_blogger(secrets: dict, title: str, html: str) -> None:
    message = EmailMessage()
    message["Subject"] = title
    message["From"] = secrets["GMAIL_ADDRESS"]
    message["To"] = secrets["BLOGGER_EMAIL"]
    message.set_content(strip_tags(html))
    message.add_alternative(html, subtype="html")

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=45) as server:
            server.login(secrets["GMAIL_ADDRESS"], secrets["GMAIL_APP_PASSWORD"])
            server.send_message(message)
    except smtplib.SMTPAuthenticationError:
        fail(
            "Gmail rejected the login. Check GMAIL_ADDRESS and GMAIL_APP_PASSWORD "
            "(Google Account > Security > 2-Step Verification > App passwords)."
        )
    except (smtplib.SMTPException, OSError) as exc:
        fail(f"Could not send the email: {exc}")


def main() -> None:
    requested = sys.argv[1] if len(sys.argv) > 1 else ""
    secrets = read_secrets()

    item = pick_topic(requested)
    print(f"Topic    : {item['topic']}  [{item['category']}]", flush=True)

    post = write_post(secrets, item)

    print(f"Title    : {post['title']}", flush=True)
    print(f"Words    : {post['words']}", flush=True)
    print(f"Portfolio links: {post['content'].count(PORTFOLIO_URL)}", flush=True)
    print("Sending the post to Blogger by email...", flush=True)

    send_to_blogger(secrets, post["title"], post["content"])
    print("Email sent. Check the Blogger dashboard to confirm the post.", flush=True)


if __name__ == "__main__":
    main()
