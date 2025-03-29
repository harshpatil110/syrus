const API_BASE_URL = 'http://localhost:3001/api';

export const negotiationService = {
  // Submit a new negotiation
  submitNegotiation: async (negotiationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(negotiationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit negotiation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting negotiation:', error);
      throw error;
    }
  },

  // Get all negotiations
  getNegotiations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch negotiations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      throw error;
    }
  },

  // Get a single negotiation by ID
  getNegotiationById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch negotiation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching negotiation:', error);
      throw error;
    }
  },

  // Update a negotiation
  updateNegotiation: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update negotiation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating negotiation:', error);
      throw error;
    }
  },

  // Delete a negotiation
  deleteNegotiation: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete negotiation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting negotiation:', error);
      throw error;
    }
  },
}; 