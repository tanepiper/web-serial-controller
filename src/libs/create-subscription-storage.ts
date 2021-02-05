/**
 * Creates an instance of a subscription and update service for stores
 * with localStorage
 */
function createStateStorage(storageEngine: Storage) {
  const subs: any[] = [];

  return {
    /**
     * Update a store from local storage, merging with any existing state
     * in case there are new properties
     * @param storeKey
     * @param store
     */
    addStore: (storeKey: string, store: any) => {
      try {
        const data = storageEngine.getItem(storeKey);
        if (data) {
          store.update((state: Record<string, any>) => ({ ...state, ...JSON.parse(data) }));
        }
      } catch {}

      const sub = store.subscribe((value: Record<string, any>) => {
        try {
          storageEngine.setItem(storeKey, JSON.stringify(value));
        } catch {}
      });
      subs.push(sub);
    },
    unsubscribe: () => subs.forEach((sub) => sub()),
  };
}

export const localStorageSettings = createStateStorage(localStorage);
