// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-router to prevent issues in tests
jest.mock('react-router-dom', () => ({ // Use a more robust mock
  ...jest.requireActual('react-router-dom'), // Inherit non-mocked parts
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element, // Correctly render the element prop
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ to, children }) => <a href={to}>{children}</a>, // A more realistic Link
}));

// Polyfill TextEncoder for Jest environment
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;