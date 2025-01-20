import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LocationSettings {
  id: string;
  map_url: string;
}

const LocationInfo: React.FC = () => {
  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('location_settings')
        .select('id, map_url')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching location settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-8">Visit Us</h2>
      <div className="max-w-4xl mx-auto h-[500px] rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={settings.map_url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Empror Barbers Location"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationInfo;