import { useState } from 'react';
import { SearchFilters } from '../types';
import { Search, MapPin, User, SlidersHorizontal, X, DollarSign, Accessibility, CloudRain } from 'lucide-react';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  compact?: boolean;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  sidebarMode?: boolean;
}

export function SearchBar({
  filters,
  onFiltersChange,
  onSearch,
  compact = false,
  showFilters: externalShowFilters,
  setShowFilters: externalSetShowFilters,
  sidebarMode = false
}: SearchBarProps) {
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  // Use external state if provided, otherwise use internal state
  const showFilters = externalShowFilters !== undefined ? externalShowFilters : internalShowFilters;
  const setShowFilters = externalSetShowFilters || setInternalShowFilters;

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleBooleanFilterChange = (key: keyof SearchFilters, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      (newFilters as any)[key] = true;
    } else {
      delete (newFilters as any)[key];
    }
    onFiltersChange(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  // Sidebar mode - just the filter form
  if (sidebarMode) {
    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters with staggered animations */}
        <div className="space-y-3">

          <div className="animate-stagger-5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Venue
            </label>
            <input
              type="text"
              value={filters.venue || ''}
              onChange={(e) => handleFilterChange('venue', e.target.value)}
              placeholder="Venue name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-sm transition-all"
            />
          </div>

          <div className="animate-stagger-6">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-1.5">
              <User className="w-3.5 h-3.5" />
              Organizer
            </label>
            <input
              type="text"
              value={filters.organizer || ''}
              onChange={(e) => handleFilterChange('organizer', e.target.value)}
              placeholder="Organizer name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-sm transition-all"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="space-y-2.5 pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-900 mb-2">Tags</p>

          <div className="flex flex-wrap gap-2">
            {/* Free Events */}
            <button
              onClick={() => handleBooleanFilterChange('free', !filters.free)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.free
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Free</span>
            </button>

            {/* Accessibility */}
            <button
              onClick={() => handleBooleanFilterChange('accessibility', !filters.accessibility)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.accessibility
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Accessible</span>
            </button>

            {/* Weather Sensitivity */}
            <button
              onClick={() => handleBooleanFilterChange('weatherSensitivity', !filters.weatherSensitivity)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.weatherSensitivity
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Outdoors</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              onFiltersChange({});
            }}
            className="px-3 py-2 text-xs font-semibold text-gray-900 underline hover:bg-gray-50 rounded-lg transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={() => {
              onSearch();
            }}
            className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-xs"
          >
            Show results
          </button>
        </div>
      </div>
    );
  }

  if (compact) {
    // Compact mode for header
    return (
      <>
        <div className="bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center divide-x divide-gray-200">
            {/* Search Input */}
            <div className="flex-1 px-4 py-2.5">
              <input
                type="text"
                value={filters.q || ''}
                onChange={(e) => handleFilterChange('q', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search events"
                className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
              />
            </div>

            {/* Location */}
            <div className="flex-1 px-4 py-2.5">
              <input
                type="text"
                value={filters.place || ''}
                onChange={(e) => handleFilterChange('place', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Location"
                className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
              />
            </div>

            {/* When (Date) */}
            <div className="flex-1 px-4 py-2.5 hidden md:block">
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full text-sm text-gray-900 focus:outline-none bg-transparent"
              />
            </div>

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap rounded-r-full"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Search Button */}
            <div className="pl-2 pr-1.5 py-1.5">
              <button
                onClick={onSearch}
                className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Overlay Filters Drawer (only on mobile) */}
        {showFilters && (
          <>
            {/* Backdrop - only on mobile/tablet */}
            <div
              className="fixed inset-0 bg-black/50 z-50 animate-backdrop-in lg:hidden"
              onClick={() => setShowFilters(false)}
            />

            {/* Drawer - only on mobile/tablet */}
            <div className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-left overflow-y-auto lg:hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filters with staggered animations */}
                <div className="space-y-6">

                  <div className="animate-stagger-5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                      <MapPin className="w-4 h-4" />
                      Venue
                    </label>
                    <input
                      type="text"
                      value={filters.venue || ''}
                      onChange={(e) => handleFilterChange('venue', e.target.value)}
                      placeholder="Venue name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 text-sm transition-all"
                    />
                  </div>

                  <div className="animate-stagger-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                      <User className="w-4 h-4" />
                      Organizer
                    </label>
                    <input
                      type="text"
                      value={filters.organizer || ''}
                      onChange={(e) => handleFilterChange('organizer', e.target.value)}
                      placeholder="Organizer name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Tag Filters */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Tags</p>

                  <div className="flex flex-wrap gap-2">
                    {/* Free Events */}
                    <button
                      onClick={() => handleBooleanFilterChange('free', !filters.free)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.free
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Free</span>
                    </button>

                    {/* Accessibility */}
                    <button
                      onClick={() => handleBooleanFilterChange('accessibility', !filters.accessibility)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.accessibility
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Accessibility className="w-4 h-4" />
                      <span>Accessible</span>
                    </button>

                    {/* Weather Sensitivity */}
                    <button
                      onClick={() => handleBooleanFilterChange('weatherSensitivity', !filters.weatherSensitivity)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.weatherSensitivity
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <CloudRain className="w-4 h-4" />
                      <span>Outdoors</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                  <button
                    onClick={() => {
                      onFiltersChange({});
                    }}
                    className="px-6 py-3 text-sm font-semibold text-gray-900 underline hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => {
                      onSearch();
                      setShowFilters(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm"
                  >
                    Show results
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Regular mode (hero section)
  const handleFiltersClick = () => {
    setShowFilters(true);
    // Scroll down to where filters will appear
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Airbnb-style Integrated Search Bar */}
      <div className="bg-white rounded-full md:rounded-full rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:divide-x divide-gray-200">
          {/* Search Input */}
          <div className="flex-1 px-6 py-4 border-b md:border-b-0 border-gray-200">
            <label className="block text-xs font-semibold text-gray-900 mb-1">What</label>
            <input
              type="text"
              value={filters.q || ''}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search events"
              className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
            />
          </div>

          {/* Location */}
          <div className="flex-1 px-6 py-4 border-b md:border-b-0 border-gray-200">
            <label className="block text-xs font-semibold text-gray-900 mb-1">Where</label>
            <input
              type="text"
              value={filters.place || ''}
              onChange={(e) => handleFilterChange('place', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add location"
              className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
            />
          </div>

          {/* Date */}
          <div className="flex-1 px-6 py-4 border-b md:border-b-0 border-gray-200">
            <label className="block text-xs font-semibold text-gray-900 mb-1">When</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full text-sm text-gray-900 focus:outline-none bg-transparent"
            />
          </div>

          {/* Filters Button - Desktop */}
          <div className="hidden md:flex items-center px-4">
            <button
              onClick={handleFiltersClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-full transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Search Button */}
          <div className="p-2 md:pr-2 flex justify-center md:justify-start">
            <button
              onClick={onSearch}
              className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-full transition-colors w-full md:w-auto"
              aria-label="Search"
            >
              <Search className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Button - Mobile (below search bar) */}
      <div className="mt-4 flex justify-center md:hidden">
        <button
          onClick={handleFiltersClick}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:border-gray-900 transition-colors text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          More filters
        </button>
      </div>
    </div>
  );
}
