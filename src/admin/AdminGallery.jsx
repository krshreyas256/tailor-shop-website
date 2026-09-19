import { useState } from 'react';

import {
  addDocument,
  deleteDocument,
  COLLECTIONS,
} from '../firebase/firestore';

import { uploadImage } from '../cloudinary/upload';

function AdminGallery({ galleryItems, onGalleryChange }) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Please enter a project title.');
      return;
    }

    if (!image) {
      setError('Please select an image.');
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadImage(image);

      await addDocument(COLLECTIONS.GALLERY, {
        title: title.trim(),
        imageUrl,
      });

      setTitle('');
      setImage(null);

      event.target.reset();

      setSuccess('Gallery image added successfully.');

      if (onGalleryChange) {
        await onGalleryChange();
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      setError('Unable to upload the gallery image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}" from the gallery?\n\n` +
      `This will remove the gallery entry from the website. ` +
      `The Cloudinary image will not be deleted automatically.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setError('');
      setSuccess('');

      await deleteDocument(
        COLLECTIONS.GALLERY,
        item.id
      );

      setSuccess(
        `"${item.title}" was removed from the gallery.`
      );

      if (onGalleryChange) {
        await onGalleryChange();
      }
    } catch (error) {
      console.error('Gallery delete error:', error);
      setError('Unable to delete the gallery image.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-gallery">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">Website Gallery</p>
          <h2>Manage Gallery</h2>
        </div>

        <span className="admin-count">
          {galleryItems.length}
        </span>
      </div>

      <form
        className="admin-gallery-form"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-group">
          <label htmlFor="gallery-title">
            Project Title
          </label>

          <input
            id="gallery-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Example: Bridal Blouse"
            disabled={uploading}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="gallery-image">
            Project Image
          </label>

          <input
            id="gallery-image"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setImage(event.target.files?.[0] || null)
            }
            disabled={uploading}
          />
        </div>

        {error && (
          <p className="admin-form-error">
            {error}
          </p>
        )}

        {success && (
          <p className="admin-form-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="admin-gallery-submit"
          disabled={uploading}
        >
          {uploading
            ? 'Uploading...'
            : 'Add to Gallery'}
        </button>
      </form>

      <div className="admin-gallery-grid">
        {galleryItems.length === 0 ? (
          <div className="admin-empty">
            <h3>No gallery images yet</h3>
            <p>
              Add your first project image above.
            </p>
          </div>
        ) : (
          galleryItems.map((item) => (
            <article
              className="admin-gallery-card"
              key={item.id}
            >
              <div className="admin-gallery-image">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                />
              </div>

              <div className="admin-gallery-card-content">
                <h3>{item.title}</h3>

                <button
                  type="button"
                  className="admin-gallery-delete"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminGallery;