import { useState } from 'react';
import { Event } from '../types';
import {
  Calendar, Ticket, Heart,
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  Globe, ExternalLink, Accessibility, CloudRain, User
} from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const startDate = event.startTime ? new Date(event.startTime) : null;
  const endDate = event.endTime ? new Date(event.endTime) : null;
  
  // Get the best image - featuredImage or first image
  const imageUrl = event.featuredImage?.uri || event.images?.[0]?.uri || null;
  
  // Get the best venue info
  const venue = event.venues?.[0];
  
  // Build location string from venue
  const locationParts = [
    venue?.place,
    venue?.state || venue?.region
  ].filter(Boolean);
  const location = locationParts.join(', ');

  // Format date range
  const formatDateRange = () => {
    if (!startDate) return null;
    if (endDate && startDate.toDateString() !== endDate.toDateString()) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    }
    return format(startDate, 'MMM d, yyyy');
  };

  // Format time
  const formatTime = () => {
    if (!startDate) return null;
    return format(startDate, 'h:mm a');
  };

  // Get online/free badges
  const getBadges = () => {
    const badges = [];
    if (event.free) badges.push('Free');
    if (event.online) badges.push('Online');
    if (event.canceled) badges.push('Canceled');
    return badges;
  };

  // Get link URL priority: tickets > registration > website > source
  const getLinkUrl = () => {
    const ticketLink = event.links?.find(link => link.type === 'tickets');
    const regLink = event.links?.find(link => link.type === 'registration');
    const websiteLink = event.links?.find(link => link.type === 'website');
    const sourceLink = event.links?.find(link => link.type === 'source');
    
    return ticketLink?.uri || regLink?.uri || websiteLink?.uri || sourceLink?.uri || '#';
  };

  const badges = getBadges();

  // Get social media links
  const getSocialLinks = () => {
    if (!event.links) return [];
    return event.links
      .filter(link => ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].includes(link.type))
      .slice(0, 4); // Limit to 4 for mobile
  };

  // Get action links (tickets, registration, website)
  const getActionLinks = () => {
    if (!event.links) return [];
    return event.links.filter(link => ['tickets', 'registration', 'website'].includes(link.type));
  };

  // Get icon for link type
  const getLinkIcon = (type: string) => {
    const icons: Record<string, any> = {
      facebook: Facebook, instagram: Instagram, twitter: Twitter,
      linkedin: Linkedin, youtube: Youtube, website: Globe,
      tickets: Ticket, registration: ExternalLink
    };
    return icons[type] || ExternalLink;
  };

  // Get display categories (max 3 for mobile)
  const getDisplayCategories = () => event.categories?.slice(0, 3) || [];

  // Check accessibility features
  const hasAccessibilityFeatures = () =>
    (event.accessibility?.length ?? 0) > 0 ||
    (event.venues?.[0]?.accessibility?.length ?? 0) > 0;

  return (
    <a
      href={getLinkUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer"
    >
      {/* Event Image - Airbnb style square */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Calendar className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold ${
                  badge === 'Canceled' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-900'
                }`}
              >
                {badge}
              </div>
            ))}
          </div>
        )}

        {/* Multiple Categories */}
        {getDisplayCategories().length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {getDisplayCategories().map((category, idx) => (
              <div
                key={category.id || idx}
                className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm text-xs font-medium"
              >
                {category.name}
              </div>
            ))}
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 active:bg-white/70 flex items-center justify-center transition-all duration-200 group/heart"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorited
                ? 'fill-rose-500 text-rose-500 scale-110'
                : 'text-white group-hover/heart:scale-110'
            }`}
          />
        </button>
      </div>

      {/* Event Details - Airbnb minimal style */}
      <div className="space-y-1">
        {/* Location and Venue */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {location || venue?.name || 'Location TBD'}
          </p>
        </div>

        {/* Event Name */}
        <h3 className="text-sm text-gray-600 line-clamp-2 leading-snug">
          {event.name}
        </h3>

        {/* Event Excerpt */}
        {(event.excerptHtml || event.excerpt) && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {event.excerptHtml ? (
              <span dangerouslySetInnerHTML={{ __html: event.excerptHtml }} />
            ) : (
              event.excerpt
            )}
          </p>
        )}

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {formatDateRange()}
          {formatTime() && (
            <>
              <span>•</span>
              {formatTime()}
            </>
          )}
        </div>

        {/* Organizer with Logo */}
        {event.organizers?.[0] && (
          <div className="flex items-center gap-2">
            {event.organizers[0].logo ? (
              <img
                src={event.organizers[0].logo}
                alt=""
                className="w-5 h-5 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-gray-400" />
              </div>
            )}
            <p className="text-xs text-gray-500 truncate">
              By {event.organizers[0].name}
            </p>
          </div>
        )}

        {/* Social & Action Links */}
        {(getSocialLinks().length > 0 || getActionLinks().length > 0) && (
          <div className="flex items-center justify-between gap-2 pt-1 min-h-[24px]">
            {/* Social Links */}
            {getSocialLinks().length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {getSocialLinks().map((link, idx) => {
                  const IconComponent = getLinkIcon(link.type);
                  return (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
                      aria-label={`${event.name} on ${link.type}`}
                    >
                      <IconComponent className="w-3.5 h-3.5 text-gray-600" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Action Links */}
            {getActionLinks().length > 0 && (
              <div className="flex items-center gap-1.5">
                {getActionLinks().map((link, idx) => {
                  const IconComponent = getLinkIcon(link.type);
                  const isPrimary = link.type === 'tickets' || link.type === 'registration';
                  return (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isPrimary
                          ? 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600'
                      }`}
                      aria-label={`${link.type} for ${event.name}`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Price - Bold like Airbnb */}
        <p className="text-sm pt-1">
          {event.free ? (
            <span className="font-semibold text-gray-900">Free</span>
          ) : (
            <span className="text-gray-600">Check event for pricing</span>
          )}
        </p>

        {/* Accessibility & Weather Indicators */}
        {(hasAccessibilityFeatures() || event.weatherSensitivity) && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hasAccessibilityFeatures() && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                <Accessibility className="w-3 h-3 flex-shrink-0" />
                <span>Accessible</span>
              </div>
            )}
            {event.weatherSensitivity && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs">
                <CloudRain className="w-3 h-3 flex-shrink-0" />
                <span>Outdoors</span>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
