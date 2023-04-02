// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH9nqofpAoh01dQq-FkEuivfA4Y-ZwXLM",
  authDomain: "chefgpt.firebaseapp.com",
  projectId: "chefgpt",
  storageBucket: "chefgpt.appspot.com",
  messagingSenderId: "35025885683",
  appId: "1:35025885683:web:05d8d6d8f45c07eaf11a86",
  measurementId: "G-7XCGBWEJCQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

let analytics: null | Analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export const trackError = (error: Error, eventName = "exception") => {
  console.error(error);
  if (analytics) {
    logEvent(analytics, eventName, {
      description: error.message,
      stack: error.stack,
      firebase_error: 1,
      fatal: false,
    });
  }
};

export const trackScreenView = (screenName: string) => {
  if (analytics) {
    logEvent(analytics, "screen_view", {
      screen_name: screenName,
      firebase_screen_class: screenName,
      firebase_screen: screenName,
    });
  }
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

export default {
  app,
  analytics,
  auth,
  db
};
