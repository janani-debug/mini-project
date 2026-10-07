import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const REGISTRATIONS_COLLECTION = 'registrations';

// Helper function to race Firestore promises against a timeout
function withTimeout(promise, ms = 3500) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firestore request timed out'));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Utility function to generate a random 12-character unique alphanumeric token
export function generateRandomQRToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Register student for an event
export async function registerParticipant(registrationData) {
  const { eventId, participantName, email, phone, department, year } = registrationData;
  
  if (!eventId || !participantName || !email || !phone || !department || !year) {
    throw new Error('All required fields must be filled.');
  }

  const qrToken = generateRandomQRToken();

  const registrationObject = {
    eventId,
    participantName,
    email,
    phone,
    department,
    year,
    qrToken,
    attendance: 'Not Marked',
    attendanceMarkedAt: null,
    createdAt: new Date().toISOString()
  };

  let docId = 'reg-' + Date.now();

  try {
    const registrationRef = collection(db, REGISTRATIONS_COLLECTION);
    const addPromise = addDoc(registrationRef, {
      ...registrationObject,
      createdAt: serverTimestamp()
    });
    
    const newDoc = await withTimeout(addPromise, 4000);
    if (newDoc && newDoc.id) {
      docId = newDoc.id;
    }
  } catch (error) {
    console.warn('Firestore write notice (storing in local fallback cache):', error);
  }

  // Always save a copy in fallback storage so registration is never lost
  try {
    const existing = JSON.parse(localStorage.getItem('fallback_registrations') || '[]');
    if (!existing.some(r => r.qrToken === qrToken)) {
      existing.push({ id: docId, ...registrationObject });
      localStorage.setItem('fallback_registrations', JSON.stringify(existing));
    }
  } catch (e) {
    console.error('Error saving local fallback registration:', e);
  }

  return {
    docId,
    qrToken,
    participantName,
    email,
    phone,
    department,
    year
  };
}

// Get registrations for a specific event
export async function getRegistrationsByEvent(eventId) {
  let firestoreRegs = [];
  try {
    const regRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(regRef, where('eventId', '==', eventId));
    const snapshot = await withTimeout(getDocs(q), 3000);
    firestoreRegs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('Could not fetch event registrations from Firestore:', error);
  }

  let localRegs = [];
  try {
    const allLocal = JSON.parse(localStorage.getItem('fallback_registrations') || '[]');
    localRegs = allLocal.filter(r => r.eventId === eventId);
  } catch (e) {}

  const combined = [...firestoreRegs];
  for (const local of localRegs) {
    if (!combined.some(r => r.qrToken === local.qrToken)) {
      combined.push(local);
    }
  }

  return combined;
}

// Get all registrations across events
export async function getAllRegistrations() {
  let firestoreRegs = [];
  try {
    const regRef = collection(db, REGISTRATIONS_COLLECTION);
    const snapshot = await withTimeout(getDocs(regRef), 3000);
    firestoreRegs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('Could not fetch all registrations from Firestore:', error);
  }

  let localRegs = [];
  try {
    localRegs = JSON.parse(localStorage.getItem('fallback_registrations') || '[]');
  } catch (e) {}

  const combined = [...firestoreRegs];
  for (const local of localRegs) {
    if (!combined.some(r => r.qrToken === local.qrToken)) {
      combined.push(local);
    }
  }

  return combined;
}
