import React, { useState, useEffect } from 'react';
import './TemplateEditor.css';

function TemplateEditor({ templates, selectedAd, onTemplateUpdate }) {
  const [localTemplates, setLocalTemplates] = useState(templates);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalTemplates(templates);
  }, [templates]);

  const updateAdInTemplate = (template, selectedAd) => {
    if (!selectedAd) return template;
    
    // Find and replace the ad image in the template
    const adRegex = /<img[^>]*src="[^"]*Email_Ads[^"]*"[^>]*>/i;
    
    let newAdHtml;
    let adSection;
    
    if (selectedAd.type === 'existing') {
      // For existing ads, use the full HTML structure
      newAdHtml = `<img style="border-radius:4px; -webkit-border-radius:4px; -o-border-radius:4px; -ms-border-radius:4px; -moz-border-radius:4px; overflow: hidden; "src="/image-proxy/${encodeURIComponent(selectedAd.imageUrl)}" role="presentation" width="485" class="image__StyledImage-sc-hupvqm-0 kUXePh" style="display: block; max-width: 485px;">`;
      
      adSection = `
<!-- Start Ad -->
		<tr>
			<td height="16">
			</td>
		</tr>
		<tr>
			<td width="485" height="125">
				<a href="${selectedAd.linkUrl}">
					${newAdHtml}
				</a>		
			</td>
		</tr>
<!-- End Ad -->`;
    } else {
      // For uploaded ads, use the local URL
      newAdHtml = `<img style="border-radius:4px; -webkit-border-radius:4px; -o-border-radius:4px; -ms-border-radius:4px; -moz-border-radius:4px; overflow: hidden; "src="${selectedAd.url}" role="presentation" width="485" class="image__StyledImage-sc-hupvqm-0 kUXePh" style="display: block; max-width: 485px;">`;
      
      adSection = `
<!-- Start Ad -->
		<tr>
			<td height="16">
			</td>
		</tr>
		<tr>
			<td width="485" height="125">
				<a href="https://humareso.com/?utm_campaign=none&utm_source=email&utm_medium=signature&utm_term=generic&utm_content=block_ad">
					${newAdHtml}
				</a>		
			</td>
		</tr>
<!-- End Ad -->`;
    }
    
    if (adRegex.test(template)) {
      return template.replace(adRegex, newAdHtml);
    }
    
    // If no existing ad found, insert after the OOO section
    const oooEndIndex = template.indexOf('<!-- End OOO -->');
    if (oooEndIndex !== -1) {
      const beforeOoo = template.substring(0, oooEndIndex + '<!-- End OOO -->'.length);
      const afterOoo = template.substring(oooEndIndex + '<!-- End OOO -->'.length);
      
      return beforeOoo + adSection + afterOoo;
    }
    
    return template;
  };

  const handleTemplateChange = (platform, content) => {
    setLocalTemplates(prev => ({
      ...prev,
      [platform]: content
    }));
  };

  const handleSave = () => {
    // Update both templates with the selected ad
    const updatedTemplates = {
      o365: updateAdInTemplate(localTemplates.o365, selectedAd),
      hubspot: updateAdInTemplate(localTemplates.hubspot, selectedAd)
    };
    
    onTemplateUpdate(updatedTemplates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalTemplates(templates);
    setIsEditing(false);
  };

  const insertAdButton = (platform) => {
    if (!selectedAd) return null;
    
    return (
              <button 
          className="insert-ad-btn"
          onClick={() => {
            const updated = updateAdInTemplate(localTemplates[platform], selectedAd);
            handleTemplateChange(platform, updated);
          }}
        >
          Insert Selected Ad
        </button>
    );
  };

  return (
    <div className="template-editor">
      <div className="section-header">
        <h3>Template Editor</h3>
        <p>Edit your email signature templates for Office 365 and HubSpot</p>
        {selectedAd && (
          <div className="selected-ad-info">
            <span>Selected Ad: {selectedAd.name}</span>
            <img src={selectedAd.url} alt={selectedAd.name} className="selected-ad-thumb" />
          </div>
        )}
      </div>

      <div className="editor-controls">
        <button 
          className={`edit-btn ${isEditing ? 'editing' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Templates'}
        </button>
        {isEditing && (
          <div className="save-controls">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="templates-container">
        <div className="template-section">
          <h4>Office 365 Template</h4>
          {insertAdButton('o365')}
          <textarea
            value={localTemplates.o365}
            onChange={(e) => handleTemplateChange('o365', e.target.value)}
            disabled={!isEditing}
            className="template-textarea"
            placeholder="Office 365 signature template..."
          />
        </div>

        <div className="template-section">
          <h4>HubSpot Template</h4>
          {insertAdButton('hubspot')}
          <textarea
            value={localTemplates.hubspot}
            onChange={(e) => handleTemplateChange('hubspot', e.target.value)}
            disabled={!isEditing}
            className="template-textarea"
            placeholder="HubSpot signature template..."
          />
        </div>
      </div>

      {!selectedAd && (
        <div className="no-ad-warning">
          <p>⚠️ No ad selected. Please select an ad in the Ad Management tab before editing templates.</p>
        </div>
      )}
    </div>
  );
}

export default TemplateEditor;
