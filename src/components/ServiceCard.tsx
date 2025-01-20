import React from 'react';
import { Clock, Heart, ShoppingCart } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  is_favorite?: boolean;
  image_url?: string;
  onBookNow: () => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onAddToCart?: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id, 
  title, 
  price, 
  duration, 
  description, 
  is_favorite = false,
  image_url,
  onBookNow,
  onToggleFavorite,
  onAddToCart
}) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Image Section - Square Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No image available</span>
          </div>
        )}
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(id, !is_favorite);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="relative">
          <h3 className="text-xl font-bold mb-2 group-hover:text-amber-800 transition-colors">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            <span className="text-lg text-gray-600">$</span>
            {price}
          </p>
          <div className="flex items-center text-gray-600 mb-4 group-hover:text-amber-700">
            <Clock className="w-4 h-4 mr-2" />
            <span>{duration}</span>
          </div>
          <p className="text-gray-600 mb-6 group-hover:text-gray-700">{description}</p>
          <div className="flex gap-4">
            <button
              onClick={onBookNow}
              className="flex-1 text-center bg-black text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors transform hover:scale-105"
            >
              Book Now
            </button>
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(id)}
                className="px-4 py-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;