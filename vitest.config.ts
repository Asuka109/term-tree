import inspector from 'inspector';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: inspector.url() ? 0 : 5000
  }
});
