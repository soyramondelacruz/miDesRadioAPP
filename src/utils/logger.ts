export const log = (...args: unknown[]) => {
  if (__DEV__) {
    console.log('[miDes]', ...args);
  }
};