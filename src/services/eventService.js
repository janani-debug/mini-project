import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const EVENTS_COLLECTION = 'events';

// Timeout helper function to prevent infinite hanging when Firestore is slow or offline
function withTimeout(promise, ms = 3500) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firestore request timed out (connection slow or blocked).'));
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

// Default fallback events list so Published events appear immediately without infinite loading
const INITIAL_EVENTS = [
  {
    id: 'evt-tech-quiz',
    name: 'Technical Quiz Competition',
    posterUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    date: '2026-09-15',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: 'Main Auditorium, Block A',
    description: 'A thrilling technical quiz competition testing programming, algorithm logic, and tech trivia skills across multiple rounds.',
    eligibility: 'Open to all undergraduate & postgraduate students',
    rules: 'Teams of 2 members. Mobile phones prohibited during rounds. Decision of judges is final.',
    whatsappLink: 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
    status: 'Published',
    roles: [
      { id: '1', roleName: 'Quiz Master', assignedPerson: 'Prof. R. Sharma', contact: 'quizmaster@domain.com' },
      { id: '2', roleName: 'Event Coordinator', assignedPerson: 'Alex Rivera', contact: '+1 555-0192' }
    ]
  },
  {
    id: 'evt-ai-workshop',
    name: 'AI & Web Development Workshop',
    posterUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    date: '2026-09-20',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    venue: 'Computer Lab 3, 2nd Floor',
    description: 'Hands-on practical workshop covering modern React development, AI API integration, and cloud backend hosting.',
    eligibility: 'Basic knowledge of JavaScript & HTML',
    rules: 'Bring your own laptop with Node.js pre-installed.',
    whatsappLink: 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
    status: 'Published',
    roles: [
      { id: '1', roleName: 'Lead Trainer', assignedPerson: 'Sarah Jenkins', contact: 'sarah.trains@domain.com' },
      { id: '2', roleName: 'Lab Coordinator', assignedPerson: 'Michael Scott', contact: '+1 555-0188' }
    ]
  },
  {
    id: 'evt-cultural-fest',
    name: 'Annual Youth Cultural Fest',
    posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60',
    date: '2026-10-05',
    startTime: '05:00 PM',
    endTime: '09:00 PM',
    venue: 'Open Air Amphitheatre',
    description: 'A grand evening celebrating music, dance, drama, and creative arts showcasing student talent.',
    eligibility: 'All registered students',
    rules: 'Valid ID card required for entry.',
    whatsappLink: 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
    status: 'Published',
    roles: [
      { id: '1', roleName: 'Chief Guest', assignedPerson: 'Dr. V. K. Nambiar', contact: 'guest@domain.com' },
      { id: '2', roleName: 'Stage Coordinator', assignedPerson: 'Jessica Taylor', contact: '+1 555-0144' }
    ]
  }
];

function getStoredEvents() {
  try {
    const data = localStorage.getItem('app_events');
    if (data) return JSON.parse(data);
    localStorage.setItem('app_events', JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  } catch (e) {
    return INITIAL_EVENTS;
  }
}

function saveStoredEvents(events) {
  try {
    localStorage.setItem('app_events', JSON.stringify(events));
  } catch (e) {}
}

// Fetch published events for students
export async function getPublishedEvents() {
  let firestoreEvents = [];
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, where('status', '==', 'Published'));
    const snapshot = await withTimeout(getDocs(q), 3500);
    firestoreEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('Firestore getPublishedEvents notice (using cached events):', error.message || error);
  }

  const stored = getStoredEvents().filter(e => e.status === 'Published');
  const combined = [...firestoreEvents];
  for (const item of stored) {
    if (!combined.some(e => e.id === item.id || e.name === item.name)) {
      combined.push(item);
    }
  }

  return combined;
}

// Fetch all events for admin dashboard & attendance
export async function getAllEvents() {
  let firestoreEvents = [];
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const snapshot = await withTimeout(getDocs(eventsRef), 3500);
    firestoreEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('Firestore getAllEvents notice (using cached events):', error.message || error);
  }

  const stored = getStoredEvents();
  const combined = [...firestoreEvents];
  for (const item of stored) {
    if (!combined.some(e => e.id === item.id || e.name === item.name)) {
      combined.push(item);
    }
  }

  return combined;
}

// Fetch single event details
export async function getEventById(eventId) {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    const docSnap = await withTimeout(getDoc(docRef), 3500);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (error) {
    console.warn('Firestore getEventById notice:', error.message || error);
  }

  const stored = getStoredEvents();
  const found = stored.find(e => e.id === eventId);
  return found || null;
}

// Create a new event
export async function createEvent(eventData) {
  const newId = 'evt-' + Date.now();
  const newEvt = {
    id: newId,
    ...eventData,
    whatsappLink: eventData.whatsappLink || 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
    status: eventData.status || 'Published',
    roles: eventData.roles || []
  };

  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const docRef = await withTimeout(addDoc(eventsRef, {
      ...newEvt,
      createdAt: serverTimestamp()
    }), 3500);
    if (docRef && docRef.id) {
      newEvt.id = docRef.id;
    }
  } catch (error) {
    console.warn('Firestore createEvent notice (saved to local cache):', error.message || error);
  }

  const stored = getStoredEvents();
  stored.unshift(newEvt);
  saveStoredEvents(stored);
  return newEvt.id;
}

// Update existing event
export async function updateEvent(eventId, eventData) {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await withTimeout(updateDoc(docRef, {
      ...eventData,
      whatsappLink: eventData.whatsappLink || 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
      updatedAt: serverTimestamp()
    }), 3500);
  } catch (error) {
    console.warn('Firestore updateEvent notice:', error.message || error);
  }

  const stored = getStoredEvents();
  const idx = stored.findIndex(e => e.id === eventId);
  if (idx !== -1) {
    stored[idx] = { ...stored[idx], ...eventData };
    saveStoredEvents(stored);
  }
}

// Delete an event
export async function deleteEvent(eventId) {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await withTimeout(deleteDoc(docRef), 3500);
  } catch (error) {
    console.warn('Firestore deleteEvent notice:', error.message || error);
  }

  const stored = getStoredEvents();
  const filtered = stored.filter(e => e.id !== eventId);
  saveStoredEvents(filtered);
}
