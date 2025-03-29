const API_BASE_URL = 'http://localhost:5000/api/cold-storage';

export const coldStorageService = {
  // Get all cold storage facilities
  getFacilities: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/facilities`);
      if (!response.ok) {
        throw new Error('Failed to fetch facilities');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },

  // Get transport options
  getTransportOptions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transport`);
      if (!response.ok) {
        throw new Error('Failed to fetch transport options');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transport options:', error);
      throw error;
    }
  },

  // Book cold storage
  bookStorage: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to book storage');
      }

      return await response.json();
    } catch (error) {
      console.error('Error booking storage:', error);
      throw error;
    }
  },

  // Get booking status
  getBookingStatus: async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking status:', error);
      throw error;
    }
  },
}; 