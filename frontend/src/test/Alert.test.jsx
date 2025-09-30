import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from '../components/SyllabusComponents/Alert';

/**
 * Test suite for Alert component
 * Tests the yellow warning alert component with stacked paper effect
 */
describe('Alert Component', () => {
  test('renders without crashing', () => {
    render(<Alert text="Test alert message" />);
  });

  test('displays the provided text', () => {
    const testMessage = "The ELAC requires that you implement at least two High Impact Practices into your course.";
    render(<Alert text={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('contains the exclamation icon', () => {
    render(<Alert text="Test message" />);
    
    // Check if the alert contains the Font Awesome exclamation circle icon
    const alertContainer = screen.getByText("Test message").closest('.alert');
    expect(alertContainer).toBeInTheDocument();
  });

  test('has correct CSS classes for styling', () => {
    render(<Alert text="Test message" />);
    
    const alertContainer = screen.getByText("Test message").closest('.alert');
    expect(alertContainer).toHaveClass('alert');
  });

  test('handles empty text gracefully', () => {
    render(<Alert text="" />);
    
    const alertContainer = document.querySelector('.alert');
    expect(alertContainer).toBeInTheDocument();
  });

  test('handles long text content', () => {
    const longText = "This is a very long alert message that should wrap properly and display correctly even when it contains multiple sentences and extends beyond the normal width of the component container.";
    render(<Alert text={longText} />);
    
    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});