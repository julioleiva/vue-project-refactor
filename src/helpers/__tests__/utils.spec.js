import { validateFields, toggleFavorite, getToken, setToken, clearToken } from '../utils';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('validateFields', () => {
  it('should return no errors for valid fields', () => {
    const fields = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    const errors = validateFields(fields);
    expect(errors).toEqual({});
  });

  it('should return errors for empty fields', () => {
    const fields = {
      name: '  ',
      email: '',
    };
    const errors = validateFields(fields);
    expect(errors).toEqual({
      name: 'name is required',
      email: 'email is required',
    });
  });

  it('should handle mixed valid and invalid fields', () => {
    const fields = {
      name: 'John Doe',
      email: '',
      phone: '  ',
    };
    const errors = validateFields(fields);
    expect(errors).toEqual({
      email: 'email is required',
      phone: 'phone is required',
    });
  });

  it('should handle empty object', () => {
    const fields = {};
    const errors = validateFields(fields);
    expect(errors).toEqual({});
  });
});

describe('toggleFavorite', () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', favorite: false },
    { id: 2, name: 'Product 2', favorite: true },
    { id: 3, name: 'Product 3', favorite: false },
  ];

  it('should toggle favorite status from false to true', () => {
    const updatedProducts = toggleFavorite(mockProducts, 1);
    expect(updatedProducts[0].favorite).toBe(true);
  });

  it('should toggle favorite status from true to false', () => {
    const updatedProducts = toggleFavorite(mockProducts, 2);
    expect(updatedProducts[1].favorite).toBe(false);
  });

  it('should not modify other products', () => {
    const updatedProducts = toggleFavorite(mockProducts, 1);
    expect(updatedProducts[1]).toEqual(mockProducts[1]);
    expect(updatedProducts[2]).toEqual(mockProducts[2]);
  });

  it('should handle non-existent product ID', () => {
    const updatedProducts = toggleFavorite(mockProducts, 999);
    expect(updatedProducts).toEqual(mockProducts);
  });

  it('should not mutate original array', () => {
    const originalProducts = [...mockProducts];
    toggleFavorite(mockProducts, 1);
    expect(mockProducts).toEqual(originalProducts);
  });
});

describe('Token Management', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('setToken', () => {
    it('should set token in localStorage', () => {
      const token = 'test-token';
      setToken(token);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      const token = getToken();
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe('test-token');
    });

    it('should return null when token is not set', () => {
      const token = getToken();
      expect(token).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      clearToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });
});