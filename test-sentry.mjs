#!/usr/bin/env node

// Simple script to test Sentry error capture
import * as Sentry from '@sentry/nextjs'

// Initialize Sentry with your DSN
Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: true, // Enable debug mode to see console output
})

console.log('🧪 Testing Sentry Integration...\n')

// Test 1: Capture a message
console.log('1️⃣ Sending structured log message...')
Sentry.captureMessage('Test message from Node.js script', {
  level: 'info',
  tags: {
    test_type: 'cli_test',
    source: 'test_script'
  },
  extra: {
    timestamp: new Date().toISOString(),
    triggered_by: 'manual_test_script'
  }
})
console.log('   ✅ Message sent\n')

// Test 2: Send custom metrics
console.log('2️⃣ Sending custom metrics...')
Sentry.metrics.increment('test.script.executions', 1, {
  tags: { source: 'cli' }
})
Sentry.metrics.gauge('test.script.value', 99, {
  tags: { unit: 'number' }
})
console.log('   ✅ Metrics sent\n')

// Test 3: Capture an error
console.log('3️⃣ Triggering test error...')
try {
  throw new Error('🔴 Test Error: This is a sample error triggered from CLI to test Sentry integration!')
} catch (error) {
  Sentry.captureException(error, {
    level: 'error',
    tags: {
      test_type: 'cli_error',
      source: 'test_script',
      environment: process.env.NODE_ENV || 'development'
    },
    extra: {
      test_context: 'Manual error test from CLI script',
      user_agent: 'Node.js Test Script',
      timestamp: new Date().toISOString()
    },
    fingerprint: ['test-error', 'cli-test']
  })
  console.log('   ✅ Error captured\n')
}

// Test 4: Capture an error with context
console.log('4️⃣ Sending error with user context...')
Sentry.setUser({
  id: 'test-user-001',
  username: 'test_user',
  email: 'test@sentryos.dev'
})

Sentry.captureException(new Error('Error with user context'), {
  level: 'warning',
  tags: { test_type: 'user_context_test' }
})
console.log('   ✅ Error with context sent\n')

// Flush events (wait for them to be sent)
console.log('⏳ Flushing events to Sentry...')
await Sentry.flush(2000)

console.log('\n✅ All tests completed!')
console.log('\n📊 Check your Sentry dashboard at: https://sentry.io')
console.log('   - Issues → All Issues (for errors)')
console.log('   - Insights → Metrics (for custom metrics)')
console.log('   - Performance (for transactions)\n')
