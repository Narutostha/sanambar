import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle, Edit, Trash2, ImagePlus, Clock, Heart, Phone, Mail, Calendar, Clock3, LogOut } from 'lucide-react';
import LocationSettings from './LocationSettings';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  is_favorite: boolean;
  image_url?: string;
}

interface Appointment {
  id: string;
  service_id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({});
  const [isAddingService, setIsAddingService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            title: editingService.title,
            price: editingService.price,
            duration: editingService.duration,
            description: editingService.description,
            image_url: editingService.image_url,
            is_favorite: editingService.is_favorite
          })
          .eq('id', editingService.id);

        if (error) throw error;
        setEditingService(null);
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{
            ...newService,
            is_favorite: false
          }]);

        if (error) throw error;
        setIsAddingService(false);
        setNewService({});
      }
      await fetchServices();
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchServices();
      } catch (err: any) {
        console.error('Error deleting service:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('services')
        .update({ is_favorite: !service.is_favorite })
        .eq('id', id);

      if (error) throw error;
      await fetchServices();
    } catch (err: any) {
      console.error('Error updating favorite status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchAppointments();
      } catch (err: any) {
        console.error('Error deleting appointment:', err);
        setError(err.message);
      }
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Services</h2>
            <button
              onClick={() => setIsAddingService(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              <PlusCircle size={20} />
              Add Service
            </button>
          </div>

          {(isAddingService || editingService) && (
            <form onSubmit={handleServiceSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingService?.title || newService.title || ''}
                    onChange={(e) => editingService 
                      ? setEditingService({...editingService, title: e.target.value})
                      : setNewService({...newService, title: e.target.value})
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={editingService?.price || newService.price || ''}
                    onChange={(e) => editingService
                      ? setEditingService({...editingService, price: Number(e.target.value)})
                      : setNewService({...newService, price: Number(e.target.value)})
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingService?.duration || newService.duration || ''}
                    onChange={(e) => editingService
                      ? setEditingService({...editingService, duration: e.target.value})
                      : setNewService({...newService, duration: e.target.value})
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingService?.image_url || newService.image_url || ''}
                    onChange={(e) => editingService
                      ? setEditingService({...editingService, image_url: e.target.value})
                      : setNewService({...newService, image_url: e.target.value})
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingService?.description || newService.description || ''}
                    onChange={(e) => editingService
                      ? setEditingService({...editingService, description: e.target.value})
                      : setNewService({...newService, description: e.target.value})
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                    required
                    rows={4}
                  />
                </div>
                {editingService && (
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.is_favorite}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          is_favorite: e.target.checked
                        })}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Service</span>
                    </label>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingService ? 'Update' : 'Add') + ' Service'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsAddingService(false);
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="relative h-48">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImagePlus className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleToggleFavorite(service.id)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${service.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                      />
                    </button>
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      <Edit className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold">${service.price}</span>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{appointment.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {services.find(s => s.id === appointment.service_id)?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.email}</div>
                      <div className="text-gray-500">{appointment.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Settings Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Settings</h2>
          <LocationSettings />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;