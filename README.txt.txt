First run ./signature.ps1 to generate .htm files and pass them to Office 365.

Then run the following to generate intune package:

.\IntuneWinAppUtil.exe -c '.\Source' -s '.\Source\install.ps1' -o '.\Package'`




## Deploying the Win32 app

### Install command
`PowerShell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "install.ps1"`

### Uninstall command
`PowerShell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "uninstall.ps1"`

### Install behavior
User

## Detection rules
- Manually configure detection rules

Example:
 - Rule type: File
 - Path: %APPDATA%\Microsoft\Signatures
 - File or folder: intune_success.txt
 - Detection method: File or folder exists

