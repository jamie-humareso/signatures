# Email Signature Management Dashboard

A modern web-based dashboard for managing and deploying email signatures across Office 365 and HubSpot platforms.

## Features

### 🎯 **Ad Management**
- Drag & drop image uploads
- Ad library with preview thumbnails
- Easy ad selection for signatures
- Support for JPG, PNG, GIF, WebP formats

### ✏️ **Template Editor**
- Edit both Office 365 and HubSpot templates simultaneously
- Automatic ad insertion into templates
- Template backup before changes
- Syntax highlighting for HTML editing

### 👀 **Live Preview**
- Side-by-side preview of both platforms
- Sample data rendering for realistic preview
- Responsive design for mobile testing

### 🚀 **Deployment Controls**
- Separate deployment buttons for each platform
- Real-time deployment status tracking
- Deployment history and timestamps
- Safety warnings and best practices

## Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React.js with modern hooks
- **File Upload**: Multer with drag & drop
- **Styling**: CSS3 with responsive design
- **Deployment**: AWS-ready with environment configuration

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Dashboard**
   - Open http://localhost:5000
   - The React app will automatically proxy API calls to the backend

### Production Build

1. **Build React App**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## Usage Workflow

### 1. **Upload New Ad**
- Go to "Ad Management" tab
- Drag & drop your image or click to browse
- Image will be automatically resized and optimized
- Select the ad for use in signatures

### 2. **Edit Templates**
- Go to "Template Editor" tab
- Click "Edit Templates" to enable editing
- Use "Insert Selected Ad" buttons to add ads to templates
- Make any additional HTML modifications
- Click "Save Changes" to update both templates

### 3. **Preview Changes**
- Go to "Preview" tab
- See live previews with sample user data
- Verify ad placement and overall layout
- Check both Office 365 and HubSpot versions

### 4. **Deploy Signatures**
- Go to "Deploy" tab
- Review deployment warnings and notes
- Click "Deploy to Office 365" to update all users
- Click "Deploy to HubSpot" to update configuration
- Monitor deployment status and timestamps

## API Endpoints

### Ad Management
- `GET /api/ads` - List all uploaded ads
- `POST /api/ads/upload` - Upload new ad image
- `DELETE /api/ads/:id` - Delete ad by ID

### Template Management
- `GET /api/templates` - Get current templates
- `POST /api/templates/update` - Update templates with backup

### Deployment
- `POST /api/deploy/o365` - Deploy to Office 365
- `POST /api/deploy/hubspot` - Deploy to HubSpot

## AWS Deployment

### Option 1: AWS Elastic Beanstalk
1. Create new Elastic Beanstalk environment
2. Upload the application bundle
3. Configure environment variables
4. Deploy and access via provided URL

### Option 2: AWS EC2 + PM2
1. Launch EC2 instance with Node.js
2. Install PM2: `npm install -g pm2`
3. Clone repository and install dependencies
4. Build React app: `npm run build`
5. Start with PM2: `pm2 start server.js`

### Option 3: AWS Lambda + API Gateway
1. Package backend as Lambda function
2. Configure API Gateway endpoints
3. Host React app on S3 + CloudFront
4. Update API base URL in React app

## Environment Variables

```bash
PORT=5000                    # Server port
NODE_ENV=production         # Environment mode
AWS_REGION=us-east-1       # AWS region for services
```

## File Structure

```
├── server.js                    # Express backend server
├── package.json                 # Backend dependencies
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.js             # Main app component
│   │   └── index.js           # React entry point
│   ├── public/                 # Static assets
│   └── package.json           # Frontend dependencies
├── uploads/                    # Ad image storage
├── backups/                    # Template backup storage
└── humareso_sig_*.htm         # Signature templates
```

## Security Features

- **File Upload Validation**: Only image files allowed
- **File Size Limits**: 5MB maximum upload size
- **CORS Protection**: Configurable cross-origin settings
- **Helmet.js**: Security headers and protection
- **Input Sanitization**: HTML template validation

## Customization

### Adding New Platforms
1. Create new template file
2. Add platform to templates state
3. Update template editor component
4. Add deployment endpoint
5. Update preview component

### Custom Ad Sizes
1. Modify CSS grid in AdManagement.css
2. Update preview iframe dimensions
3. Adjust template ad insertion logic

### Branding
1. Update colors in CSS variables
2. Modify header component
3. Replace logo and company information

## Troubleshooting

### Common Issues

**Upload Fails**
- Check file format (JPG, PNG, GIF, WebP only)
- Verify file size (max 5MB)
- Ensure uploads directory is writable

**Templates Not Loading**
- Verify template files exist in root directory
- Check file permissions
- Review server logs for errors

**Deployment Errors**
- Verify PowerShell script exists and is executable
- Check HubSpot API credentials
- Review deployment logs and status

### Logs
- Backend logs: Check console output
- Frontend errors: Browser developer console
- File system: Check uploads and backups directories

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Ensure CI/CD passes

## License

MIT License - see LICENSE file for details

## Support

For technical support or feature requests, contact the Humareso IT team.
