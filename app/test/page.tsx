'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) {
        console.error('❌ Supabase Error:', error);
      } else {
        console.log('✅ Supabase Connected. Rooms:', data);
        setRooms(data);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Rooms from Supabase</h1>
      {rooms.length === 0 ? (
        <p>No rooms found or not connected.</p>
      ) : (
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id} className="border p-2 rounded">
              Room ID: {room.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
