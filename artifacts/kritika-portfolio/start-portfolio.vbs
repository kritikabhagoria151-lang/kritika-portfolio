Set objShell = CreateObject("WScript.Shell")
Set objFS = CreateObject("Scripting.FileSystemObject")

folderPath = objFS.GetParentFolderName(WScript.ScriptFullName)
objShell.CurrentDirectory = folderPath

Set objExec = objShell.Exec("cmd /c npm run dev")

Do While objExec.Status = 0
    WScript.Sleep 1000
Loop