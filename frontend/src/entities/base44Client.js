const API_BASE = 'https://app.base44.com/api/apps/6878f5d619758ebf19f671fd';
const API_KEY = 'bb7b89d2c85b4bfb8552e79056dc61db';

// Helper function to extract array from response
function extractArray(data) {
  console.log('extractArray input:', data, 'type:', typeof data);
  
  if (Array.isArray(data)) {
    console.log('Data is already an array with', data.length, 'items');
    return data;
  }
  if (data && typeof data === 'object') {
    // Try common wrapper properties
    const wrapperKeys = ['data', 'items', 'results', 'records', 'entities', 'rows', 'list', 'members'];
    for (const key of wrapperKeys) {
      if (Array.isArray(data[key])) {
        console.log(`Found array in data.${key} with`, data[key].length, 'items');
        return data[key];
      }
    }
    // Check all keys for arrays
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        console.log(`Found array in data.${key} with`, data[key].length, 'items');
        return data[key];
      }
    }
    // If it's a single object with an id, wrap it in array
    if (data.id) {
      console.log('Data is a single object with id, wrapping in array');
      return [data];
    }
  }
  console.log('Could not extract array, returning empty array');
  return [];
}

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log('🔵 API Request:', options.method || 'GET', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    console.log('🔵 Response Status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('🔵 Raw Response (first 1000 chars):', responseText.substring(0, 1000));
    
    if (!response.ok) {
      const error = responseText ? JSON.parse(responseText) : { message: 'Request failed' };
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    if (!responseText || responseText.trim() === '') {
      console.log('🔵 Empty response, returning null');
      return null;
    }
    
    const data = JSON.parse(responseText);
    console.log('🔵 Parsed Response:', data);
    console.log('🔵 Response type:', typeof data, Array.isArray(data) ? `Array[${data.length}]` : '');
    
    return data;
  } catch (error) {
    console.error('🔴 API Request Error:', url, error);
    throw error;
  }
}

// Create entity methods for a given entity name
function createEntityMethods(entityName) {
  return {
    // List all entities with optional sorting and limit
    list: async (orderBy = '-created_date', limit = 100) => {
      const params = new URLSearchParams();
      if (orderBy) params.append('order_by', orderBy);
      if (limit) params.append('limit', limit);
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiRequest(`/entities/${entityName}${query}`);
      return extractArray(response);
    },

    // Get a single entity by ID
    get: async (id) => {
      return apiRequest(`/entities/${entityName}/${id}`);
    },

    // Create a new entity
    create: async (data) => {
      return apiRequest(`/entities/${entityName}`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    // Update an existing entity
    update: async (id, data) => {
      return apiRequest(`/entities/${entityName}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    // Delete an entity
    delete: async (id) => {
      return apiRequest(`/entities/${entityName}/${id}`, {
        method: 'DELETE'
      });
    },

    // Filter entities by field values
    filter: async (filters, orderBy = '-created_date', limit = 100) => {
      const params = new URLSearchParams();
      if (orderBy) params.append('order_by', orderBy);
      if (limit) params.append('limit', limit);
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiRequest(`/entities/${entityName}${query}`);
      return extractArray(response);
    }
  };
}


// Use the correct entity name as defined in Base44 (singular, capital M)
export const base44 = {
  entities: {
    Member: createEntityMethods('Member'),
    Trainer: createEntityMethods('Trainer'),
    Equipment: createEntityMethods('Equipment'),
    Payment: createEntityMethods('Payment'),
    Class: createEntityMethods('Class'),
    Attendance: createEntityMethods('Attendance')
  }
};

export default base44;
