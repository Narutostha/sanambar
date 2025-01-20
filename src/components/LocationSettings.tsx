import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

interface LocationSettings {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  map_url: string;
}

const LocationSettings: React.FC = () => {
  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('location_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('location_settings')
        .update({
          address: settings.address,
          city: settings.city,
          state: settings.state,
          zip: settings.zip,
          phone: settings.phone,
          email: settings.email,
          hours: settings.hours,
          map_url: settings.map_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleHoursChange = (day: string, type: 'open' | 'close', value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      hours: {
        ...settings.hours,
        [day]: {
          ...settings.hours[day],
          [type]: value
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-red-100 p-4 rounded-lg">
        <p className="text-red-700">No location settings found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Location Settings</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Edit Settings
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Contact Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </div>
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Street Address</span>
                </div>
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={settings.state}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip"
                value={settings.zip}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(settings.hours).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4">
                <span className="w-24 capitalize">{day}</span>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                  disabled={!editing}
                  className="p-2 border rounded-md disabled:bg-gray-100"
                />
                <span>to</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                  disabled={!editing}
                  className="p-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Map URL Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Google Maps</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed URL
            </label>
            <input
              type="text"
              name="map_url"
              value={settings.map_url}
              onChange={handleChange}
              disabled={!editing}
              className="w-full p-2 border rounded-md disabled:bg-gray-100"
            />
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Get this URL from Google Maps by clicking "Share" and selecting "Embed a map"
            </p>
          </div>
        </div>

        {editing && (
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                fetchSettings();
              }}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LocationSettings;