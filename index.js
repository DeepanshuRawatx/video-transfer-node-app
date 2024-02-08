require('dotenv').config()
const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Set up Google Drive API credentials
const credentials = require('./nooro-key-credentials.json');//make sure to place your Google Drive API credentials JSON file (e.g.,`nooro-key-credentials.json`) in the project directory
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

// object to store progress information
let progressInfo = {
    downloadProgress: 0,
    uploadProgress: 0
};

// Endpoint to monitor progress
app.get('/progress', (req, res) => {
    res.json(progressInfo);
});

// Functions to update download and update progress
function updateDownloadProgress(progress) {
    progressInfo.downloadProgress = progress;
}

function updateUploadProgress(progress) {
    progressInfo.uploadProgress = progress;
}
// Function to get file metadata
async function getFileMetadata(fileId) {
    try {
        const res = await drive.files.get({
            fileId: fileId,
            fields: 'size' // Specify the fields you want to retrieve
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching file metadata:', error);
        throw error;
    }
}

// Endpoint to initiate download and upload processes
app.post('/transfer-video', async (req, res) => {
    try {
        const { sourceFileId, destinationFolderId } = req.body;

        // Get the file metadata to determine the total size
        const fileMetadata = await getFileMetadata(sourceFileId);
        const totalSize = fileMetadata.size;

        uploadFile(sourceFileId, destinationFolderId, totalSize);

        res.json({ message: 'Transfer process initiated successfully' });
    } catch (error) {
        console.error('Error initiating transfer process:', error);
        res.status(500).json({ error: 'Failed to initiate transfer process' });
    }
});


// Upload file to Google Drive using chunked upload
async function uploadFile(sourceFileId, folderId, totalSize) {
    try {
        // Start downloading the file directly from the sourceFileId
        const downloadStream = await drive.files.get({ fileId: sourceFileId, alt: 'media' }, { responseType: 'stream' });

        // Create a temporary file to store the downloaded data
        const tempFilePath = './temp_video.mp4';
        const tempFile = fs.createWriteStream(tempFilePath);

        // Pipe the download stream to the temporary file
        let downloadedSize = 0; // Initialize downloadedSize outside the event handler

        downloadStream.data
            .on('data', (chunk) => {
                // Increment downloadedSize by the size of the current chunk
                downloadedSize += chunk.length;
                // Update download progress based on the accumulated downloaded size
                const downloadProgress = (downloadedSize / totalSize) * 100;
                updateDownloadProgress(downloadProgress);
            })
            // Rest of the code remains unchanged

            .on('end', async () => {
                console.log('Download complete');
                // Once the download is complete, start uploading the temporary file
                const uploadStream = fs.createReadStream(tempFilePath);
                const res = await drive.files.create({
                    requestBody: {
                        name: 'uploaded_video.mp4', // Specify the name for the uploaded video file
                        parents: [folderId], // Specify the destination folder ID
                    },
                    media: {
                        mimeType: 'video/mp4', // Specify the MIME type of the video file
                        body: uploadStream, // Set the file stream as the media content to be uploaded
                    },
                }, {
                    // Provide a callback to handle the response
                    onUploadProgress: (event) => {
                        let bytesRead = event.bytesRead;
                        console.log(bytesRead);
                        // Update upload progress based on the progress event
                        let uploadedSize = 0
                        uploadedSize += bytesRead;
                        // Update download progress based on the accumulated downloaded size
                        const uploadProgress = (uploadedSize / totalSize) * 100;
                        // console.log('upload progress--->',event)
                        updateUploadProgress(uploadProgress);
                    }
                });
                console.log('File uploaded successfully:', res.data.id);

                // Close the temporary file stream
                tempFile.close();
                // Delete the temporary file
                fs.unlinkSync(tempFilePath);
            })
            .on('error', (err) => {
                console.error('Error downloading file:', err);
                // Handle download error
            })
            .pipe(tempFile); // Pipe the download stream to the temporary file
    } catch (error) {
        console.error('Error uploading file:', error);
        // Handle upload error
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
