import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple, testable checkbox group component
function CheckboxGroup({
  id = "meeting_days_checkboxes",
  data = ["M", "T", "W", "R", "F"],
  horizontal = true,
}) {
  return (
    <div
      id={id}
      role="group"
      aria-label="Meeting days"
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: '0.5rem',
      }}
    >
      {data.map((d) => (
        <label
          key={d}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <input type="checkbox" value={d} />
          {d}
        </label>
      ))}
    </div>
  );
}

describe('CheckboxGroup Component', () => {
  test('renders with default props', () => {
    render(<CheckboxGroup />);
    
    // Check if the group element is rendered
    const group = screen.getByRole('group', { name: 'Meeting days' });
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('id', 'meeting_days_checkboxes');
    
    // Check if all default checkboxes are rendered
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(5);
    
    // Check if labels are correct
    expect(screen.getByLabelText('M')).toBeInTheDocument();
    expect(screen.getByLabelText('T')).toBeInTheDocument();
    expect(screen.getByLabelText('W')).toBeInTheDocument();
    expect(screen.getByLabelText('R')).toBeInTheDocument();
    expect(screen.getByLabelText('F')).toBeInTheDocument();
  });

  test('renders with custom data', () => {
    const customData = ['Option 1', 'Option 2', 'Option 3'];
    render(<CheckboxGroup data={customData} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
    
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
  });

  test('renders with custom id', () => {
    const customId = 'custom-checkbox-group';
    render(<CheckboxGroup id={customId} />);
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('id', customId);
  });

  test('applies horizontal layout by default', () => {
    render(<CheckboxGroup />);
    
    const group = screen.getByRole('group');
    expect(group).toHaveStyle('flex-direction: row');
  });

  test('applies vertical layout when horizontal is false', () => {
    render(<CheckboxGroup horizontal={false} />);
    
    const group = screen.getByRole('group');
    expect(group).toHaveStyle('flex-direction: column');
  });
});

// Export the component for use in other files
export { CheckboxGroup };