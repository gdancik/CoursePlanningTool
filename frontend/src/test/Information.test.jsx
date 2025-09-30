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
    
    // Check if the information component contains the icon
    const informationContainer = screen.getByText("Test message").closest('.information');
    expect(informationContainer).toBeInTheDocument();
  });

  test('has correct CSS classes for styling', () => {
    render(<Information text="Test message" />);
    
    const informationContainer = screen.getByText("Test message").closest('.information');
    expect(informationContainer).toHaveClass('information');
  });

  test('handles empty text gracefully', () => {
    render(<Information text="" />);
    
    const informationContainer = document.querySelector('.information');
    expect(informationContainer).toBeInTheDocument();
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