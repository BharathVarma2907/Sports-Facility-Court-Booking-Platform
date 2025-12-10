import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourtCard from '../components/CourtCard';
import Loader from '../components/Loader';
import { courtsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    sport: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourts();
  }, [filters]);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const params = {
        isActive: true,
        ...filters,
      };
      const response = await courtsAPI.getAll(params);
      setCourts(response.data.courts);
    } catch (error) {
      console.error('Error fetching courts:', error);
      toast.error('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const handleCourtSelect = (court) => {
    navigate('/booking', { state: { court } });
  };

  const filteredCourts = courts.filter((court) =>
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    court.sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Book Your Sports Court
          </h1>
          <p className="text-xl text-center text-primary-100">
            Find and book the perfect court for your game
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courts or sports..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="input-field"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>

            <button
              onClick={() => {
                setFilters({ type: '', sport: '' });
                setSearchTerm('');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCourts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No courts found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Courts ({filteredCourts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourts.map((court) => (
                <CourtCard
                  key={court._id}
                  court={court}
                  onSelect={handleCourtSelect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
