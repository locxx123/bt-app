import AsyncStorage from '@react-native-async-storage/async-storage';
import { OutboxAction } from '../types';
import { KEYS } from './keys';

let counter = 0;

const save = (actions: OutboxAction[]) =>
  AsyncStorage.setItem(KEYS.outbox, JSON.stringify(actions));

/** Danh sách thao tác chờ đồng bộ, đúng thứ tự thêm vào */
export const getAll = async (): Promise<OutboxAction[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.outbox);
    return raw ? (JSON.parse(raw) as OutboxAction[]) : [];
  } catch {
    return [];
  }
};

export const enqueue = async (
  action: Pick<OutboxAction, 'method' | 'url' | 'body'>,
): Promise<OutboxAction> => {
  const createdAt = Date.now();
  counter += 1;
  const item: OutboxAction = { id: `${createdAt}-${counter}`, createdAt, ...action };
  await save([...(await getAll()), item]);
  return item;
};

export const remove = async (id: string): Promise<void> => {
  await save((await getAll()).filter(a => a.id !== id));
};
