import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

import app from './config';

export const db = getFirestore(app);

/* =========================
   COLLECTIONS
   ========================= */

export const COLLECTIONS = {
  GALLERY: 'gallery',
  CUSTOM_DESIGN_REQUESTS: 'customDesignRequests',
  VISIT_REQUESTS: 'visitRequests',
};

/* =========================
   ADD DOCUMENT
   ========================= */

export const addDocument = async (collectionName, data) => {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

/* =========================
   GET DOCUMENTS
   ========================= */

export const getDocuments = async (collectionName) => {
  const collectionRef = collection(db, collectionName);

  const documentsQuery = query(
    collectionRef,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(documentsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const subscribeToDocuments = (
  collectionName,
  callback,
  onError
) => {
  const collectionRef = collection(db, collectionName);

  const documentsQuery = query(
    collectionRef,
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    documentsQuery,
    (snapshot) => {
      const documents = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      callback(documents, snapshot);
    },
    (error) => {
      console.error(
        `Real-time listener error (${collectionName}):`,
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
};

/* =========================
   UPDATE DOCUMENT
   ========================= */

export const updateDocument = async (
  collectionName,
  documentId,
  data
) => {
  const documentRef = doc(db, collectionName, documentId);

  return updateDoc(documentRef, data);
};

/* =========================
   DELETE DOCUMENT
   ========================= */

export const deleteDocument = async (
  collectionName,
  documentId
) => {
  const documentRef = doc(db, collectionName, documentId);

  return deleteDoc(documentRef);
};