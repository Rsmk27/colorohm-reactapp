import 'expo-router/entry';

// Global error handler for production debugging
if (!__DEV__) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    originalError(...args);
  };
}
