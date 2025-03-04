import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Function to sanitize and parse Firebase config
function parseFirebaseConfig(configStr: string | undefined) {
  if (!configStr) {
    throw new Error('FIREBASE_CONFIG environment variable is required');
  }

  // Log initial state (safely)
  console.log('Raw config length:', configStr.length);
  console.log('Config starts with:', configStr.substring(0, 20) + '...');

  try {
    // First pass: basic cleanup
    const cleanConfig = configStr
      .trim()
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/\\\\n/g, '\\n') // Fix double escaped newlines
      .replace(/\\n/g, '\n'); // Replace \n with actual newlines

    console.log('Cleaned config length:', cleanConfig.length);
    console.log('Cleaned config starts with:', cleanConfig.substring(0, 20) + '...');

    // Attempt to parse
    const parsedConfig = JSON.parse(cleanConfig);

    // Verify required fields without logging them
    if (!parsedConfig.project_id || !parsedConfig.private_key || !parsedConfig.client_email) {
      throw new Error('Missing required fields in Firebase config');
    }

    console.log('Successfully parsed Firebase config for project:', parsedConfig.project_id);
    return parsedConfig;

  } catch (error: any) {
    console.error('Firebase config parsing error:', {
      message: error.message,
      position: error.message.match(/position (\d+)/)?.[1],
      type: error.name
    });
    throw error;
  }
}

const parsedConfig = parseFirebaseConfig(process.env.FIREBASE_CONFIG);
const app = initializeApp({
  credential: cert(parsedConfig)
});

export const db = getFirestore(app);
