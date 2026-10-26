import { Grade } from '../types';
import { request } from './client';

export const getAll = () => request<Grade[]>('GET', '/grades?_expand=course');
export const getById = (id: number) =>
  request<Grade>('GET', `/grades/${id}?_expand=course`);
