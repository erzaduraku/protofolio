'use client';

// react-error-boundary is client-only; this re-export lets Server Components (Home) use it.
import { ErrorBoundary } from 'react-error-boundary';

export default ErrorBoundary;
