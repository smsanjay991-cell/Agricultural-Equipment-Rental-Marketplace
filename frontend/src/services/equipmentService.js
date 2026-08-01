import { fetchWithAuth } from './api';

export const INITIAL_MOCK_EQUIPMENT = [
  {
    _id: 'eq1',
    name: 'John Deere 5050D 50HP Tractor',
    category: 'Tractor',
    description: 'Heavy duty 50HP tractor with power steering, oil immersed brakes, and dual clutch. Ideal for tilling, ploughing, and heavy haulage.',
    dailyRate: 1500,
    location: 'Ludhiana, Punjab',
    horsepower: 50,
    fuelType: 'Diesel',
    isDriverAvailable: true,
    driverRatePerDay: 400,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
    averageRating: 4.8,
    numReviews: 12,
    owner: {
      _id: 'u2',
      name: 'Rajesh Patel',
      phone: '+91 98765 22222',
      location: 'Ludhiana, Punjab'
    }
  },
  {
    _id: 'eq2',
    name: 'Kubota Harvester DC-68G-HK',
    category: 'Harvester',
    description: 'High capacity paddy & wheat combine harvester with 68HP engine. Ensures minimum grain loss and clean harvesting in wet fields.',
    dailyRate: 3500,
    location: 'Karnal, Haryana',
    horsepower: 68,
    fuelType: 'Diesel',
    isDriverAvailable: true,
    driverRatePerDay: 500,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'],
    averageRating: 4.9,
    numReviews: 8,
    owner: {
      _id: 'u2',
      name: 'Rajesh Patel',
      phone: '+91 98765 22222',
      location: 'Karnal, Haryana'
    }
  },
  {
    _id: 'eq3',
    name: 'Mahindra Rotary Tiller (Rotavator 6ft)',
    category: 'Tiller',
    description: 'Heavy duty 6 feet rotavator for fine seedbed preparation. Reduces fuel consumption and soil compaction.',
    dailyRate: 800,
    location: 'Nashik, Maharashtra',
    horsepower: 45,
    fuelType: 'N/A',
    isDriverAvailable: false,
    driverRatePerDay: 0,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'],
    averageRating: 4.6,
    numReviews: 15,
    owner: {
      _id: 'u2',
      name: 'Rajesh Patel',
      phone: '+91 98765 22222',
      location: 'Nashik, Maharashtra'
    }
  },
  {
    _id: 'eq4',
    name: 'Fieldking Pneumatic Precision Seeder',
    category: 'Seeder',
    description: 'Automatic pneumatic planter for corn, cotton, and soybean precision sowing with exact seed spacing.',
    dailyRate: 1200,
    location: 'Indore, Madhya Pradesh',
    horsepower: 35,
    fuelType: 'N/A',
    isDriverAvailable: true,
    driverRatePerDay: 300,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'],
    averageRating: 4.7,
    numReviews: 6,
    owner: {
      _id: 'u2',
      name: 'Rajesh Patel',
      phone: '+91 98765 22222',
      location: 'Indore, MP'
    }
  },
  {
    _id: 'eq5',
    name: 'ASPEE 500L Tractor Boom Sprayer',
    category: 'Sprayer',
    description: '500-liter capacity boom sprayer with 12m spray width for rapid pesticide and liquid fertilizer application.',
    dailyRate: 950,
    location: 'Guntur, Andhra Pradesh',
    horsepower: 40,
    fuelType: 'Diesel',
    isDriverAvailable: true,
    driverRatePerDay: 350,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80'],
    averageRating: 4.5,
    numReviews: 9,
    owner: {
      _id: 'u2',
      name: 'Rajesh Patel',
      phone: '+91 98765 22222',
      location: 'Guntur, AP'
    }
  }
];

export const equipmentService = {
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const data = await fetchWithAuth(`/equipment?${queryString}`);
      if (Array.isArray(data) && data.length > 0) return data;
      return filterMockEquipment(params);
    } catch (err) {
      return filterMockEquipment(params);
    }
  },

  getById: async (id) => {
    try {
      return await fetchWithAuth(`/equipment/${id}`);
    } catch (err) {
      const item = INITIAL_MOCK_EQUIPMENT.find(e => e._id === id) || INITIAL_MOCK_EQUIPMENT[0];
      return {
        ...item,
        reviews: [
          { _id: 'r1', rating: 5, comment: 'Excellent tractor, delivered on time in great condition!', farmer: { name: 'Gurpreet Singh' } },
          { _id: 'r2', rating: 4, comment: 'Worked smoothly for harvesting 4 acres of wheat.', farmer: { name: 'Ramesh Kumar' } }
        ]
      };
    }
  },

  create: async (equipmentData) => {
    try {
      return await fetchWithAuth('/equipment', {
        method: 'POST',
        body: JSON.stringify(equipmentData)
      });
    } catch (err) {
      const newItem = {
        _id: 'eq_' + Date.now(),
        ...equipmentData,
        averageRating: 5.0,
        numReviews: 0,
        isAvailable: true,
        images: equipmentData.images?.length ? equipmentData.images : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80']
      };
      INITIAL_MOCK_EQUIPMENT.unshift(newItem);
      return newItem;
    }
  },

  delete: async (id) => {
    try {
      return await fetchWithAuth(`/equipment/${id}`, { method: 'DELETE' });
    } catch (err) {
      const idx = INITIAL_MOCK_EQUIPMENT.findIndex(e => e._id === id);
      if (idx !== -1) INITIAL_MOCK_EQUIPMENT.splice(idx, 1);
      return { message: 'Deleted' };
    }
  }
};

function filterMockEquipment(params) {
  let list = [...INITIAL_MOCK_EQUIPMENT];
  if (params.category && params.category !== 'All') {
    list = list.filter(item => item.category === params.category);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  }
  if (params.location) {
    list = list.filter(item => item.location.toLowerCase().includes(params.location.toLowerCase()));
  }
  return list;
}
