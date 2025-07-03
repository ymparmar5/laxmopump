// src/utils/cloudinary.js
import { Cloudinary } from 'cloudinary-core';

const cloudinaryCore = new Cloudinary({ cloud_name: 'dn5vvxkra' });

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'products'); // Replace with your upload preset
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
   
    if (data.secure_url) {
      const transformedUrl = cloudinaryCore.url(data.public_id, {
        transformation: [
          { width: 800, crop: "limit" }, // Resize to fit within 800px width
          { fetch_format: "auto" }, // Convert to optimal format
          { quality: "auto" } // Adjust quality for optimal file size
        ]
      });
      return transformedUrl;
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};



  
 

