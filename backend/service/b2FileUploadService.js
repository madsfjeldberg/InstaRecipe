import 'dotenv/config';

import fs from 'fs';
import https from 'https';
import path from 'path';
import os from 'os';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import b2Client from '../database/b2Client.js';



// Main function to handle the upload process
const uploadRecipeImage = async (imageUrl) => {
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



const uploadUserAvatar = async (file) => {
    if (!file || !file.buffer) {
        throw new Error("Invalid file object provided for upload.");
    }

    try {
        const bucketId = process.env.BACKBLAZE_BUCKET_ID;

        // 1. Generate a unique file name to prevent collisions.
        // We use the original file's extension.
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;

        // 2. Authorize with B2.
        await b2Client.authorize();

        // 3. Get the upload URL.
        const uploadUrlResponse = await b2Client.getUploadUrl({
            bucketId,
        });

        // 4. Upload the file directly from the buffer.
        await b2Client.uploadFile({
            uploadUrl: uploadUrlResponse.data.uploadUrl,
            uploadAuthToken: uploadUrlResponse.data.authorizationToken,
            fileName,
            data: file.buffer, // Use the buffer directly from the file object
            mime: file.mimetype, // Use the mimetype from the file object
        });

        // 5. Construct and return the final public URL.
        const b2ImagePath = `${process.env.BACKBLAZE_IMAGE_URL_PREFIX}/${fileName}`;
        return b2ImagePath;

    } catch (error) {
        console.error("Error uploading avatar to B2:", error);
        throw error; // Re-throw the error to be handled by the calling route
    }
};



const deleteFile = async (fileName) => {
  try {
    await b2Client.authorize();
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

    return true;
  } catch (error) {
    console.error('Error deleting file from Backblaze B2:', error);
    throw error;
  }
};


// ------------------------------------------------------ helper functions to upload recipe image to Backblaze B2 ----------------------------------------------
// Function to download image from URL
const downloadImage = async (url, outputPath) => {

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
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;
    
    // Read file into buffer instead of using a stream
    const fileBuffer = await fsPromises.readFile(filePath);

    await b2Client.authorize();

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

  } catch (error) {
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Clean up temporary files
const cleanupTempFile = async (filePath) => {
  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting temporary file ${filePath}:`, error);
    throw error;
  }
};


const b2 = {
  handleB2Upload: uploadRecipeImage,
  uploadUserAvatar,
  deleteFile
}

export default b2;
