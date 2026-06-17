import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve the uploads directory statically
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 30MB limit for PDFs
});

// Upload Endpoint
app.post('/upload-pdf', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Construct the public URL for the uploaded file
  let baseUrl = process.env.BASE_URL || (req.get('host') && req.get('host').includes('localhost') ? `http://${req.get('host')}` : 'https://www.laxmopump.com');
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    message: 'File uploaded successfully',
    url: fileUrl
  });
});

// Upload Endpoint for Images
app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Construct the public URL for the uploaded file
  let baseUrl = process.env.BASE_URL || (req.get('host') && req.get('host').includes('localhost') ? `http://${req.get('host')}` : 'https://www.laxmopump.com');
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    message: 'Image uploaded successfully',
    url: fileUrl
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
