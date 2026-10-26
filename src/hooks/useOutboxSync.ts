import { useCallback, useEffect, useState } from 'react';
import { request } from '../api/client';
import { enqueue as enqueueAction, getAll, remove } from '../storage/outbox';
import { OutboxAction } from '../types';
import { notify } from '../utils/notify';
import { useNetworkStatus } from './useNetworkStatus';

export interface OutboxSync {
  isOnline: boolean;
  actions: OutboxAction[];
  pendingCount: number;
  syncing: boolean;
  /** Tăng sau mỗi lần đồng bộ để các màn hình tải lại dữ liệu */
  syncVersion: number;
  syncNow: () => Promise<void>;
  enqueue: (action: Pick<OutboxAction, 'method' | 'url' | 'body'>) => Promise<OutboxAction>;
}

/** Khi có mạng, gửi lần lượt các thao tác trong hàng đợi (outbox) lên server. */
export function useOutboxSync(): OutboxSync {
  const { isOnline } = useNetworkStatus();
  const [actions, setActions] = useState<OutboxAction[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncVersion, setSyncVersion] = useState(0);

  const reload = useCallback(async () => setActions(await getAll()), []);

  const syncNow = useCallback(async () => {
    const queue = await getAll();
    setActions(queue);
    if (queue.length === 0) {
      return;
    }
    setSyncing(true);
    let synced = 0;
    for (const action of queue) {
      try {
        await request(action.method, action.url, {
          ...action.body,
          updatedAt: new Date().toISOString(),
        });
        await remove(action.id);
        synced += 1;
      } catch {
        break; // Lỗi thì giữ lại thao tác này và các thao tác sau để thử lại, đúng thứ tự
      }
    }
    setSyncing(false);
    await reload();
    setSyncVersion(v => v + 1);
    if (synced > 0) {
      notify(`Đã đồng bộ ${synced} thay đổi`);
    }
  }, [reload]);

  // Có mạng thì đồng bộ; mất mạng thì chỉ đọc lại hàng đợi để hiện nhãn "Chưa đồng bộ"
  useEffect(() => {
    if (isOnline) {
      syncNow();
    } else {
      reload();
    }
  }, [isOnline, syncNow, reload]);

  const enqueue = useCallback(
    async (action: Pick<OutboxAction, 'method' | 'url' | 'body'>) => {
      const item = await enqueueAction(action);
      await reload();
      return item;
    },
    [reload],
  );

  return {
    isOnline,
    actions,
    pendingCount: actions.length,
    syncing,
    syncVersion,
    syncNow,
    enqueue,
  };
}
