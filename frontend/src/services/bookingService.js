import { fetchWithAuth } from './api';

const MOCK_BOOKINGS = [
  {
    _id: 'b101',
    equipment: {
      _id: 'eq1',
      name: 'John Deere 5050D 50HP Tractor',
      category: 'Tractor',
      images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
      dailyRate: 1500,
      location: 'Ludhiana, Punjab',
      owner: { name: 'Rajesh Patel', phone: '+91 98765 22222', location: 'Ludhiana, Punjab' }
    },
    farmer: { _id: 'u1', name: 'Harpreet Singh', email: 'farmer@agrirent.com', phone: '+91 98765 11111' },
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    totalDays: 4,
    dailyRate: 1500,
    includeDriver: true,
    driverCost: 1600,
    totalPrice: 7600,
    status: 'Approved',
    notes: 'Need early morning delivery for ploughing wheat field.'
  },
  {
    _id: 'b102',
    equipment: {
      _id: 'eq2',
      name: 'Kubota Harvester DC-68G-HK',
      category: 'Harvester',
      images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'],
      dailyRate: 3500,
      location: 'Karnal, Haryana',
      owner: { name: 'Rajesh Patel', phone: '+91 98765 22222', location: 'Karnal, Haryana' }
    },
    farmer: { _id: 'u1', name: 'Harpreet Singh', email: 'farmer@agrirent.com', phone: '+91 98765 11111' },
    startDate: '2026-08-18',
    endDate: '2026-08-20',
    totalDays: 2,
    dailyRate: 3500,
    includeDriver: true,
    driverCost: 1000,
    totalPrice: 8000,
    status: 'Pending',
    notes: 'Paddy harvesting.'
  }
];

export const bookingService = {
  create: async (bookingData) => {
    try {
      return await fetchWithAuth('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    } catch (err) {
      const newBooking = {
        _id: 'b_' + Date.now(),
        ...bookingData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      MOCK_BOOKINGS.unshift(newBooking);
      return newBooking;
    }
  },

  getMyBookings: async () => {
    try {
      const data = await fetchWithAuth('/bookings');
      if (Array.isArray(data) && data.length > 0) return data;
      return MOCK_BOOKINGS;
    } catch (err) {
      return MOCK_BOOKINGS;
    }
  },

  updateStatus: async (bookingId, status) => {
    try {
      return await fetchWithAuth(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    } catch (err) {
      const b = MOCK_BOOKINGS.find(item => item._id === bookingId);
      if (b) b.status = status;
      return { ...b, status };
    }
  }
};
