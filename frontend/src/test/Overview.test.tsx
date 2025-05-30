import { render, screen } from '@testing-library/react';
import Overview from '../screens/SyllabusView/Overview';
import { BrowserRouter } from 'react-router-dom';
import { loadSyllabusSections } from '../utils/loadSyllabusSections';

jest.mock('../utils/loadSyllabusSections', () => ({
    loadSyllabusSections: jest.fn(),
}));

const mockSections = [
    {
        id: 1,
        title: 'Intro',
        description: 'Course and section',
        completed: true,
        link: '/intro',
    },
    {
        id: 2,
        title: 'Policies',
        description: 'Class policies and rules',
        completed: false,
        link: '/policies',
    },
];

describe('<Overview />', () => {
    test('loads and renders section cards from CSV', async () => {
        (loadSyllabusSections as jest.Mock).mockResolvedValue(mockSections);

        render(
            <BrowserRouter>
                <Overview />
            </BrowserRouter>
        );

        // ✅ Now this will pass because title is rendered visibly
        expect(await screen.findByText(/Intro/i)).toBeInTheDocument();
        expect(await screen.findByText(/Course and section/i)).toBeInTheDocument();
        expect(await screen.findByText(/Class policies and rules/i)).toBeInTheDocument();
    });
});
