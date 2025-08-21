# Win32 app runs PowerShell in 32-bit by default. AzureAD module requires PowerShell in 64-bit, so we are going to trigger a rerun in 64-bit.
if ($env:PROCESSOR_ARCHITEW6432 -eq "AMD64") {
    try {
        & "$env:WINDIR\SysNative\WindowsPowershell\v1.0\PowerShell.exe" -File $PSCommandPath
    }
    catch {
        throw "Failed to start $PSCommandPath"
    }
    exit
}

Start-Transcript -Path "$($env:TEMP)\IntuneSignatureManagerForOutlook-log.txt" -Force

# Install NuGet Package Provider
# Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Scope CurrentUser -Force

# Install AzureAD module to retrieve the user information
# Install-Module -Name AzureAD -Scope CurrentUser -Force

# Leverage Single Sign-on to sign into the AzureAD PowerShell module
$userPrincipalName = whoami -upn
# $userPrincipalName = "jaquila@humareso.com"

# Connect-AzureAD -AccountId $userPrincipalName

# Get the user information to update the signature
# $userObject = Get-AzureADUser -ObjectId $userPrincipalName

# Create signatures folder if not exists
if (-not (Test-Path "$($env:APPDATA)\Microsoft\Signatures")) {
    $null = New-Item -Path "$($env:APPDATA)\Microsoft\Signatures" -ItemType Directory
}



# Get all signature files
$signatureFiles = Get-ChildItem -Path "$PSScriptRoot\Signatures"

# Look for a match
$genFileName = $userPrincipalName+".htm"
$genFileName = $genFileName.replace('@', '.')

foreach ($signatureFile in $signatureFiles) {

    if ($signatureFile.Name -like $genFileName) {

        # Get file content
        $signatureFileContent = Get-Content -Path $signatureFile.FullName
	  # $signatureFileContent
        
	  # Set file content with actual values in $env:APPDATA\Microsoft\Signatures
        Set-Content -Path "$($env:APPDATA)\Microsoft\Signatures\$($signatureFile.Name)" -Value $signatureFileContent -Force

        if (-not (Test-Path "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.'))_files")) {
            $null = New-Item -Path "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.'))_files" -ItemType Directory
        }

        $xmlFilePath = "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.'))_files\filelist.xml"

        $xmlFileContent = '<xml xmlns:o="urn:schemas-microsoft-com:office:office"><o:MainFile HRef="../'+$($userPrincipalName.replace('@', '.'))+'.htm"/><o:File HRef="filelist.xml"/></xml>'

        if (Test-Path $xmlFilePath) {
            Remove-Item $xmlFilePath
        }
        ni $xmlFilePath
        echo $xmlFileContent | Out-File -FilePath $xmlFilePath -force

 
        if (Test-Path "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.')).rtf") {
            Remove-Item "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.')).rtf"
        }
        ni "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.')).rtf"

        if (Test-Path "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.')).txt") {
            Remove-Item "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.')).txt"
        }
        ni "$($env:APPDATA)\Microsoft\Signatures\$($userPrincipalName.replace('@', '.')).txt"
        
        if (Test-Path "$($env:APPDATA)\Microsoft\Signatures\intune_success.txt") {
            Remove-Item "$($env:APPDATA)\Microsoft\Signatures\intune_success.txt"
        }
        ni "$($env:APPDATA)\Microsoft\Signatures\intune_success.txt"

    } 
}

if (test-path "HKCU:\\Software\\Microsoft\\Office\\11.0\\Common\\General") {
    get-item -path HKCU:\\Software\\Microsoft\\Office\\11.0\\Common\\General | new-Itemproperty -name Signatures -value signatures -propertytype string -force
}
if (test-path "HKCU:\\Software\\Microsoft\\Office\\12.0\\Common\\General") {
    get-item -path HKCU:\\Software\\Microsoft\\Office\\12.0\\Common\\General | new-Itemproperty -name Signatures -value signatures -propertytype string -force
}
if (test-path "HKCU:\\Software\\Microsoft\\Office\\14.0\\Common\\General") {
    get-item -path HKCU:\\Software\\Microsoft\\Office\\14.0\\Common\\General | new-Itemproperty -name Signatures -value signatures -propertytype string -force
}
if (test-path "HKCU:\\Software\\Microsoft\\Office\\15.0\\Common\\General") {
    get-item -path HKCU:\\Software\\Microsoft\\Office\\15.0\\Common\\General | new-Itemproperty -name Signatures -value signatures -propertytype string -force
}
if (test-path "HKCU:\\Software\\Microsoft\\Office\\16.0\\Common\\General") {
    get-item -path HKCU:\\Software\\Microsoft\\Office\\16.0\\Common\\General | new-Itemproperty -name Signatures -value signatures -propertytype string -force
}
if (test-path "HKCU:\\Software\\Microsoft\\Office\\17.0\\Common\\General") {
    get-item -path HKCU:\\Software\\Microsoft\\Office\\17.0\\Common\\General | new-Itemproperty -name Signatures -value signatures -propertytype string -force
}
Stop-Transcript
