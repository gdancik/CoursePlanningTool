// components/OverviewCard.test.tsx
import { render, screen } from '@testing-library/react';
import OverviewCard from '../components/SyllabusComponents/OverviewCard';
import { BrowserRouter } from 'react-router-dom';

/**********************************************************
 * Test if OverviewCard renders with Props
 *********************************************************/
test('<OverviewCard /> renders with props', () => {
    render(
        <BrowserRouter>
            <OverviewCard
                title="Course Info"
                description="Basic info about the course"
                completed={true}
                link="/course-info"
            />
        </BrowserRouter>
    );

    expect(screen.getByText(/Course Info/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic info about the course/i)).toBeInTheDocument();
});
