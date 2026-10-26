import React, { createContext, useContext } from 'react';
import { OutboxSync, useOutboxSync } from '../hooks/useOutboxSync';

const SyncContext = createContext<OutboxSync | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const sync = useOutboxSync();
  return <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>;
}

export function useSync(): OutboxSync {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSync phải được dùng bên trong SyncProvider');
  }
  return ctx;
}
