import { useStore } from '../data/store';

export function useRealtimeStore() {
  const store = useStore();
  return store;
}
