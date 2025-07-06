// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-router to prevent issues in tests
jest.mock('react-router', () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children }) => children,
}));

// Polyfill TextEncoder for Jest environment
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;