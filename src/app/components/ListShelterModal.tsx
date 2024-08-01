import React, { useState } from 'react';

interface ListShelterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shelterData: ShelterData) => void;
  provinces: string[];
  cities: string[];
}

export interface ShelterData {
  name: string;
  latitude: string;
  longitude: string;
  province: string;
  city: string;
}

const ListShelterModal: React.FC<ListShelterModalProps> = ({ isOpen, onClose, onSubmit, provinces, cities }) => {
  const [shelterData, setShelterData] = useState<ShelterData>({
    name: '',
    latitude: '',
    longitude: '',
    province: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShelterData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(shelterData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">List a Place as Shelter</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={shelterData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 flex space-x-2">
            <div className="w-1/2">
              <label className="block mb-2">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={shelterData.latitude}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={shelterData.longitude}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Province</label>
            <select
              name="province"
              value={shelterData.province}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">City/Municipality</label>
            <select
              name="city"
              value={shelterData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select City/Municipality</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListShelterModal;