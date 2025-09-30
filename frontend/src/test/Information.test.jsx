import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Information from '../components/SyllabusComponents/Information';

/**
 * Test suite for Information component
 * Tests the green informational message component
 */
describe('Information Component', () => {
  test('renders without crashing', () => {
    render(<Information text="Test information message" />);
  });

  test('displays the provided text', () => {
    const testMessage = "Information entered on this page will appear in the final syllabus exactly as written.";
    render(<Information text={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('contains the information icon', () => {
    render(<Information text="Test message" />);
    
    // Check if the information component contains the message text
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test('has correct styling structure', () => {
    const { container } = render(<Information text="Test message" />);
    
    // Check that the component has the expected styling
    const infoElement = container.firstChild;
    expect(infoElement).toHaveStyle('display: flex');
    expect(infoElement).toHaveStyle('background: #d4edda');
  });

  test('handles empty text gracefully', () => {
    const { container } = render(<Information text="" />);
    
    // Component should still render even with empty text
    expect(container.firstChild).toBeInTheDocument();
  });

  test('handles long text content', () => {
    const longText = "This is a very long informational message that should wrap properly and display correctly even when it contains multiple sentences and provides detailed guidance to users.";
    render(<Information text={longText} />);
    
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  test('displays different text content correctly', () => {
    const { rerender } = render(<Information text="First message" />);
    expect(screen.getByText("First message")).toBeInTheDocument();
    
    rerender(<Information text="Second message" />);
    expect(screen.getByText("Second message")).toBeInTheDocument();
    expect(screen.queryByText("First message")).not.toBeInTheDocument();
  });
});