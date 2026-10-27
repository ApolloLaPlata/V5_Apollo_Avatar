/**
 * V5 Apollo Avatar - Global State Management Foundation
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Zustand Store Foundation with Persistence & Devtools Middlewares
 */

import { StateCreator, create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

export type StoreWithMiddlewares<T> = StateCreator<
  T,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  []
>;

/**
 * Factory helper for creating persisted & devtools-enabled stores
 */
export const createV5Store = <T>(
  name: string,
  stateCreator: StoreWithMiddlewares<T>,
  persistOptions?: Partial<PersistOptions<T, Partial<T>>>
) => {
  return create<T>()(
    devtools(
      persist(stateCreator, {
        name: `v5_avatar_${name}`,
        ...persistOptions,
      }),
      { name: `V5 Avatar Store: ${name}`, enabled: process.env.NODE_ENV !== 'production' }
    )
  );
};

export * from './useAvatarStore';
