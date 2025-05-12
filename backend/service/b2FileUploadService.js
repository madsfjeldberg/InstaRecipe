import B2 from 'backblaze-b2';
import fs from 'fs';
import https from 'https';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';
import 'dotenv/config';

const b2Client = new B2({
  accountId: process.env.BACKBLAZE_ACCOUNT_ID,
  applicationKey: process.env.BACKBLAZE_API_KEY,
});

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

const uploadImage = async (filePath) => {
  try {
    console.log('Uploading file to Backblaze B2...');
    const fileName = filePath.split('/').pop();
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
    console.error('Error uploading file:', error);
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
  const tempDir = path.join(os.tmpdir(), 'images');
  const fileName = `${uuidv4()}.jpg`;
  const tempFilePath = path.join(tempDir, fileName);
  await downloadImage(imageUrl, tempFilePath);
  await uploadImage(tempFilePath);
  await cleanupTempFile(tempFilePath);

  const b2ImagePath = `${process.env.BACKBLAZE_IMAGE_URL_PREFIX}/${fileName}`;
  return b2ImagePath;
}

const b2 = {
  handleB2Upload
}

export default b2;
