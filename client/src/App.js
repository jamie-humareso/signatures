import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import AdManagement from './components/AdManagement';
import TemplateEditor from './components/TemplateEditor';
import Preview from './components/Preview';
import Deployment from './components/Deployment';

function App() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [templates, setTemplates] = useState({ o365: '', hubspot: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ads');

  useEffect(() => {
    fetchAds();
    fetchTemplates();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      setLoading(false);
    }
  };

  const handleAdUpload = async (file) => {
    const formData = new FormData();
    formData.append('ad', file);

    try {
      const response = await fetch('/api/ads/upload', {
        method: 'POST',
        body: formData,
      });
      const newAd = await response.json();
      setAds([newAd, ...ads]);
      setSelectedAd(newAd);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleAdDelete = async (adId) => {
    try {
      await fetch(`/api/ads/${adId}`, { method: 'DELETE' });
      setAds(ads.filter(ad => ad.id !== adId));
      if (selectedAd && selectedAd.id === adId) {
        setSelectedAd(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleTemplateUpdate = async (updatedTemplates) => {
    try {
      const response = await fetch('/api/templates/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTemplates),
      });
      if (response.ok) {
        setTemplates(updatedTemplates);
      }
    } catch (error) {
      console.error('Template update failed:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading Signature Dashboard...</div>;
  }

  return (
    <div className="App">
      <Header />
      
      <div className="main-content">
        <div className="sidebar">
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'ads' ? 'active' : ''}`}
              onClick={() => setActiveTab('ads')}
            >
              Ad Management
            </button>
            <button 
              className={`nav-tab ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              Template Editor
            </button>
            <button 
              className={`nav-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`nav-tab ${activeTab === 'deploy' ? 'active' : ''}`}
              onClick={() => setActiveTab('deploy')}
            >
              Deploy
            </button>
          </nav>
        </div>

        <div className="content-area">
          {activeTab === 'ads' && (
            <AdManagement
              ads={ads}
              selectedAd={selectedAd}
              onAdSelect={setSelectedAd}
              onAdUpload={handleAdUpload}
              onAdDelete={handleAdDelete}
            />
          )}
          
          {activeTab === 'templates' && (
            <TemplateEditor
              templates={templates}
              selectedAd={selectedAd}
              onTemplateUpdate={handleTemplateUpdate}
            />
          )}
          
          {activeTab === 'preview' && (
            <Preview
              templates={templates}
              selectedAd={selectedAd}
            />
          )}
          
          {activeTab === 'deploy' && (
            <Deployment
              templates={templates}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
