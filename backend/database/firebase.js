const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let firebaseApp;
let firebaseDB;

const initializeFirebase = () => {
  // Check if Firebase credentials are configured
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.log('⚠ Firebase not configured. Offline mode only.');
    return null;
  }

  try {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CERT_URL
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    firebaseDB = admin.database();
    console.log('✓ Firebase initialized successfully');
    return firebaseDB;
  } catch (error) {
    console.error('⚠ Firebase initialization failed:', error.message);
    return null;
  }
};

const isOnline = async () => {
  try {
    if (!firebaseDB) return false;
    
    const ref = firebaseDB.ref('.info/connected');
    const snapshot = await ref.once('value');
    return snapshot.val() === true;
  } catch (error) {
    return false;
  }
};

const pushToFirebase = async (path, data) => {
  try {
    if (!firebaseDB) {
      console.log('Firebase not available - skipping cloud sync');
      return null;
    }

    const timestamp = admin.database.ServerValue.TIMESTAMP;
    const dataWithTimestamp = {
      ...data,
      synced_at: timestamp
    };

    await firebaseDB.ref(path).set(dataWithTimestamp);
    return true;
  } catch (error) {
    console.error('Firebase push error:', error);
    return false;
  }
};

const pullFromFirebase = async (path) => {
  try {
    if (!firebaseDB) return null;

    const snapshot = await firebaseDB.ref(path).once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Firebase pull error:', error);
    return null;
  }
};

const updateFirebaseRecord = async (path, updates) => {
  try {
    if (!firebaseDB) return null;

    const timestamp = admin.database.ServerValue.TIMESTAMP;
    await firebaseDB.ref(path).update({
      ...updates,
      updated_at: timestamp
    });

    return true;
  } catch (error) {
    console.error('Firebase update error:', error);
    return false;
  }
};

const deleteFirebaseRecord = async (path) => {
  try {
    if (!firebaseDB) return null;

    await firebaseDB.ref(path).remove();
    return true;
  } catch (error) {
    console.error('Firebase delete error:', error);
    return false;
  }
};

module.exports = {
  initializeFirebase,
  firebaseDB: () => firebaseDB,
  isOnline,
  pushToFirebase,
  pullFromFirebase,
  updateFirebaseRecord,
  deleteFirebaseRecord
};
