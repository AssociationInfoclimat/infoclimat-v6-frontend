import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'

// Configure the resource with service name
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'infoclimat-frontend',
})

// Configure the OTLP exporter
// In dev: uses Vite proxy at /otel/v1/traces -> http://192.168.4.5:4318/v1/traces
// In prod: update this to your production OTLP endpoint
const exporter = new OTLPTraceExporter({
  url: import.meta.env.DEV ? '/otel/v1/traces' : 'http://192.168.4.5:4318/v1/traces',
})

// Create and configure the tracer provider with span processor
const provider = new WebTracerProvider({
  resource,
  spanProcessors: [new BatchSpanProcessor(exporter)],
})

// Register the provider globally
provider.register()

// Register auto-instrumentations
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-fetch': {
        propagateTraceHeaderCorsUrls: /.+/,
        clearTimingResources: true,
      },
      '@opentelemetry/instrumentation-xml-http-request': {
        propagateTraceHeaderCorsUrls: /.+/,
      },
    }),
  ],
})

console.log('OpenTelemetry initialized for infoclimat-frontend')
