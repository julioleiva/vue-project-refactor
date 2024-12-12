export const Tooltip = jest.fn(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
  }));
  
  export default {
    Tooltip,
  };