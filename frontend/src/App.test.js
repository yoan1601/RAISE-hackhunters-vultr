import { render, screen } from '@testing-library/react';

import MainApp from './MainApp';

test('renders Multi-Agent Product Launcher title', () => {
  render(<MainApp />);
  const titleElement = screen.getByText(/Multi-Agent Product Launcher/i);
  expect(titleElement).toBeInTheDocument();
});