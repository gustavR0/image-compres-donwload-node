const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const downloadLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  message: 'Too many file download requests from this IP, please try again later'
});
app.use(cors());
app.get('/download/:id',downloadLimit, function (req, res) {
    try {
        const id = req.params.id;
        const filepath = path.join(__dirname, '/output_images', id);
        // Check if the file exists
        if (!fs.existsSync(filepath)) {
            res.status(404).send('File not found');
            return;
        }
        // Set headers for the download response
        const fileSize = fs.statSync(filepath).size;
        // Handle range requests for resuming downloads
        const range = req.headers.range;
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Length': fileSize,
            'Content-Disposition': `attachment; id="${id}"`,
            'Cache-Control': 'public, max-age=31536000'
        });
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            console.log('start: ', start);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            console.log('end: ', end);
            const chunksize = (end - start) + 1;
            res.writeHead(206, {
                'Content-Type': 'application/octet-stream',
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Content-Length': chunksize,
            });
            const file = fs.createReadStream(filepath, { start, end });
            let downloadedBytes = 0;
            file.on('data', function (chunk) {
                downloadedBytes += chunk.length;
                res.write(chunk);
            });
            file.on('end', function () {
                console.log('Download completed');
                res.end();
            });
            file.on('error', function (err) {
                console.log('Error while downloading file:', err);
                res.status(500).send('Error while downloading file');
            });
        } else {
            // Handle full file download requests
            const file = fs.createReadStream(filepath);
            file.pipe(res);
        }
    } catch (error) {
        console.log('error: ', error);
        res.send(500)
    }
});
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});