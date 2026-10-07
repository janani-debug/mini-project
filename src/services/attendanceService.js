import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const REGISTRATIONS_COLLECTION = 'registrations';

function withTimeout(promise, ms = 3000) {
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

export async function processQRTokenScan(selectedEventId, token) {
  if (!token || !selectedEventId) {
    return {
      success: false,
      code: 'INVALID_INPUT',
      message: 'Please select an event first.'
    };
  }

  const cleanToken = token.trim();

  // 1. Try Firestore Lookup
  try {
    const regRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(regRef, where('qrToken', '==', cleanToken));
    const snapshot = await withTimeout(getDocs(q), 3000);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const regData = { id: docSnap.id, ...docSnap.data() };

      if (regData.eventId !== selectedEventId) {
        return {
          success: false,
          code: 'WRONG_EVENT',
          message: 'This QR Code is not registered for this event.',
          participant: regData
        };
      }

      if (regData.attendance === 'present') {
        return {
          success: false,
          code: 'ALREADY_MARKED',
          message: 'Attendance Already Marked',
          participant: regData
        };
      }

      // Mark attendance as present in Firestore
      try {
        const registrationDocRef = doc(db, REGISTRATIONS_COLLECTION, regData.id);
        await updateDoc(registrationDocRef, {
          attendance: 'present',
          attendanceMarkedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore attendance update notice:', err);
      }

      // Also update local fallback cache if present
      try {
        const localRegs = JSON.parse(localStorage.getItem('fallback_registrations') || '[]');
        const idx = localRegs.findIndex(r => r.qrToken === cleanToken);
        if (idx !== -1) {
          localRegs[idx].attendance = 'present';
          localRegs[idx].attendanceMarkedAt = new Date().toISOString();
          localStorage.setItem('fallback_registrations', JSON.stringify(localRegs));
        }
      } catch (e) {}

      return {
        success: true,
        code: 'VALID',
        message: 'Attendance Marked Successfully',
        participant: {
          ...regData,
          attendance: 'present'
        }
      };
    }
  } catch (error) {
    console.warn('Firestore scan lookup notice:', error);
  }

  // 2. Try Fallback Local Cache Lookup
  try {
    const localRegs = JSON.parse(localStorage.getItem('fallback_registrations') || '[]');
    const localIndex = localRegs.findIndex(r => r.qrToken === cleanToken);

    if (localIndex !== -1) {
      const regData = localRegs[localIndex];

      if (regData.eventId !== selectedEventId) {
        return {
          success: false,
          code: 'WRONG_EVENT',
          message: 'This QR Code is not registered for this event.',
          participant: regData
        };
      }

      if (regData.attendance === 'present') {
        return {
          success: false,
          code: 'ALREADY_MARKED',
          message: 'Attendance Already Marked',
          participant: regData
        };
      }

      localRegs[localIndex].attendance = 'present';
      localRegs[localIndex].attendanceMarkedAt = new Date().toISOString();
      localStorage.setItem('fallback_registrations', JSON.stringify(localRegs));

      return {
        success: true,
        code: 'VALID',
        message: 'Attendance Marked Successfully',
        participant: {
          ...regData,
          attendance: 'present'
        }
      };
    }
  } catch (e) {
    console.error('Local fallback scan error:', e);
  }

  return {
    success: false,
    code: 'INVALID_TOKEN',
    message: 'Invalid QR Code'
  };
}

// Alias function required by prompt specifications
export async function scanAndMarkAttendance(eventId, qrToken) {
  return processQRTokenScan(eventId, qrToken);
}
