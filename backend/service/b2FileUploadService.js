import 'dotenv/config';

import fs from 'fs';
import https from 'https';
import path from 'path';
import os from 'os';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import b2Client from '../database/b2Client.js';

const authorize = async () => {
  try {
    await b2Client.authorize();
    console.log('Backblaze B2 authorized successfully');
  } catch (error) {
    console.error('Error authorizing Backblaze B2:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

// Function to download image from URL
const downloadImage = async (url, outputPath) => {
  console.log(`Downloading image from DALL-E to ${outputPath}`);

  return new Promise((resolve, reject) => {
    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
};

const uploadImage = async (filePath, fileName) => {
  try {
    console.log('Uploading file to Backblaze B2...');
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;
    
    // Read file into buffer instead of using a stream
    const fileBuffer = await fsPromises.readFile(filePath);

    await authorize();

    const uploadUrl = await b2Client.getUploadUrl({
      bucketId,
    });
    
    // Upload the file using buffer instead of stream
    await b2Client.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName,
      data: fileBuffer,  // Pass buffer instead of stream
      contentType: 'image/jpeg', // Set the appropriate content type
    });

    let imageUrl = `${process.env.BACKBLAZE_IMAGE_URL_PREFIX}${fileName}`;
    
    console.log('File uploaded successfully:', imageUrl);
    return imageUrl;
  } catch (error) {
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Clean up temporary files
const cleanupTempFile = async (filePath) => {
  try {
    await fsPromises.unlink(filePath);
    console.log(`Temporary file deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting temporary file ${filePath}:`, error);
  }
};

// Main function to handle the upload process
const handleB2Upload = async (imageUrl) => {
  try {

    const tempDir = path.join(os.tmpdir(), 'images');
    const fileName = `${uuidv4()}.jpg`;
    const tempFilePath = path.join(tempDir, fileName);
    await downloadImage(imageUrl, tempFilePath);
    await uploadImage(tempFilePath, fileName);
    await cleanupTempFile(tempFilePath);
    
    const b2ImagePath = `${process.env.BACKBLAZE_IMAGE_URL_PREFIX}/${fileName}`;
    return b2ImagePath;

  } catch (error) {
    throw error;
  }
}

const deleteFile = async (fileName) => {
  try {
    await authorize();
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;

    // List file versions to get the fileId
    const listResponse = await b2Client.listFileNames({
      bucketId,
      prefix: fileName,
      maxFileCount: 1
    });

    const file = listResponse.data.files.find(f => f.fileName === fileName);
    if (!file) {
      throw new Error('File not found in Backblaze B2');
    }

    // Delete the file version
    await b2Client.deleteFileVersion({
      fileName: file.fileName,
      fileId: file.fileId
    });

    console.log('File deleted successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Error deleting file from Backblaze B2:', error);
    throw error;
  }
};

const b2 = {
  handleB2Upload,
  deleteFile
}

export default b2;
