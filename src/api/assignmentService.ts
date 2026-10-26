import { Assignment } from '../types';
import { request } from './client';

export const getAll = () =>
  request<Assignment[]>('GET', '/assignments?_expand=course&_sort=dueDate');
export const getById = (id: number) =>
  request<Assignment>('GET', `/assignments/${id}?_expand=course`);
export const update = (id: number, data: Partial<Assignment>) =>
  request<Assignment>('PATCH', `/assignments/${id}`, data);
export const create = (data: Partial<Assignment>) =>
  request<Assignment>('POST', '/assignments', data);
