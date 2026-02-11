import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Capture 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,

  // Capture 100% of all sessions for demo/development (adjust to 0.1-0.2 in production)
  replaysSessionSampleRate: 1.0,

  // Session Replay integration with rage click and frustration detection
  integrations: [
    Sentry.replayIntegration({
      // Unmask text for better observability (mask in production if needed)
      maskAllText: false,
      maskAllInputs: true, // Still mask input fields for security
      blockAllMedia: false,

      // Enable rage click detection (3+ clicks in <500ms)
      blockClass: 'sentry-block',
      ignoreClass: 'sentry-ignore',

      // Network details for debugging
      networkDetailAllowUrls: [window.location.origin],
      networkCaptureBodies: true,
      networkResponseHeaders: ['content-type'],
      networkRequestHeaders: ['content-type'],
    }),
  ],
});
