import { AsyncLocalStorage } from 'async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();

export const getStore = () => {
  return asyncLocalStorage.getStore();
};

export default asyncLocalStorage;