import React, { useState, useEffect } from 'react';
import { Scissors, Clock, MapPin, Phone, Instagram, Facebook, Star, Award, Users, AlertCircle, Heart, ShoppingCart } from 'lucide-react';
import ServiceCard from './components/ServiceCard';
import BookingForm from './components/BookingForm';
import LocationInfo from './components/LocationInfo';
import { supabase } from './lib/supabase';

interface Service {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  is_favorite: boolean;
  image_url?: string;
}

function App() {
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchServices();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleFavorite = async (serviceId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_favorite: isFavorite })
        .eq('id', serviceId);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleAddToCart = (serviceId: string) => {
    setCartItems(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Scissors className={`w-8 h-8 ${isScrolled ? 'text-black' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>
              Sanam
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#services" className={`hover:text-amber-400 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Services</a>
            <a href="#booking" className={`hover:text-amber-400 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Book Now</a>
            <button className="relative">
              <ShoppingCart className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
            <div className="relative animate-bounce">
              <div className="absolute -inset-1 bg-white/20 rounded-full blur"></div>
              <Scissors className="w-20 h-20 mb-6 relative" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-center leading-tight animate-fade-in">
              Sanam
              <span className="block text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400 animate-gradient">
                Barbers
              </span>
            </h1>
            <p className="text-xl mb-12 text-gray-200 animate-fade-in-up">Premium Grooming for the Modern Gentleman</p>
            <button 
              onClick={() => handleServiceSelect('')}
              className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-lg animate-fade-in-up"
            >
              <span className="relative z-10">Book Your Style</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform group-hover:rotate-12">
                <Star className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Service</h3>
              <p className="text-gray-600">Experience the finest in men's grooming</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Barbers</h3>
              <p className="text-gray-600">Skilled professionals at your service</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Satisfied Clients</h3>
              <p className="text-gray-600">Join our community of happy customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <LocationInfo />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100" id="services">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-5xl font-bold mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl">
                Choose from our range of premium grooming services designed to enhance your style
              </p>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all hover:scale-105">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cartItems.length})</span>
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id}
                  {...service}
                  onBookNow={() => handleServiceSelect(service.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="booking">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Book an Appointment</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Reserve your spot for a premium grooming experience
          </p>
          <BookingForm selectedService={selectedService} services={services} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Scissors className="w-8 h-8" />
                <span className="text-2xl font-bold">Sanam</span>
              </div>
              <p className="text-gray-400 mb-6">
                Premium grooming services for the modern gentleman. Experience the difference.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#services" className="text-gray-400 hover:text-amber-400 transition-colors">Services</a></li>
                <li><a href="#booking" className="text-gray-400 hover:text-amber-400 transition-colors">Book Now</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Gallery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>123 Barber Street, NY</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button className="px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Sanam Barbers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;