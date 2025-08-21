const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());



app.use(express.static(path.join(__dirname, 'client/build')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// API Routes

// Get all uploaded ads
app.get('/api/ads', async (req, res) => {
  try {
    // Load existing ads from JSON file
    let existingAds = [];
    try {
      const existingAdsData = await fs.readFile(path.join(__dirname, 'existing-ads.json'), 'utf8');
      existingAds = JSON.parse(existingAdsData).map(ad => ({
        ...ad,
        isExisting: true,
        type: 'existing'
      }));
    } catch (error) {
      console.log('No existing ads file found, starting with empty list');
    }

    // Get uploaded ads
    const files = await fs.readdir(uploadsDir);
    const uploadedAds = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        id: file,
        name: file.replace(/^[^-]+-/, ''),
        url: `/uploads/${file}`,
        uploadedAt: fs.statSync(path.join(uploadsDir, file)).mtime,
        isExisting: false,
        type: 'uploaded'
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
    
    // Combine existing and uploaded ads
    const allAds = [...existingAds, ...uploadedAds];
    res.json(allAds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// Upload new ad
app.post('/api/ads/upload', upload.single('ad'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const ad = {
      id: req.file.filename,
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    };
    
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete ad
app.delete('/api/ads/:id', async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.id);
    await fs.remove(filePath);
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

// Get current signature templates
app.get('/api/templates', async (req, res) => {
  try {
    const o365Template = await fs.readFile(path.join(__dirname, 'humareso_sig_O365.htm'), 'utf8');
    const hubspotTemplate = await fs.readFile(path.join(__dirname, 'humareso_sig_HubSpot.htm'), 'utf8');
    
    res.json({
      o365: o365Template,
      hubspot: hubspotTemplate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Update signature templates
app.post('/api/templates/update', async (req, res) => {
  try {
    const { o365, hubspot } = req.body;
    
    // Backup current templates
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.copy(path.join(__dirname, 'humareso_sig_O365.htm'), 
                  path.join(__dirname, `backups/humareso_sig_O365_${timestamp}.htm`));
    await fs.copy(path.join(__dirname, 'humareso_sig_HubSpot.htm'), 
                  path.join(__dirname, `backups/humareso_sig_HubSpot_${timestamp}.htm`));
    
    // Update templates
    await fs.writeFile(path.join(__dirname, 'humareso_sig_O365.htm'), o365);
    await fs.writeFile(path.join(__dirname, 'humareso_sig_HubSpot.htm'), hubspot);
    
    res.json({ message: 'Templates updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update templates' });
  }
});

// Deploy to Office 365
app.post('/api/deploy/o365', async (req, res) => {
  try {
    // Here you would integrate with your PowerShell script
    // For now, we'll simulate the deployment
    res.json({ 
      message: 'Office 365 deployment initiated',
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Deployment failed' });
  }
});

// Deploy to HubSpot
app.post('/api/deploy/hubspot', async (req, res) => {
  try {
    // Here you would integrate with HubSpot API
    // For now, we'll simulate the deployment
    res.json({ 
      message: 'HubSpot deployment initiated',
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Deployment failed' });
  }
});





// Proxy route for external CDN images to avoid CORS (must come before catch-all route)
app.get('/image-proxy/:encodedUrl', async (req, res) => {
  console.log('PROXY ROUTE HIT!', req.params.encodedUrl);
  try {
    const encodedUrl = req.params.encodedUrl;
    const imageUrl = decodeURIComponent(encodedUrl);
    console.log('Decoded URL:', imageUrl);
    
    // Validate that it's a humareso.com URL for security
    if (!imageUrl.includes('humareso.com')) {
      console.log('Invalid URL, not humareso.com');
      return res.status(400).json({ error: 'Invalid image URL' });
    }
    
    // Force 485px width for signature consistency
    const resizedUrl = imageUrl.includes('?') 
      ? `${imageUrl}&width=485&height=125` 
      : `${imageUrl}?width=485&height=125`;
    console.log('Resized URL:', resizedUrl);
    
    const response = await fetch(resizedUrl);
    console.log('Fetch response status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log('Content type:', contentType);
    const buffer = await response.arrayBuffer();
    console.log('Buffer size:', buffer.byteLength);
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(Buffer.from(buffer));
    console.log('Image sent successfully');
  } catch (error) {
    console.error('Proxy image error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});
