// Test setup file
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.find for tests
// @ts-ignore - window.find is not in TypeScript types
if (!window.find) {
  // @ts-ignore
  window.find = () => false;
}
