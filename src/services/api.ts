import axios from 'axios';
import { Event, SearchFilters, SearchResponse } from '../types';

// Use environment variables for API configuration
// These are replaced at build time by Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://openeventsapi.com/api/v1.0';
const API_KEY = import.meta.env.VITE_API_KEY || '';

if (!API_KEY) {
  console.warn('VITE_API_KEY is not set. API requests may fail.');
}

// Configure axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;

export const searchEvents = async (filters: SearchFilters, limit = 50, page = 1): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  
  // Add pagination and includes
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('include', 'images,organizers,venues,categories');
  
  // Map filters to API parameters
  if (filters.q) params.append('search', filters.q);
  if (filters.venue) params.append('venue', filters.venue);
  if (filters.organizer) params.append('organizer', filters.organizer);
  if (filters.place) params.append('place', filters.place);
  if (filters.region) params.append('region', filters.region);
  if (filters.countryCode) params.append('countryCode', filters.countryCode);
  if (filters.free !== undefined) params.append('free', filters.free.toString());
  if (filters.online !== undefined) params.append('online', filters.online.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.sort) params.append('sort', filters.sort);

  const response = await axios.get<SearchResponse>(`${API_BASE_URL}/events?${params.toString()}`);
  return response.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await axios.get<Event>(`${API_BASE_URL}/events/${id}`);
  return response.data;
};

export const getVenues = async () => {
  const response = await axios.get(`${API_BASE_URL}/venues`);
  return response.data;
};

export const getOrganizers = async () => {
  const response = await axios.get(`${API_BASE_URL}/organizers`);
  return response.data;
};
