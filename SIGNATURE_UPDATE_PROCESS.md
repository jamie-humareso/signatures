# Email Signature Update Process

## Overview
This document outlines the current manual process for updating email signatures across Office 365 and HubSpot platforms.

## Current Workflow

### 1. Ad Image Creation
- Create new ad image in Adobe Express using the exact size template
- Save the image for use in both signature templates

### 2. Template Updates

#### Office 365 Template (`humareso_sig_O365.htm`)
1. Edit the `ads.html` file to create a new image block
2. Open `humareso_sig_O365.htm`
3. Manually replace the existing ad with the new image block
4. Save the updated template

#### HubSpot Template (`humareso_sig_HubSpot.htm`)
1. Edit the same `ads.html` file (reusing the image block created above)
2. Open `humareso_sig_HubSpot.htm`
3. Manually replace the existing ad with the new image block
4. Save the updated template

### 3. Deployment

#### Office 365 Deployment
1. Run the PowerShell script (`signature.ps1`) to update all user signatures in Office 365
2. The script applies the new template to all employees automatically

#### HubSpot Deployment
1. Update the shared configuration in HubSpot to use the new template
2. Push the updated template to all users in HubSpot

### 4. Legacy/Additional Distribution (Optional)
- On occasion, individual HTML files for each employee are generated
- These files are added to a SharePoint folder for employee access
- Useful for unsupported platforms or manual signature applications
- **Note**: Intune deployment for Outlook is no longer actively maintained

## File Structure
- `humareso_sig_O365.htm` - Office 365 signature template
- `humareso_sig_HubSpot.htm` - HubSpot signature template  
- `ads.html` - Ad image block template (reused for both platforms)
- `signature.ps1` - PowerShell script for Office 365 deployment
- `IntuneEmailSignatureManagement-main/` - Legacy Intune deployment tools (maintained for reference)

## Important Notes
- This is a **manual process** that requires manual editing of both template files
- The same ad image block from `ads.html` is used in both templates
- Office 365 deployment is automated via PowerShell
- HubSpot deployment requires manual configuration updates
- Intune deployment for Outlook is deprecated but tools remain available

## Future Considerations
- Consider automating the template synchronization between platforms
- Evaluate if the manual process can be streamlined
- Maintain the current workflow until automation is implemented
