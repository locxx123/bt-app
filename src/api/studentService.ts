import { Student } from '../types';
import { request } from './client';

export const getAll = () => request<Student[]>('GET', '/students');
export const getById = (id: number) => request<Student>('GET', `/students/${id}`);
export const update = (id: number, data: Partial<Student>) =>
  request<Student>('PATCH', `/students/${id}`, data);
