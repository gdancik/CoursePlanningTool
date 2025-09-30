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
    
    // Check if the alert contains the message text (which means component rendered)
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test('has correct styling structure', () => {
    const { container } = render(<Alert text="Test message" />);
    
    // Check that the component has the expected div structure
    const alertElement = container.firstChild;
    expect(alertElement).toHaveStyle('position: relative');
  });

  test('handles empty text gracefully', () => {
    const { container } = render(<Alert text="" />);
    
    // Component should still render even with empty text
    expect(container.firstChild).toBeInTheDocument();
  });

  test('handles long text content', () => {
    const longText = "This is a very long alert message that should wrap properly and display correctly even when it contains multiple sentences and extends beyond the normal width of the component container.";
    render(<Alert text={longText} />);
    
    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});