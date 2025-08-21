import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './AdManagement.css';

function AdManagement({ ads, selectedAd, onAdSelect, onAdUpload, onAdDelete }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onAdUpload(acceptedFiles[0]);
    }
  }, [onAdUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div className="ad-management">
      <div className="section-header">
        <h3>Ad Management</h3>
        <p>Upload new ads or select existing ones for your email signatures</p>
      </div>

      <div className="upload-section">
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <div>
              <p>Drag & drop an image here, or click to select</p>
              <p className="upload-hint">Supports: JPG, PNG, GIF, WebP (Max: 5MB)</p>
            </div>
          )}
        </div>
      </div>

      <div className="ads-grid">
        <h4>Available Ads</h4>
        {ads.length === 0 ? (
          <p className="no-ads">No ads uploaded yet. Upload your first ad above.</p>
        ) : (
          <div className="ads-list">
            {ads.map((ad) => (
              <div 
                key={ad.id} 
                className={`ad-item ${selectedAd?.id === ad.id ? 'selected' : ''}`}
                onClick={() => onAdSelect(ad)}
              >
                <div className="ad-preview">
                  <img src={ad.url} alt={ad.name} />
                </div>
                <div className="ad-info">
                  <h5>{ad.name}</h5>
                  <p>Uploaded: {new Date(ad.uploadedAt).toLocaleDateString()}</p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdDelete(ad.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAd && (
        <div className="selected-ad">
          <h4>Selected Ad</h4>
          <div className="selected-ad-content">
            <img src={selectedAd.url} alt={selectedAd.name} />
            <div>
              <h5>{selectedAd.name}</h5>
              <p>This ad will be used in your email signatures</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdManagement;
