import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckboxGroup from '../components/SyllabusComponents/CheckboxGroup';

/**
 * Test suite for CheckboxGroup component
 * Tests the flexible checkbox group component with Check All functionality
 */
describe('CheckboxGroup Component', () => {
  test('renders without crashing with default props', () => {
    render(<CheckboxGroup />);
  });

  test('displays default data when no data prop provided', () => {
    render(<CheckboxGroup />);
    
    // Default data should be ["M", "T", "W", "R", "F"]
    expect(screen.getByLabelText('M')).toBeInTheDocument();
    expect(screen.getByLabelText('T')).toBeInTheDocument();
    expect(screen.getByLabelText('W')).toBeInTheDocument();
    expect(screen.getByLabelText('R')).toBeInTheDocument();
    expect(screen.getByLabelText('F')).toBeInTheDocument();
  });

  test('displays custom data when provided', () => {
    const customData = ["Quiz", "Exam", "Project"];
    render(<CheckboxGroup data={customData} />);
    
    expect(screen.getByLabelText('Quiz')).toBeInTheDocument();
    expect(screen.getByLabelText('Exam')).toBeInTheDocument();
    expect(screen.getByLabelText('Project')).toBeInTheDocument();
  });

  test('renders Check All option when included in data', () => {
    const dataWithCheckAll = ["Check All", "Option 1", "Option 2"];
    render(<CheckboxGroup data={dataWithCheckAll} />);
    
    expect(screen.getByLabelText('Check All')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  test('individual checkbox can be checked and unchecked', () => {
    render(<CheckboxGroup data={["Option 1", "Option 2"]} />);
    
    const option1 = screen.getByLabelText('Option 1');
    expect(option1).not.toBeChecked();
    
    fireEvent.click(option1);
    expect(option1).toBeChecked();
    
    fireEvent.click(option1);
    expect(option1).not.toBeChecked();
  });

  test('Check All functionality works correctly', () => {
    const dataWithCheckAll = ["Check All", "Option 1", "Option 2", "Option 3"];
    render(<CheckboxGroup data={dataWithCheckAll} />);
    
    const checkAll = screen.getByLabelText('Check All');
    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');
    const option3 = screen.getByLabelText('Option 3');
    
    // Initially all should be unchecked
    expect(checkAll).not.toBeChecked();
    expect(option1).not.toBeChecked();
    expect(option2).not.toBeChecked();
    expect(option3).not.toBeChecked();
    
    // Click Check All - should check all options
    fireEvent.click(checkAll);
    expect(checkAll).toBeChecked();
    expect(option1).toBeChecked();
    expect(option2).toBeChecked();
    expect(option3).toBeChecked();
    
    // Click Check All again - should uncheck all options
    fireEvent.click(checkAll);
    expect(checkAll).not.toBeChecked();
    expect(option1).not.toBeChecked();
    expect(option2).not.toBeChecked();
    expect(option3).not.toBeChecked();
  });

  test('Check All updates when individual items are checked/unchecked', () => {
    const dataWithCheckAll = ["Check All", "Option 1", "Option 2"];
    render(<CheckboxGroup data={dataWithCheckAll} />);
    
    const checkAll = screen.getByLabelText('Check All');
    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');
    
    // Check all individual items
    fireEvent.click(option1);
    fireEvent.click(option2);
    
    // Check All should be checked when all items are checked
    expect(checkAll).toBeChecked();
    
    // Uncheck one item
    fireEvent.click(option1);
    
    // Check All should be unchecked
    expect(checkAll).not.toBeChecked();
  });

  test('applies custom id when provided', () => {
    const customId = "meeting-days-checkboxes";
    render(<CheckboxGroup id={customId} />);
    
    const container = document.getElementById(customId);
    expect(container).toBeInTheDocument();
  });

  test('renders in horizontal layout by default', () => {
    const { container } = render(<CheckboxGroup />);
    
    const checkboxGroup = container.querySelector('#checkbox_group');
    const computedStyle = window.getComputedStyle(checkboxGroup);
    expect(computedStyle.flexDirection).toBe('row');
  });

  test('renders in vertical layout when horizontal=false', () => {
    const { container } = render(<CheckboxGroup horizontal={false} />);
    
    const checkboxGroup = container.querySelector('#checkbox_group');
    const computedStyle = window.getComputedStyle(checkboxGroup);
    expect(computedStyle.flexDirection).toBe('column');
  });

  test('handles empty data array', () => {
    render(<CheckboxGroup data={[]} />);
    
    const container = document.querySelector('#checkbox_group');
    expect(container).toBeInTheDocument();
    expect(container.children).toHaveLength(0);
  });
});