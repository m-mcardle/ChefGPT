import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { browser, dev } from '$app/environment';

import { app } from './firebase';

const analyticsSupported = async () => {
  return browser && await isSupported() && !dev;
}

export const trackError = async (error: Error, eventName = "exception") => {
  console.error(error);
  if (await analyticsSupported()) {
    const analytics = getAnalytics(app);
    logEvent(analytics, eventName, {
      description: error.message,
      stack: error.stack,
      firebase_error: 1,
      fatal: false,
    });
  }
};

export const trackScreenView = async (screenName: string) => {
  if (await analyticsSupported()) {
    console.log('trackScreenView', screenName);
    const analytics = getAnalytics(app);
    console.log('analytics', analytics);
    logEvent(analytics, "screen_view", {
      screen_name: screenName,
      firebase_screen_class: screenName,
      firebase_screen: screenName,
    });
  }
};

export const trackEvent = async (eventName: string, params?: Record<string, unknown>) => {
  if (await analyticsSupported()) {
    console.log('trackEvent', eventName);
    const analytics = getAnalytics(app);
    console.log('analytics', analytics);
    logEvent(analytics, eventName, params);
  }
};

export default {
  trackError,
  trackScreenView,
  trackEvent
};
