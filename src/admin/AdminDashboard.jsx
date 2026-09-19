import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getDocuments,
  updateDocument,
  deleteDocument,
  COLLECTIONS,
} from '../firebase/firestore';

import { logoutAdmin } from '../firebase/auth';

import AdminGallery from './AdminGallery';

import '../styles/admin.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const [customRequests, setCustomRequests] = useState([]);
  const [visitRequests, setVisitRequests] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const [
        customData,
        visitData,
        galleryData,
      ] = await Promise.all([
        getDocuments(COLLECTIONS.CUSTOM_DESIGN_REQUESTS),
        getDocuments(COLLECTIONS.VISIT_REQUESTS),
        getDocuments(COLLECTIONS.GALLERY),
      ]);

      setCustomRequests(customData);
      setVisitRequests(visitData);
      setGalleryItems(galleryData);
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateRequestStatus = async (
    collectionName,
    requestId,
    status
  ) => {
    try {
      setError('');

      await updateDocument(collectionName, requestId, {
        status,
      });

      if (collectionName === COLLECTIONS.CUSTOM_DESIGN_REQUESTS) {
        setCustomRequests((previous) =>
          previous.map((request) =>
            request.id === requestId
              ? { ...request, status }
              : request
          )
        );
      }

      if (collectionName === COLLECTIONS.VISIT_REQUESTS) {
        setVisitRequests((previous) =>
          previous.map((request) =>
            request.id === requestId
              ? { ...request, status }
              : request
          )
        );
      }
    } catch (error) {
      console.error('Status update error:', error);
      setError('Unable to update request status.');
    }
  };

  const deleteRequest = async (
    collectionName,
    requestId
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this completed request? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await deleteDocument(collectionName, requestId);

      if (collectionName === COLLECTIONS.CUSTOM_DESIGN_REQUESTS) {
        setCustomRequests((previous) =>
          previous.filter(
            (request) => request.id !== requestId
          )
        );
      }

      if (collectionName === COLLECTIONS.VISIT_REQUESTS) {
        setVisitRequests((previous) =>
          previous.filter(
            (request) => request.id !== requestId
          )
        );
      }
    } catch (error) {
      console.error('Delete request error:', error);
      setError('Unable to delete request.');
    }
  };

  const totalRequests =
    customRequests.length + visitRequests.length;

  const newRequests = useMemo(() => {
    return [...customRequests, ...visitRequests].filter(
      (request) => request.status === 'New'
    ).length;
  }, [customRequests, visitRequests]);

  const contactedRequests = useMemo(() => {
    return [...customRequests, ...visitRequests].filter(
      (request) => request.status === 'Contacted'
    ).length;
  }, [customRequests, visitRequests]);

  const completedRequests = useMemo(() => {
    return [...customRequests, ...visitRequests].filter(
      (request) => request.status === 'Completed'
    ).length;
  }, [customRequests, visitRequests]);

  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-container">
          <div className="admin-loading">
            <span className="admin-loading-spinner"></span>
            <p>Loading dashboard...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-container">

        {/* HEADER */}

        <header className="admin-header">

          <div className="admin-header-content">

            <p className="admin-eyebrow">
              Prema Tailoring & Design
            </p>

            <h1>Admin Dashboard</h1>

            <p className="admin-header-description">
              Manage customer requests, appointments, and
              gallery images.
            </p>

          </div>

          <div className="admin-header-actions">

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => loadRequests(true)}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div className="admin-error">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Close error"
            >
              ×
            </button>

          </div>
        )}

        {/* STATISTICS */}

        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Requests</span>
            <strong>{totalRequests}</strong>
          </div>

          <div className="admin-stat-card">
            <span>New</span>
            <strong>{newRequests}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Contacted</span>
            <strong>{contactedRequests}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Completed</span>
            <strong>{completedRequests}</strong>
          </div>

        </div>

        {/* CUSTOM DESIGN REQUESTS */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <p className="admin-eyebrow">
                Customer Requests
              </p>

              <h2>Custom Design Requests</h2>

            </div>

            <span className="admin-count">
              {customRequests.length}
            </span>

          </div>

          {customRequests.length === 0 ? (
            <div className="admin-empty">

              <h3>No custom design requests</h3>

              <p>
                New custom design requests will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-request-grid">

              {customRequests.map((request) => (

                <article
                  className="admin-request-card"
                  key={request.id}
                >

                  {/* CARD HEADER */}

                  <div className="admin-card-top">

                    <div className="admin-card-title">

                      <h3>{request.name}</h3>

                      <span className="admin-request-type">
                        Custom Design
                      </span>

                    </div>

                    <span
                      className={`admin-status admin-status-${(
                        request.status || 'New'
                      )
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {request.status || 'New'}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="admin-request-details">

                    <p>
                      <strong>Phone</strong>
                      <span>{request.phone}</span>
                    </p>

                    <p>
                      <strong>Garment</strong>
                      <span>{request.garmentType}</span>
                    </p>

                    {request.description && (
                      <p>
                        <strong>Description</strong>
                        <span>{request.description}</span>
                      </p>
                    )}

                  </div>

                  {/* REFERENCE IMAGE */}

                  {request.referenceImageUrl && (
                    <a
                      className="admin-image-link"
                      href={request.referenceImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Reference Image
                    </a>
                  )}

                  {/* CONTACT ACTIONS */}

                  <div className="admin-card-actions">

                    <a
                      className="admin-action-button"
                      href={`tel:${request.phone}`}
                    >
                      Call
                    </a>

                    <a
                      className="admin-action-button"
                      href={`https://wa.me/${request.phone.replace(
                        /\D/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>

                  </div>

                  {/* STATUS ACTIONS */}

                  <div className="admin-status-actions">

                    {request.status === 'New' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRequestStatus(
                            COLLECTIONS.CUSTOM_DESIGN_REQUESTS,
                            request.id,
                            'Contacted'
                          )
                        }
                      >
                        Mark Contacted
                      </button>
                    )}

                    {request.status === 'Contacted' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRequestStatus(
                            COLLECTIONS.CUSTOM_DESIGN_REQUESTS,
                            request.id,
                            'Completed'
                          )
                        }
                      >
                        Mark Completed
                      </button>
                    )}

                    {request.status === 'Completed' && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteRequest(
                            COLLECTIONS.CUSTOM_DESIGN_REQUESTS,
                            request.id
                          )
                        }
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

        {/* VISIT REQUESTS */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <p className="admin-eyebrow">
                Appointments
              </p>

              <h2>Visit Requests</h2>

            </div>

            <span className="admin-count">
              {visitRequests.length}
            </span>

          </div>

          {visitRequests.length === 0 ? (
            <div className="admin-empty">

              <h3>No visit requests</h3>

              <p>
                New appointment requests will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-request-grid">

              {visitRequests.map((request) => (

                <article
                  className="admin-request-card"
                  key={request.id}
                >

                  {/* CARD HEADER */}

                  <div className="admin-card-top">

                    <div className="admin-card-title">

                      <h3>{request.name}</h3>

                      <span className="admin-request-type">
                        Visit Request
                      </span>

                    </div>

                    <span
                      className={`admin-status admin-status-${(
                        request.status || 'New'
                      )
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {request.status || 'New'}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="admin-request-details">

                    <p>
                      <strong>Phone</strong>
                      <span>{request.phone}</span>
                    </p>

                    <p>
                      <strong>Service</strong>
                      <span>{request.service}</span>
                    </p>

                    <p>
                      <strong>Preferred Date</strong>
                      <span>{request.preferredDate}</span>
                    </p>

                    <p>
                      <strong>Preferred Time</strong>
                      <span>{request.preferredTime}</span>
                    </p>

                    {request.message && (
                      <p>
                        <strong>Message</strong>
                        <span>{request.message}</span>
                      </p>
                    )}

                  </div>

                  {/* CONTACT ACTIONS */}

                  <div className="admin-card-actions">

                    <a
                      className="admin-action-button"
                      href={`tel:${request.phone}`}
                    >
                      Call
                    </a>

                    <a
                      className="admin-action-button"
                      href={`https://wa.me/${request.phone.replace(
                        /\D/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>

                  </div>

                  {/* STATUS ACTIONS */}

                  <div className="admin-status-actions">

                    {request.status === 'New' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRequestStatus(
                            COLLECTIONS.VISIT_REQUESTS,
                            request.id,
                            'Contacted'
                          )
                        }
                      >
                        Mark Contacted
                      </button>
                    )}

                    {request.status === 'Contacted' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRequestStatus(
                            COLLECTIONS.VISIT_REQUESTS,
                            request.id,
                            'Completed'
                          )
                        }
                      >
                        Mark Completed
                      </button>
                    )}

                    {request.status === 'Completed' && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteRequest(
                            COLLECTIONS.VISIT_REQUESTS,
                            request.id
                          )
                        }
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

        {/* GALLERY MANAGEMENT */}

        <AdminGallery
          galleryItems={galleryItems}
          onGalleryChange={() => loadRequests(true)}
        />

      </section>
    </main>
  );
}

export default AdminDashboard;