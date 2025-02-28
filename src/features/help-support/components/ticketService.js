import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

const ticketService = {
  // Create a new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await axiosInstance.post('/ticket', ticketData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Ticket creation error:', error);
      throw error;
    }
  },

  // Get tickets for logged-in user
  getUserTickets: async () => {
    try {
      const response = await axiosInstance.get('/ticket/user');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  },

  // Get all tickets (admin only)
  getAllTickets: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await axiosInstance.get(`/ticket/all${queryString}`);
      
      // Ensure we're returning in a consistent format
      if (response && response.data) {
        return { 
          success: true, 
          data: response.data.data || response.data // Handle both possible structures
        };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
  },

  // Get ticket statistics
  getTicketStats: async () => {
    try {
      const response = await axiosInstance.get('/ticket/stats');
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      
      // As a fallback, return empty stats object
      return { 
        success: false, 
        data: {
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0,
          unassigned: 0
        } 
      };
    }
  },

  // Get specific ticket
  getTicket: async (id) => {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid ticket ID');
      }
      
      const response = await axiosInstance.get(`/ticket/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error fetching ticket ${id}:`, error);
      throw error;
    }
  },

  // Update ticket status
  updateTicketStatus: async (id, status) => {
    try {
      if (!id || !status) {
        throw new Error('Ticket ID and status are required');
      }
      
      const response = await axiosInstance.put(`/ticket/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error updating ticket ${id} status:`, error);
      throw error;
    }
  },

  // Reply to ticket
  replyToTicket: async (id, content) => {
    try {
      if (!id || !content) {
        throw new Error('Ticket ID and content are required');
      }
      
      const response = await axiosInstance.post(`/ticket/${id}/reply`, { content });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error replying to ticket ${id}:`, error);
      throw error;
    }
  },

  // Assign ticket
  assignTicket: async (id, adminId) => {
    try {
      if (!id || !adminId) {
        throw new Error('Ticket ID and admin ID are required');
      }
      
      const response = await axiosInstance.put(`/ticket/${id}/assign`, { adminId });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error assigning ticket ${id}:`, error);
      throw error;
    }
  },

  // Delete ticket
  deleteTicket: async (id) => {
    try {
      if (!id) {
        throw new Error('Ticket ID is required');
      }
      
      await axiosInstance.delete(`/ticket/${id}`);
      return { success: true, message: 'Ticket deleted successfully' };
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      throw error;
    }
  },
  getAdmins: async () => {
    try {
      const response = await axiosInstance.get('/ticket/admins');
      return { 
        success: true, 
        data: response.data?.data || [] 
      };
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch admin users',
        data: []
      };
    }
  },


  
};

const fetchTicket = async () => {
  setLoading(true);
  try {
      const response = await ticketService.getTicket(id);
      // Extract the actual ticket data from the response
      const ticketData = response.data;
      setTicket(ticketData);
      setNewStatus(ticketData.status || '');
      
      // Add debugging to check the structure
      console.log("Ticket data structure:", ticketData);
  } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error(error.message || 'Failed to fetch ticket');
      navigate('/admin/tickets');
  } finally {
      setLoading(false);
  }
};
export default ticketService;