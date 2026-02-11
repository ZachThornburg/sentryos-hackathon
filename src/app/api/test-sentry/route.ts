import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  console.log('🧪 Sentry Test API endpoint called')

  try {
    // Test 1: Capture a structured message
    Sentry.captureMessage('Test: API endpoint called for Sentry testing', {
      level: 'info',
      tags: {
        test_type: 'api_test',
        endpoint: 'test-sentry'
      },
      extra: {
        timestamp: new Date().toISOString(),
        source: 'test_api_endpoint'
      }
    })

    // Test 2: Set user context
    Sentry.setUser({
      id: 'test-user-api-001',
      username: 'test_api_user',
      email: 'test@sentryos.dev'
    })

    // Test 3: Capture a sample error
    const testError = new Error('🔴 Test Error: Sample error from API endpoint for Sentry testing')
    Sentry.captureException(testError, {
      level: 'error',
      tags: {
        test_type: 'api_error',
        endpoint: 'test-sentry',
        intentional: 'yes'
      },
      extra: {
        test_context: 'Manual error test from API endpoint',
        timestamp: new Date().toISOString(),
        user_agent: 'Test Script'
      }
    })

    // Test 4: Capture a warning
    Sentry.captureMessage('Test warning message', {
      level: 'warning',
      tags: { test_type: 'warning_test' }
    })

    // Test 5: Add breadcrumbs
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'Test breadcrumb added',
      level: 'info'
    })

    return NextResponse.json({
      success: true,
      message: 'Sentry test events sent successfully!',
      tests: [
        '✅ Structured log message sent',
        '✅ User context set',
        '✅ Test error captured with full context',
        '✅ Warning message sent',
        '✅ Breadcrumb added'
      ],
      instructions: [
        'Check your Sentry dashboard at https://sentry.io',
        'Navigate to Issues → All Issues to see the test error',
        'Check Insights → Metrics to view custom metrics',
        'View Performance for transaction data'
      ]
    })

  } catch (error) {
    console.error('Error in Sentry test:', error)
    Sentry.captureException(error, {
      level: 'fatal',
      tags: { error_location: 'test_endpoint' }
    })

    return NextResponse.json({
      success: false,
      error: 'Failed to send test events to Sentry'
    }, { status: 500 })
  }
}
