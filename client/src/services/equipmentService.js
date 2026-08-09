import { fetchWithAuth } from './api';

export const equipmentService = {
  getAll: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        cleanParams[key] = params[key];
      }
    });
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/equipment?${queryString}` : '/equipment';
    const response = await fetchWithAuth(endpoint);
    return response.data || [];
  },

  getById: async (id) => {
    const response = await fetchWithAuth(`/equipment/${id}`);
    return response.data || response;
  },

  getMyEquipment: async () => {
    const response = await fetchWithAuth('/equipment/my');
    return response.data || [];
  },

  create: async (equipmentData) => {
    const isFormData = typeof FormData !== 'undefined' && equipmentData instanceof FormData;
    const body = isFormData ? equipmentData : JSON.stringify(equipmentData);
    const response = await fetchWithAuth('/equipment', {
      method: 'POST',
      body
    });
    return response.data || response;
  },

  update: async (id, equipmentData) => {
    const isFormData = typeof FormData !== 'undefined' && equipmentData instanceof FormData;
    const body = isFormData ? equipmentData : JSON.stringify(equipmentData);
    const response = await fetchWithAuth(`/equipment/${id}`, {
      method: 'PUT',
      body
    });
    return response.data || response;
  },

  delete: async (id) => {
    return await fetchWithAuth(`/equipment/${id}`, {
      method: 'DELETE'
    });
  }
};

