import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getDocuments,
  subscribeToDocuments,
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
  const [error, setError] = useState('');

  const [newRequest, setNewRequest] = useState(null);

  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState('default');


  /*
   * ========================================
   * LOAD REQUESTS + GALLERY
   * ========================================
   */

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        customDesignDocuments,
        visitDocuments,
        galleryDocuments,
      ] = await Promise.all([
        getDocuments(COLLECTIONS.CUSTOM_DESIGN_REQUESTS),
        getDocuments(COLLECTIONS.VISIT_REQUESTS),
        getDocuments(COLLECTIONS.GALLERY),
      ]);

      setCustomRequests(customDesignDocuments);
      setVisitRequests(visitDocuments);
      setGalleryItems(galleryDocuments);
    } catch (error) {
      console.error('Admin dashboard loading error:', error);
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const refreshGallery = async () => {
    try {
      const galleryDocuments = await getDocuments(
        COLLECTIONS.GALLERY
      );

      setGalleryItems(galleryDocuments);
    } catch (error) {
      console.error('Gallery loading error:', error);
      setError('Unable to load gallery data.');
    }
  };


  /*
   * ========================================
   * INITIAL LOAD
   * ========================================
   */

  useEffect(() => {
    loadRequests();
  }, []);


  /*
   * ========================================
   * CHECK BROWSER NOTIFICATION SUPPORT
   * ========================================
   */

  useEffect(() => {
    if (!('Notification' in window)) {
      return;
    }

    setBrowserNotificationPermission(
      Notification.permission
    );
  }, []);


  /*
   * ========================================
   * BROWSER NOTIFICATION
   * ========================================
   */

  const showBrowserNotification = (
    type,
    request
  ) => {
    if (
      !('Notification' in window) ||
      Notification.permission !== 'granted'
    ) {
      return;
    }

    const notification = new Notification(
      'Prema Tailoring & Design',
      {
        body: `New ${type} from ${
          request.name || 'a customer'
        }.`,
        tag: `new-${request.id}`,
      }
    );

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };



  /*
   * ========================================
   * REAL-TIME REQUEST LISTENERS
   * ========================================
   */

  useEffect(() => {
    let customListenerReady = false;
    let visitListenerReady = false;

    const knownCustomRequestIds = new Set();
    const knownVisitRequestIds = new Set();

    const unsubscribeCustom = subscribeToDocuments(
      COLLECTIONS.CUSTOM_DESIGN_REQUESTS,
      (documents) => {
        /*
         * The first snapshot establishes the existing
         * requests. They should not trigger notifications.
         */
        if (!customListenerReady) {
          documents.forEach((document) => {
            knownCustomRequestIds.add(document.id);
          });

          customListenerReady = true;
          setCustomRequests(documents);

          return;
        }

        /*
         * Find a genuinely new request.
         */
        const newlyAddedRequest = documents.find(
          (document) =>
            !knownCustomRequestIds.has(document.id)
        );

        /*
         * Keep known IDs up to date.
         */
        documents.forEach((document) => {
          knownCustomRequestIds.add(document.id);
        });

        setCustomRequests(documents);

        if (newlyAddedRequest) {
          setNewRequest({
            type: 'Custom Design Request',
            data: newlyAddedRequest,
          });

          showBrowserNotification(
            'Custom Design Request',
            newlyAddedRequest
          );
        }
      },
      (error) => {
        console.error(
          'Custom design real-time listener error:',
          error
        );
      }
    );

    const unsubscribeVisit = subscribeToDocuments(
      COLLECTIONS.VISIT_REQUESTS,
      (documents) => {
        /*
         * The first snapshot establishes the existing
         * requests. They should not trigger notifications.
         */
        if (!visitListenerReady) {
          documents.forEach((document) => {
            knownVisitRequestIds.add(document.id);
          });

          visitListenerReady = true;
          setVisitRequests(documents);

          return;
        }

        /*
         * Find a genuinely new request.
         */
        const newlyAddedRequest = documents.find(
          (document) =>
            !knownVisitRequestIds.has(document.id)
        );

        /*
         * Keep known IDs up to date.
         */
        documents.forEach((document) => {
          knownVisitRequestIds.add(document.id);
        });

        setVisitRequests(documents);

        if (newlyAddedRequest) {
          setNewRequest({
            type: 'Visit Request',
            data: newlyAddedRequest,
          });

          showBrowserNotification(
            'Visit Request',
            newlyAddedRequest
          );
        }
      },
      (error) => {
        console.error(
          'Visit request real-time listener error:',
          error
        );
      }
    );

    return () => {
      unsubscribeCustom();
      unsubscribeVisit();
    };
  }, []);


  /*
   * ========================================
   * ENABLE BROWSER NOTIFICATIONS
   * ========================================
   */

  const enableBrowserNotifications = async () => {
    if (!('Notification' in window)) {
      return;
    }

    try {
      const permission =
        await Notification.requestPermission();

      setBrowserNotificationPermission(permission);
    } catch (error) {
      console.error(
        'Browser notification permission error:',
        error
      );
    }
  };


  /*
   * ========================================
   * DISMISS NOTIFICATION
   * ========================================
   */

  const dismissNewRequest = () => {
    setNewRequest(null);
  };


  /*
   * ========================================
   * UPDATE REQUEST STATUS
   * ========================================
   */

  const updateRequestStatus = async (
    collectionName,
    requestId,
    newStatus
  ) => {
    try {
      setError('');

      await updateDocument(
        collectionName,
        requestId,
        {
          status: newStatus,
        }
      );

      if (
        collectionName ===
        COLLECTIONS.CUSTOM_DESIGN_REQUESTS
      ) {
        setCustomRequests((currentRequests) =>
          currentRequests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: newStatus,
                }
              : request
          )
        );
      }

      if (
        collectionName === COLLECTIONS.VISIT_REQUESTS
      ) {
        setVisitRequests((currentRequests) =>
          currentRequests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: newStatus,
                }
              : request
          )
        );
      }
    } catch (error) {
      console.error(
        'Request status update error:',
        error
      );

      setError(
        'Unable to update the request status.'
      );
    }
  };


  /*
   * ========================================
   * DELETE COMPLETED REQUEST
   * ========================================
   */

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

      await deleteDocument(
        collectionName,
        requestId
      );

      if (
        collectionName ===
        COLLECTIONS.CUSTOM_DESIGN_REQUESTS
      ) {
        setCustomRequests((currentRequests) =>
          currentRequests.filter(
            (request) => request.id !== requestId
          )
        );
      }

      if (
        collectionName === COLLECTIONS.VISIT_REQUESTS
      ) {
        setVisitRequests((currentRequests) =>
          currentRequests.filter(
            (request) => request.id !== requestId
          )
        );
      }
    } catch (error) {
      console.error(
        'Request deletion error:',
        error
      );

      setError(
        'Unable to delete the request.'
      );
    }
  };


  /*
   * ========================================
   * LOGOUT
   * ========================================
   */

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login');
    } catch (error) {
      console.error(
        'Admin logout error:',
        error
      );

      setError('Unable to log out.');
    }
  };


  /*
   * ========================================
   * REQUEST COUNTS
   * ========================================
   */

  const allRequests = [
    ...customRequests,
    ...visitRequests,
  ];

  const totalRequests = allRequests.length;

  const newRequestsCount = allRequests.filter(
    (request) => request.status === 'New'
  ).length;

  const contactedRequestsCount = allRequests.filter(
    (request) => request.status === 'Contacted'
  ).length;

  const completedRequestsCount = allRequests.filter(
    (request) => request.status === 'Completed'
  ).length;


  /*
   * ========================================
   * FORMAT DATE
   * ========================================
   */

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return 'Date unavailable';
    }

    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return 'Date unavailable';
    }
  };


  /*
   * ========================================
   * REQUEST CARD
   * ========================================
   */

  const renderRequestCard = (
    request,
    collectionName,
    type
  ) => {
    const status = request.status || 'New';

    return (
      <article
        className="admin-request-card"
        key={request.id}
      >
        <div className="admin-request-card-header">
          <div>
            <span className="admin-request-type">
              {type}
            </span>

            <h3>{request.name}</h3>
          </div>

          <span
            className={`admin-status admin-status-${status.toLowerCase()}`}
          >
            {status}
          </span>
        </div>

        <div className="admin-request-details">
          <p>
            <strong>Phone:</strong>{' '}
            {request.phone || 'Not provided'}
          </p>

          {type === 'Custom Design Request' && (
            <>
              <p>
                <strong>Garment:</strong>{' '}
                {request.garmentType ||
                  'Not specified'}
              </p>

              <p>
                <strong>Description:</strong>{' '}
                {request.description ||
                  'No description provided'}
              </p>

              {request.referenceImageUrl && (
                <p>
                  <strong>Reference image:</strong>{' '}
                  <a
                    href={request.referenceImageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Image
                  </a>
                </p>
              )}
            </>
          )}

          {type === 'Visit Request' && (
            <>
              <p>
                <strong>Service:</strong>{' '}
                {request.service ||
                  'Not specified'}
              </p>

              <p>
                <strong>Preferred date:</strong>{' '}
                {request.preferredDate ||
                  'Not specified'}
              </p>

              <p>
                <strong>Preferred time:</strong>{' '}
                {request.preferredTime ||
                  'Not specified'}
              </p>

              {request.message && (
                <p>
                  <strong>Message:</strong>{' '}
                  {request.message}
                </p>
              )}
            </>
          )}

          <p>
            <strong>Received:</strong>{' '}
            {formatDate(request.createdAt)}
          </p>
        </div>

        <div className="admin-request-actions">
          <a
            href={`tel:${request.phone}`}
            className="admin-action-button admin-call-button"
          >
            Call
          </a>

          <a
            href={`https://wa.me/${String(
              request.phone || ''
            ).replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="admin-action-button admin-whatsapp-button"
          >
            WhatsApp
          </a>

          {status === 'New' && (
            <button
              type="button"
              className="admin-action-button admin-status-button"
              onClick={() =>
                updateRequestStatus(
                  collectionName,
                  request.id,
                  'Contacted'
                )
              }
            >
              Mark Contacted
            </button>
          )}

          {status === 'Contacted' && (
            <button
              type="button"
              className="admin-action-button admin-status-button"
              onClick={() =>
                updateRequestStatus(
                  collectionName,
                  request.id,
                  'Completed'
                )
              }
            >
              Mark Completed
            </button>
          )}

          {status === 'Completed' && (
            <button
              type="button"
              className="admin-action-button admin-delete-button"
              onClick={() =>
                deleteRequest(
                  collectionName,
                  request.id
                )
              }
            >
              Delete
            </button>
          )}
        </div>
      </article>
    );
  };


  /*
   * ========================================
   * LOADING
   * ========================================
   */

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-loading">
          <p>Loading admin dashboard...</p>
        </div>
      </main>
    );
  }


  /*
   * ========================================
   * DASHBOARD
   * ========================================
   */

  return (
    <main className="admin-page">

      {/* ========================================
          ADMIN HEADER
      ======================================== */}

      <header className="admin-header">
        <div className="admin-header-content">

          <div>
            <p className="admin-eyebrow">
              Prema Tailoring & Design
            </p>

            <h1>Admin Dashboard</h1>
          </div>

          <div className="admin-header-actions">

            {browserNotificationPermission !== 'granted' &&
              browserNotificationPermission !== 'denied' && (
                <button
                  type="button"
                  className="admin-notification-button"
                  onClick={enableBrowserNotifications}
                >
                  Enable Notifications
                </button>
              )}

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </div>
      </header>


      {/* ========================================
          DASHBOARD CONTENT
      ======================================== */}

      <div className="admin-container">

        {/* ========================================
            NEW REQUEST NOTIFICATION
        ======================================== */}

        {newRequest && (
          <div className="admin-notification">

            <div className="admin-notification-icon">
              🔔
            </div>

            <div className="admin-notification-content">

              <p className="admin-notification-label">
                New Request
              </p>

              <h3>
                {newRequest.type}
              </h3>

              <p>
                {newRequest.data.name}
              </p>

            </div>

            <button
              type="button"
              className="admin-notification-dismiss"
              onClick={dismissNewRequest}
              aria-label="Dismiss notification"
            >
              ×
            </button>

          </div>
        )}


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="admin-error">
            <p>{error}</p>
          </div>
        )}


        {/* ========================================
            STATS
        ======================================== */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              Total Requests
            </span>

            <strong className="admin-stat-value">
              {totalRequests}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              New
            </span>

            <strong className="admin-stat-value">
              {newRequestsCount}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              Contacted
            </span>

            <strong className="admin-stat-value">
              {contactedRequestsCount}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              Completed
            </span>

            <strong className="admin-stat-value">
              {completedRequestsCount}
            </strong>
          </div>

        </section>


        {/* ========================================
            CUSTOM DESIGN REQUESTS
        ======================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                Customer Requests
              </p>

              <h2>
                Custom Design Requests
              </h2>
            </div>

            <span className="admin-count">
              {customRequests.length}
            </span>

          </div>

          {customRequests.length === 0 ? (
            <div className="admin-empty">

              <h3>
                No custom design requests
              </h3>

              <p>
                New customer requests will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-request-grid">

              {customRequests.map((request) =>
                renderRequestCard(
                  request,
                  COLLECTIONS.CUSTOM_DESIGN_REQUESTS,
                  'Custom Design Request'
                )
              )}

            </div>
          )}

        </section>


        {/* ========================================
            VISIT REQUESTS
        ======================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                Appointment Requests
              </p>

              <h2>
                Visit Requests
              </h2>
            </div>

            <span className="admin-count">
              {visitRequests.length}
            </span>

          </div>

          {visitRequests.length === 0 ? (
            <div className="admin-empty">

              <h3>
                No visit requests
              </h3>

              <p>
                New visit requests will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-request-grid">

              {visitRequests.map((request) =>
                renderRequestCard(
                  request,
                  COLLECTIONS.VISIT_REQUESTS,
                  'Visit Request'
                )
              )}

            </div>
          )}

        </section>


        {/* ========================================
            GALLERY
        ======================================== */}

        <AdminGallery
          galleryItems={galleryItems}
          onGalleryChange={refreshGallery}
        />

      </div>
    </main>
  );
}

export default AdminDashboard;