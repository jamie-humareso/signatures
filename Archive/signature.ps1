Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
Install-Module AzureAD -Force
Import-Module AzureAD
Connect-AzureAD
Connect-ExchangeOnline
$users = (Get-AzureADUser | Select * )

foreach($user in $users){
	if($user.Mail -like 'jaquila@humareso.com') {	
		print $user;

		$HTMLsig = ""
		$HTMLsig = Get-Content ".\signature365.html" | Out-String
		

		$HTMLsig = $HTMLsig.replace('%%FirstName%%', $user.GivenName).replace('%%LastName%%', $user.Surname).replace('%%Title%%', $user.JobTitle).replace('%%Email%%', $user.Mail).replace('%%CustomField1%%', $user.CustomField1)



		if ($user.TelephoneNumber) {
			$HTMLsig = $HTMLsig.replace('%%Phone%%',$user.TelephoneNumber)
		}
		else {
			$HTMLsig = $HTMLsig.replace('%%Phone%%', "844-486-2737")
		}


		$MeetingLinkHTML = '';

		if ($user.CustomField1) {

			$MeetingLinkHTML = '<tbody><tr><td height="35"></td></tr><tr><td></td><td style="text-align: left;"><span style="display: block; text-align: left;"><a target="_blank" rel="noopener noreferrer" href="'+$meetingLinkList[$user.Mail]+'" color="#EF2E24" class="sc-fAjcbJ byigni" style="border-width: 6px 12px; border-style: solid; border-color: rgb(239, 46, 36); display: inline-block; background-color: rgb(239, 46, 36); color: rgb(255, 255, 255); font-weight: 700; text-decoration: none; text-align: center; line-height: 40px; font-size: 12px; border-radius: 3px;">Book some time with me</a></span></td></tr></tbody>'

		}

		$CredsHTML = '';

		if ($credsList[$user.Mail]) {
			$CredsHTML = '&nbsp;<span style="font-size:11px;">'+$credsList[$user.Mail]+'</span>'
		}

		$HTMLsig = $HTMLsig.replace('%%MeetingLink%%', $MeetingLinkHTML)
		$HTMLsig = $HTMLsig.replace('%%Creds%%', $CredsHTML)
		
		# $HTMLsig

		echo "Installing Online signature for $($user.DisplayName) ($($user.Mail))"
		# Set-MailboxMessageConfiguration $user.Mail -SignatureHTML $HTMLsig -AutoAddSignature $true -AutoAddSignatureOnReply $true -AutoAddSignatureOnMobile $true

		Set-EXOMailboxMessageConfiguration $user.Mail -SignatureHTML $HTMLsig -AutoAddSignature $true -AutoAddSignatureOnReply $true -AutoAddSignatureOnMobile $true

		$FilePath = './IntuneEmailSignatureManagement-main/Source/Signatures/'+$user.Mail+'.htm'
		echo $HTMLsig | Out-File -FilePath $FilePath.replace('@', '.')

	}
}