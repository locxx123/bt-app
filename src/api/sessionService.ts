import { Session } from '../types';
import { request } from './client';

export const getAll = () => request<Session[]>('GET', '/sessions?_expand=course');
export const getById = (id: number) =>
  request<Session>('GET', `/sessions/${id}?_expand=course`);
