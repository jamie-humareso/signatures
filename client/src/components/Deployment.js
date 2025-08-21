import React, { useState } from 'react';
import './Deployment.css';

function Deployment({ templates }) {
  const [deploymentStatus, setDeploymentStatus] = useState({
    o365: { status: 'idle', message: '', timestamp: null },
    hubspot: { status: 'idle', message: '', timestamp: null }
  });

  const deployToO365 = async () => {
    setDeploymentStatus(prev => ({
      ...prev,
      o365: { status: 'deploying', message: 'Initiating Office 365 deployment...', timestamp: new Date() }
    }));

    try {
      const response = await fetch('/api/deploy/o365', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templates.o365 })
      });

      const result = await response.json();

      if (response.ok) {
        setDeploymentStatus(prev => ({
          ...prev,
          o365: { 
            status: 'success', 
            message: result.message || 'Office 365 deployment successful!', 
            timestamp: new Date() 
          }
        }));
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error) {
      setDeploymentStatus(prev => ({
        ...prev,
        o365: { 
          status: 'error', 
          message: `Deployment failed: ${error.message}`, 
          timestamp: new Date() 
        }
      }));
    }
  };

  const deployToHubSpot = async () => {
    setDeploymentStatus(prev => ({
      ...prev,
      hubspot: { status: 'deploying', message: 'Initiating HubSpot deployment...', timestamp: new Date() }
    }));

    try {
      const response = await fetch('/api/deploy/hubspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templates.hubspot })
      });

      const result = await response.json();

      if (response.ok) {
        setDeploymentStatus(prev => ({
          ...prev,
          hubspot: { 
            status: 'success', 
            message: result.message || 'HubSpot deployment successful!', 
            timestamp: new Date() 
          }
        }));
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error) {
      setDeploymentStatus(prev => ({
        ...prev,
        hubspot: { 
          status: 'error', 
          message: `Deployment failed: ${error.message}`, 
          timestamp: new Date() 
        }
      }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'deploying': return '⏳';
      default: return '⏸️';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'success': return 'status-success';
      case 'error': return 'status-error';
      case 'deploying': return 'status-deploying';
      default: return 'status-idle';
    }
  };

  return (
    <div className="deployment">
      <div className="section-header">
        <h3>Deployment</h3>
        <p>Deploy your updated email signatures to Office 365 and HubSpot</p>
      </div>

      <div className="deployment-warning">
        <div className="warning-icon">⚠️</div>
        <div className="warning-content">
          <h4>Before Deploying</h4>
          <ul>
            <li>Ensure you have reviewed the preview of your signatures</li>
            <li>Verify that the correct ad is selected and inserted</li>
            <li>Make sure you have the necessary permissions for both platforms</li>
            <li>Consider deploying during off-peak hours for Office 365</li>
          </ul>
        </div>
      </div>

      <div className="deployment-controls">
        <div className="deployment-section">
          <h4>Office 365 Deployment</h4>
          <p>Deploy signatures to all Office 365 users via PowerShell script</p>
          
          <button 
            className={`deploy-btn deploy-o365 ${deploymentStatus.o365.status === 'deploying' ? 'deploying' : ''}`}
            onClick={deployToO365}
            disabled={deploymentStatus.o365.status === 'deploying'}
          >
            {deploymentStatus.o365.status === 'deploying' ? 'Deploying...' : 'Deploy to Office 365'}
          </button>

          <div className={`deployment-status ${getStatusClass(deploymentStatus.o365.status)}`}>
            <span className="status-icon">{getStatusIcon(deploymentStatus.o365.status)}</span>
            <span className="status-message">{deploymentStatus.o365.message}</span>
            {deploymentStatus.o365.timestamp && (
              <span className="status-timestamp">
                {deploymentStatus.o365.timestamp.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="deployment-section">
          <h4>HubSpot Deployment</h4>
          <p>Update HubSpot signature configuration and push to all users</p>
          
          <button 
            className={`deploy-btn deploy-hubspot ${deploymentStatus.hubspot.status === 'deploying' ? 'deploying' : ''}`}
            onClick={deployToHubSpot}
            disabled={deploymentStatus.hubspot.status === 'deploying'}
          >
            {deploymentStatus.hubspot.status === 'deploying' ? 'Deploying...' : 'Deploy to HubSpot'}
          </button>

          <div className={`deployment-status ${getStatusClass(deploymentStatus.hubspot.status)}`}>
            <span className="status-icon">{getStatusIcon(deploymentStatus.hubspot.status)}</span>
            <span className="status-message">{deploymentStatus.hubspot.message}</span>
            {deploymentStatus.hubspot.timestamp && (
              <span className="status-timestamp">
                {deploymentStatus.hubspot.timestamp.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="deployment-notes">
        <h4>Deployment Notes</h4>
        <div className="notes-grid">
          <div className="note-item">
            <h5>Office 365</h5>
            <ul>
              <li>Uses PowerShell script to update all user signatures</li>
              <li>May take several minutes to complete</li>
              <li>Users may need to restart Outlook to see changes</li>
              <li>Deployment is immediate and affects all users</li>
            </ul>
          </div>
          
          <div className="note-item">
            <h5>HubSpot</h5>
            <ul>
              <li>Updates shared signature configuration</li>
              <li>Changes apply to new emails and replies</li>
              <li>May take up to 24 hours to fully propagate</li>
              <li>Users can override with personal signatures if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deployment;
