import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';

// Mock component for testing
const MockMainContent = () => <div data-testid="main-content">Main Content Area</div>;

/**
 * Test suite for SidebarLayout component
 * Tests the two-column layout with sidebar and main content
 */
describe('SidebarLayout Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
  });

  test('displays main content in the content area', () => {
    render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  test('renders sidebar with default links', () => {
    render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    // Check for some expected sidebar links
    const overviewLink = screen.getByText(/overview/i);
    expect(overviewLink).toBeInTheDocument();
  });

  test('has correct layout structure', () => {
    const { container } = render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    // Check that the layout has the expected structure
    const sidebarLayout = container.querySelector('.sidebar-layout');
    expect(sidebarLayout).toBeInTheDocument();
  });

  test('renders yellow accent bar', () => {
    const { container } = render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    // Look for the yellow accent styling
    const yellowBar = container.querySelector('.yellow-bar');
    expect(yellowBar).toBeInTheDocument();
  });

  test('handles multiple children', () => {
    render(
      <BrowserRouter>
        <SidebarLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </SidebarLayout>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});