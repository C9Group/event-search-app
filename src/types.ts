export interface Image {
  id: number;
  name: string;
  uri: string;
  source?: string | null;
  sourceImageId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Organizer {
  id: number;
  name: string;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  place: string;
  postalCode: string;
  countryCode: string;
  municipality?: string;
  region?: string;
  state?: string;
  googleMapsPlaceId?: string;
  capacity?: number | null;
  accessibility?: string[];
  weatherSensitivity?: boolean | null;
  longitude?: number | null;
  latitude?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  parent_category?: {
    id: number;
    name: string;
  } | null;
  subcategories?: Category[];
}

export interface Link {
  type: 'source' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'website' | 'tickets' | 'registration' | 'other';
  uri: string;
}

export interface Event {
  id: number;
  name: string;
  public: boolean;
  descriptionLanguageCode: string;
  eventLanguageCode?: string | null;
  excerpt?: string;
  excerptHtml?: string;
  description?: string;
  descriptionHtml?: string;
  startTime?: string | null;
  endTime?: string | null;
  localTimezone?: string | null;
  free: boolean;
  canceled: boolean;
  bookingRequired: boolean;
  online: boolean;
  onlineUrl?: string;
  accessibility?: string[];
  weatherSensitivity?: boolean | null;
  links?: Link[];
  featuredImage?: Image | null;
  images?: Image[];
  organizers?: Organizer[];
  venues?: Venue[];
  categories?: Category[];
  source?: string | null;
  sourceEventId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  q?: string;
  search?: string;
  venue?: string;
  organizer?: string;
  place?: string;
  region?: string;
  countryCode?: string;
  source?: string;
  sourceEventId?: string;
  free?: boolean;
  online?: boolean;
  accessibility?: boolean;
  weatherSensitivity?: boolean;
  startDate?: string;
  endDate?: string;
  'startTime[gte]'?: string;
  'startTime[lte]'?: string;
  'startTime[between]'?: string;
  radius?: number;
  latitude?: number;
  longitude?: number;
  sort?: 'startTime' | '-startTime';
}

export interface SearchResponse {
  events: Event[];
  links: {
    self: string;
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
