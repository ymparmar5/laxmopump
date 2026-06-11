// src/utils/cloudinary.js
import { Cloudinary } from 'cloudinary-core';

const cloudinaryCore = new Cloudinary({ cloud_name: 'dn5vvxkra' });

const CLOUD_NAME = "dn5vvxkra";
const UPLOAD_PRESET = "Images";

export const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Upload failed");
    }
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'category'); // Replace with your upload preset
  
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
      // const transformedUrl = cloudinaryCore.url(data.public_id, {
      //   transformation: [
      //     { width: 800, crop: "limit" }, // Resize to fit within 800px width
      //     { fetch_format: "auto" }, // Convert to optimal format
      //     { quality: "auto" } // Adjust quality for optimal file size
      //   ]
      // });
      return data.secure_url;
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

const handleImageUpload = async (e, index) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!user) {
    alert("You must be logged in to upload images.");
    return;
  }

  try {
    const imageUrl = await uploadToCloudinary(file);

    // Update Firestore with new image URL
    const categoryRef = doc(fireDB, "categories", category[index].id);
    await setDoc(categoryRef, { ...category[index], image: imageUrl });

    fetchCategories();
    alert("Image uploaded & URL stored in Firestore successfully.");
  } catch (error) {
    alert("Image upload failed: " + error.message);
  }
};

  



