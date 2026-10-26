import { Course } from '../types';
import { request } from './client';

export const getAll = () => request<Course[]>('GET', '/courses');
export const getById = (id: number) => request<Course>('GET', `/courses/${id}`);
