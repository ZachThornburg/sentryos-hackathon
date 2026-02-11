# Sentry Setup Guide

This project is configured with Sentry for error tracking, performance monitoring, and session replay.

## Quick Start

### 1. Get Your Sentry Credentials

1. Go to [sentry.io](https://sentry.io) and create an account or sign in
2. Create a new project (or use an existing one)
3. Copy your DSN from the project settings
4. Create an Auth Token at https://sentry.io/settings/account/api/auth-tokens/
   - Give it a name like "SentryOS Build Token"
   - Enable the following scopes:
     - `project:read`
     - `project:releases`
     - `org:read`

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your actual values:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o0.ingest.sentry.io/0000000
SENTRY_DSN=https://your-key@o0.ingest.sentry.io/0000000
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token-here
```

### 3. Restart the Development Server

```bash
pnpm dev
```

## Features Enabled

### ✅ Error Tracking
All uncaught errors and exceptions are automatically sent to Sentry.

### ✅ Performance Monitoring
100% of transactions are traced (adjust `tracesSampleRate` in production).

### ✅ Session Replay
- 100% of sessions with errors are recorded
- 10% of all sessions are recorded (adjust `replaysSessionSampleRate` in production)

### ✅ Source Maps
Source maps are automatically uploaded during production builds for better stack traces.

### ✅ Tunnel Route
Requests to Sentry are routed through `/monitoring` to bypass ad-blockers.

## Testing Sentry

To test that Sentry is working, you can trigger a test error:

```typescript
// In any component
throw new Error("Sentry Test Error");
```

Or use the Sentry test button in your app (if you add one).

## Configuration Files

- `instrumentation.ts` - Initializes Sentry based on runtime
- `sentry.client.config.ts` - Client-side Sentry configuration
- `sentry.server.config.ts` - Server-side Sentry configuration
- `sentry.edge.config.ts` - Edge runtime Sentry configuration
- `next.config.ts` - Next.js config wrapped with Sentry

## Production Considerations

Before deploying to production:

1. **Adjust Sample Rates**: Lower `tracesSampleRate` and `replaysSessionSampleRate` to reduce quota usage
2. **Add Release Tracking**: Configure release versions in your CI/CD pipeline
3. **Set Up Alerts**: Configure alert rules in Sentry for critical errors
4. **Review Privacy**: Adjust `maskAllText` and `blockAllMedia` settings for compliance

## Learn More

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)
