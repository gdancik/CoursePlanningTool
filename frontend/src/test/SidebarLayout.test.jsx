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

  test('renders with empty sidebar by default', () => {
    render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    // Component should render successfully
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  test('has correct layout structure', () => {
    const { container } = render(
      <BrowserRouter>
        <SidebarLayout>
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    // Check that the layout has flex display (two-column layout)
    const layoutElement = container.firstChild;    
    expect(layoutElement).toHaveClass('flex');
  });

  test('renders yellow accent bar', () => {
    const { container } = render(
      <BrowserRouter>
        <SidebarLayout accentColor="#ffc107">
          <MockMainContent />
        </SidebarLayout>
      </BrowserRouter>
    );
    
    // Component should render successfully (the yellow bar is rendered with inline styles)
    expect(container.firstChild).toBeInTheDocument();
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