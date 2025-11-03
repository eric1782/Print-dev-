import { render, screen } from '@testing-library/react';
import ErrorMessage from '../common/ErrorMessage.jsx';

describe('ErrorMessage Component', () => {
  it('should render error message correctly', () => {
    const message = 'Test error message';
    render(<ErrorMessage message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should render empty paragraph when message is empty', () => {
    render(<ErrorMessage message="" />);
    const messageElement = screen.getByText('Error');
    expect(messageElement).toBeInTheDocument();
  });
});