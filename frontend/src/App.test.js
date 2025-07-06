import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Backend Health Check title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Backend Health Check/i);
  expect(titleElement).toBeInTheDocument();
});
