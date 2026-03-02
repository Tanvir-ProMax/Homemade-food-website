const express = require('express');
const router = express.Router();
const { memoryStorage } = require('multer');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { r2Client } = require('../config/r2');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

// Multer config — store in memory, limit 5MB, images only
const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
        }
    },
});

// @desc    Upload an image to Cloudflare R2
// @route   POST /api/upload
// @access  Private (Admin)
router.post('/', protect, adminProtect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const file = req.file;
        const ext = file.originalname.split('.').pop().toLowerCase();
        const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        // Upload to R2
        await r2Client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        // Return the public URL
        const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

        res.json({
            url: imageUrl,
            key: fileName,
            message: 'Image uploaded successfully',
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// @desc    Delete an image from Cloudflare R2
// @route   DELETE /api/upload
// @access  Private (Admin)
router.delete('/', protect, adminProtect, async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ message: 'No image key provided' });
        }

        await r2Client.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        }));

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

module.exports = router;
