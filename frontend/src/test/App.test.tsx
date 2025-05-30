import { render, screen } from '@testing-library/react';
import App from '../App';
import Welcome from '../welcome';
import {BrowserRouter} from "react-router-dom";
import {MemoryRouter} from "react-router-dom";

/**********************************************************
 * Test whether components render without crashing
 *********************************************************/
it('<App /> renders without crashing', () => {
  render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
});

it('<Welcome /> renders without crashing', () => {
  render(<Welcome name="World" />);
});

/**********************************************************
 * Test whether correct text is displayed
 *********************************************************/

test('<Welcome /> displays name', () => {
  render(<Welcome name="World" />);
  const welcomeElement = screen.getByText(/Hello World/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('Home page includes React Home Page', () => {
  render(
      <BrowserRouter>
        <App />
        </BrowserRouter>
  );
  const text = screen.getByText(/React Home Page/i);
  expect(text).toBeInTheDocument();
});


/**********************************************************
 * Test Navigation Behavior
 *********************************************************/
test('renders welcome page on default route', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <App />
        </MemoryRouter>
    );

    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
});
