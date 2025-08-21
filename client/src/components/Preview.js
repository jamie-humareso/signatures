import React from 'react';
import './Preview.css';

function Preview({ templates, selectedAd }) {
  const createPreviewHtml = (template, platform) => {
    if (!template) return '';
    
    // Replace template variables with sample data for preview
    let previewHtml = template;
    
    // Replace Office 365 variables
    if (platform === 'o365') {
      previewHtml = previewHtml
        .replace(/%%DisplayName%%/g, 'John Smith')
        .replace(/%%CustomField1%%/g, 'PHR, SHRM-CP')
        .replace(/%%Title%%/g, 'Senior HR Consultant')
        .replace(/%%Phone%%/g, '555-123-4567')
        .replace(/%%Email%%/g, 'john.smith@humareso.com')
        .replace(/%%Location%%/g, 'New York, NY')
        .replace(/%%MeetingLink%%/g, '')
        .replace(/%%OOO%%/g, '');
    }
    
    // Replace HubSpot variables
    if (platform === 'hubspot') {
      previewHtml = previewHtml
        .replace(/{{ user.firstName }}/g, 'John')
        .replace(/{{ user.lastName }}/g, 'Smith')
        .replace(/{{ userToken.creds }}/g, 'PHR, SHRM-CP')
        .replace(/{{ userToken.job_title }}/g, 'Senior HR Consultant')
        .replace(/{{ user.phoneNumber }}/g, '555-123-4567')
        .replace(/{{ user.email }}/g, 'john.smith@humareso.com')
        .replace(/{{ userToken.location }}/g, 'New York, NY')
        .replace(/{{ userToken.meetingLink }}/g, 'https://calendly.com/john-smith')
        .replace(/{{ userToken.ooo }}/g, '')
        .replace(/{{ userToken.ooo_visibility }}/g, 'none');
    }
    
    // Proxy all external humareso.com images to avoid CORS issues in iframe preview
    const originalHtml = previewHtml;
    previewHtml = previewHtml.replace(
      /src=["'](https:\/\/[^"']*humareso\.com[^"']*)["']/g,
      (match, url) => {
        console.log('Proxying image URL:', url);
        return `src="/image-proxy/${encodeURIComponent(url)}"`;
      }
    );
    
    // Log if any images were found and replaced
    if (originalHtml !== previewHtml) {
      console.log('Image URLs were proxied in preview');
    } else {
      console.log('No external images found to proxy');
    }
    
    // Insert selected ad if available
    if (selectedAd) {
      previewHtml = insertAdIntoPreview(previewHtml, selectedAd, platform);
    }
    
    return previewHtml;
  };

  const insertAdIntoPreview = (template, ad, platform) => {
    // Find and replace the ad image in the template
    const adRegex = /<img[^>]*src="[^"]*Email_Ads[^"]*"[^>]*>/i;
    
    let newAdHtml;
    if (ad.type === 'existing') {
      // For existing ads, use the proxy image URL
      newAdHtml = `<img style="border-radius:4px; -webkit-border-radius:4px; -o-border-radius:4px; -ms-border-radius:4px; -moz-border-radius:4px; overflow: hidden; "src="/image-proxy/${encodeURIComponent(ad.imageUrl)}" role="presentation" width="485" class="image__StyledImage-sc-hupvqm-0 kUXePh" style="display: block; max-width: 485px;">`;
    } else {
      // For uploaded ads, use the local URL
      newAdHtml = `<img style="border-radius:4px; -webkit-border-radius:4px; -o-border-radius:4px; -ms-border-radius:4px; -moz-border-radius:4px; overflow: hidden; "src="${ad.url}" role="presentation" width="485" class="image__StyledImage-sc-hupvqm-0 kUXePh" style="display: block; max-width: 485px;">`;
    }
    
    if (adRegex.test(template)) {
      return template.replace(adRegex, newAdHtml);
    }
    
    // If no existing ad found, insert after the OOO section
    const oooEndIndex = template.indexOf('<!-- End OOO -->');
    if (oooEndIndex !== -1) {
      const beforeOoo = template.substring(0, oooEndIndex + '<!-- End OOO -->'.length);
      const afterOoo = template.substring(oooEndIndex + '<!-- End OOO -->'.length);
      
      const adSection = `
<!-- Start Ad -->
		<tr>
			<td height="16">
			</td>
		</tr>
		<tr>
			<td width="485" height="125">
				<a href="${ad.type === 'existing' ? ad.linkUrl : 'https://humareso.com/?utm_campaign=none&utm_source=email&utm_medium=signature&utm_term=generic&utm_content=block_ad'}">
					${newAdHtml}
				</a>		
			</td>
		</tr>
<!-- End Ad -->`;
      
      return beforeOoo + adSection + afterOoo;
    }
    
    return template;
  };

  const o365Preview = createPreviewHtml(templates.o365, 'o365');
  const hubspotPreview = createPreviewHtml(templates.hubspot, 'hubspot');

  return (
    <div className="preview">
      <div className="section-header">
        <h3>Live Preview</h3>
        <p>Preview how your email signatures will look in both platforms</p>
        {selectedAd && (
          <div className="selected-ad-info">
            <span>Previewing with: {selectedAd.name}</span>
            <img 
              src={selectedAd.type === 'existing' ? `/image-proxy/${encodeURIComponent(selectedAd.imageUrl)}` : selectedAd.url} 
              alt={selectedAd.name} 
              className="selected-ad-thumb" 
            />
          </div>
        )}
      </div>

      <div className="preview-container">
        <div className="preview-section">
          <h4>Office 365 Preview</h4>
          <div className="preview-frame">
            <iframe
              srcDoc={o365Preview}
              title="Office 365 Signature Preview"
              className="preview-iframe"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        <div className="preview-section">
          <h4>HubSpot Preview</h4>
          <div className="preview-frame">
            <iframe
              srcDoc={hubspotPreview}
              title="HubSpot Signature Preview"
              className="preview-iframe"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      <div className="preview-notes">
        <h4>Preview Notes</h4>
        <ul>
          <li>This preview shows how signatures will appear with sample user data</li>
          <li>Actual signatures will use real user information from your systems</li>
          <li>Images and styling may appear slightly different in actual email clients</li>
          <li>Use this preview to verify ad placement and overall layout</li>
        </ul>
      </div>

      {!selectedAd && (
        <div className="no-ad-warning">
          <p>⚠️ No ad selected. Select an ad in the Ad Management tab to see it in the preview.</p>
        </div>
      )}
    </div>
  );
}

export default Preview;
