# Ensure necessary modules are installed and imported
if (-not (Get-Module -ListAvailable -Name ExchangeOnlineManagement)) {
    Install-Module -Name ExchangeOnlineManagement -Force -Scope CurrentUser
}

# Import the module
Import-Module ExchangeOnlineManagement


try {
    # Connect to Exchange Online with interactive login
    Connect-ExchangeOnline -UserPrincipalName "jaquila@humareso.com" -ShowProgress $true
    Write-Output "Successfully connected to Exchange Online."
} catch {
    Write-Error "An error occurred while connecting to Exchange Online: $_"
    exit
}

# Set-OwaMailboxPolicy -Identity Default -SignaturesEnabled $false
# Set-OrganizationConfig -PostponeRoamingSignaturesUntilLater $true

# Define the path to your HTML signature template
$templatePath = "./humareso_sig_O365.htm"
$templatePathReply = "./humareso_sig_O365_reply.htm"

# Function to generate the HTML signature
function Generate-Signature($templatePath, $user, $user2) {
    
    $HTMLsig = Get-Content $templatePath -Raw

    $HTMLsig = $HTMLsig -replace '%%FirstName%%', $user2.FirstName
    $HTMLsig = $HTMLsig -replace '%%LastName%%', $user2.LastName
    $HTMLsig = $HTMLsig -replace '%%Title%%', $user2.Title
    $HTMLsig = $HTMLsig -replace '%%Email%%', $user.UserPrincipalName
    $HTMLsig = $HTMLsig -replace '%%CustomField1%%', $user.CustomAttribute1
    $HTMLsig = $HTMLsig -replace '%%CustomField2%%', $user.CustomAttribute2
    $HTMLsig = $HTMLsig -replace '%%CustomField3%%', $user.CustomAttribute3

    if ($user.DisplayName) {
        $HTMLsig = $HTMLsig -replace '%%DisplayName%%', $user.DisplayName
    }
    else {
        $HTMLsig = $HTMLsig -replace '%%DisplayName%%', $user2.FirstName+" "+$user2.LastName
    }

    if ($user2.Phone) {
        $HTMLsig = $HTMLsig -replace '%%Phone%%', $user2.Phone
    } else {
        $HTMLsig = $HTMLsig -replace '%%Phone%%', "844-486-2737"
    }

    $MeetingLinkHTML = ''
    if ($user.CustomAttribute2) {
        $MeetingLinkHTML = "<a style=""border: 2.5px solid #ef2e24; color:#ef2e24; padding:6px 12px; border-radius:18px; -webkit-border-radius:18px; -moz-border-radius:18px; -ms-border-radius:18px; -o-border-radius:18px; display:inline-block; text-decoration:none; font-weight:600; font-size:11px; "" href="""+ $user.CustomAttribute2 +""">Schedule some time with me</a>"
    }

    $OOOHTML = '';
    if ($user.CustomAttribute3) {
        $OOOHTML = "
            <tr>
                <td height='16'>
                </td>
            </tr>
            <tr>
                <td style='display:block; border:2.5px solid #032f46; color:#032f46; border-radius:8px; -webkit-border-radius:8px; -moz-border-radius:8px; -ms-border-radius:8px; -o-border-radius:8px; font-weight:600; font-size:12px; padding:12px;'>
                    <span>UPCOMING TIME-OFF: "+$user.CustomAttribute3+"</span>
                </td>
            </tr>
        "
    }

    $Location = "Vero Beach, FL | Cherry Hill, NJ";
    if ($user.StreetAddress) {
        $Location = $user.StreetAddress+", "+$user.City+", "+$user.StateOrProvince
    }
    if ($user2.Office) {
        $Location = $user2.Office
    }


    $HTMLsig = $HTMLsig -replace '%%MeetingLink%%', $MeetingLinkHTML
    $HTMLsig = $HTMLsig -replace '%%OOO%%', $OOOHTML   
    $HTMLsig = $HTMLsig -replace '%%Location%%', $Location   

    return $HTMLsig
}

# Function to generate the HTML signature
function Generate-Signature-Reply($templatePath, $user, $user2) {
    
    $HTMLsig = Get-Content $templatePathReply -Raw

    $HTMLsig = $HTMLsig -replace '%%FirstName%%', $user2.FirstName
    $HTMLsig = $HTMLsig -replace '%%LastName%%', $user2.LastName
    $HTMLsig = $HTMLsig -replace '%%Title%%', $user2.Title
    $HTMLsig = $HTMLsig -replace '%%Email%%', $user.UserPrincipalName
    $HTMLsig = $HTMLsig -replace '%%CustomField1%%', $user.CustomAttribute1
    $HTMLsig = $HTMLsig -replace '%%CustomField2%%', $user.CustomAttribute2
    $HTMLsig = $HTMLsig -replace '%%CustomField3%%', $user.CustomAttribute3

    if ($user.DisplayName) {
        $HTMLsig = $HTMLsig -replace '%%DisplayName%%', $user.DisplayName
    }
    else {
        $HTMLsig = $HTMLsig -replace '%%DisplayName%%', $user2.FirstName+" "+$user2.LastName
    }

    return $HTMLsig
}

# Get all users
try {
    $users = Get-EXORecipient -RecipientTypeDetails UserMailbox
} catch {
    Write-Error "An error occurred while retrieving users: $_"
    exit
}


# Iterate through each user and set the signature
foreach ($user in $users) {

    $userDetails = Get-Mailbox -Identity $user.PrimarySmtpAddress.ToString()
    # Write-Output $userDetails
    $userDetails2 = Get-User -Identity $user.PrimarySmtpAddress.ToString()
    # Write-Output $userDetails2

    $signatureHTML = Generate-Signature  $templatePath $userDetails $userDetails2
    $signatureHTMLreply = Generate-Signature-Reply  $templatePath $userDetails $userDetails2

    Write-Output "Installing Online signature for $($userDetails.DisplayName) ($($userDetails.UserPrincipalName))"
    
    try {
        $result = Set-MailboxMessageConfiguration -Identity $userDetails.UserPrincipalName -SignatureHTML $signatureHTML -SignatureName "Humareso Full" -DefaultSignature "Humareso Full" -DefaultFontName "Georgia" -DefaultFontSize "12" -DefaultFontColor "#3b4b56"
        Write-Output "Result of Set-MailboxMessageConfiguration: $result"

        # Verify the signature was set
        $currentConfig = Get-MailboxMessageConfiguration -Identity $userDetails.UserPrincipalName
        Write-Output "Current Signature Configuration: "
        $currentConfig | Format-List

        Set-CASMailbox -Identity $userDetails.UserPrincipalName -OneWinNativeOutlookEnabled $true

    } catch {
        Write-Error "An error occurred while setting the signature for $($userDetails.UserPrincipalName): $_"
        continue
    }

    # Optional: Save the signature to a file
    $FilePath = "./IntuneEmailSignatureManagement-main/Source/Signatures/"+$userDetails.UserPrincipalName+".htm"
    $signatureHTML | Out-File -FilePath ($FilePath -replace '@', '.')
    
}

Disconnect-ExchangeOnline -Confirm:$false