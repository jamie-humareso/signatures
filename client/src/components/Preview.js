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
    
    return previewHtml;
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
            <img src={selectedAd.url} alt={selectedAd.name} className="selected-ad-thumb" />
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
