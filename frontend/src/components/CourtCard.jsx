import React from 'react';
import { MapPin, Users, DollarSign } from 'lucide-react';

const CourtCard = ({ court, onSelect }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(court)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
          <p className="text-sm text-gray-500 capitalize mt-1">
            {court.type} • {court.sport}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            court.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {court.isActive ? 'Available' : 'Inactive'}
        </span>
      </div>

      {court.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{court.description}</p>
      )}

      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>Capacity: {court.capacity}</span>
        </div>
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4" />
          <span>${court.basePrice}/hr</span>
        </div>
      </div>

      {court.amenities && court.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {court.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
            >
              {amenity}
            </span>
          ))}
          {court.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{court.amenities.length - 3} more
            </span>
          )}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(court);
        }}
        className="mt-4 w-full btn-primary"
      >
        Book Now
      </button>
    </div>
  );
};

export default CourtCard;
