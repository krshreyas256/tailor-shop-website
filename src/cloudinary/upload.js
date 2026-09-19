const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  const formData = new FormData();

  formData.append('file', file);
  formData.append(
    'upload_preset',
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed.');
  }

  const data = await response.json();

  return data.secure_url;
};