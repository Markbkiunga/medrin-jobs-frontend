// DetailedAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Item {
  id: number;
  name: string;
  description: string;
}

const DetailedAdminDashboard: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        // const response = await fetch(`/api/${type}`);
        const response = await fetch(
          'https://users-admin-dashboard-backend-test.vercel.app/users'
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log(`Editing item ${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Network response was not ok');
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">{type} Management</h1>
      <div className="w-full max-w-5xl">
        <input
          type="text"
          placeholder="Search Item"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-blue-500">Something more</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="text-blue-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedAdminDashboard;
