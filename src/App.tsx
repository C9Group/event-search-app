import { useState, useEffect, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { EventCard } from './components/EventCard';
import { searchEvents } from './services/api';
import { Event, SearchFilters } from './types';
import { Loader2, Calendar } from 'lucide-react';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleSearch();
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Show header search when scrolled past 300px (about hero section height)
      setShowHeaderSearch(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchEvents(filters, 100, 1);
      setEvents(response.events || []);
      setTotalResults(response.pagination?.total || 0);

      // Scroll to results after search completes
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to search events');
      setEvents([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
              </svg>
              <span className="text-lg sm:text-xl font-semibold text-rose-500">Event Search</span>
            </div>

            {/* Compact Search Bar (visible when scrolled) */}
            {showHeaderSearch && (
              <div className="flex-1 max-w-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <SearchBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSearch={handleSearch}
                  compact={true}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-20 pt-8 sm:pt-12 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Discover amazing events
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Find concerts, conferences, festivals and more near you
            </p>
          </div>
          
          <SearchBar
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>
      </div>

      {/* Results Section with Side-by-Side Layout */}
      <div ref={resultsRef} className="relative">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
          <div className="flex gap-8 transition-layout">
            {/* Desktop Filter Sidebar - pushes content */}
            {showFilters && showHeaderSearch && (
              <aside className="hidden lg:block w-80 flex-shrink-0 animate-scale-fade-in">
                <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-lg p-6 transition-all">
                  <SearchBar
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSearch={handleSearch}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    sidebarMode={true}
                  />
                </div>
              </aside>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 transition-layout">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                  <p className="text-lg text-gray-600">Finding events...</p>
                </div>
              ) : error ? (
                <div className="max-w-md mx-auto text-center py-20">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button onClick={handleSearch} className="btn-primary">
                    Try Again
                  </button>
                </div>
              ) : hasSearched ? (
                <>
                  {totalResults > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600">
                        {totalResults.toLocaleString()} event{totalResults !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {events.length > 0 ? (
                    <div className={`grid gap-x-6 gap-y-8 transition-layout ${
                      showFilters && showHeaderSearch
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    }`}>
                      {events.map((event, idx) => (
                        <div
                          key={event.id}
                          style={{ animationDelay: `${Math.min(idx * 0.03, 0.3)}s` }}
                          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                          <EventCard event={event} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                      <button
                        onClick={() => {
                          setFilters({});
                          handleSearch();
                        }}
                        className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-12 sm:mt-20">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
          <div className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} Event Search • Powered by Open Events API
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
