import { render, screen } from '@testing-library/react';
import App from './App';
import Welcome from './welcome.js'


/**********************************************************
 * Test whether components render without crashing
 *********************************************************/
it('<App /> renders without crashing', () => {
  render(<App />);
});

it('<Welcome /> renders without crashing', () => {
  render(<Welcome name = 'World'/>);
});


/**********************************************************
 * Test whether correct text is displayed
 *********************************************************/

test('<Welcome /> displays name', () => {
  render(<Welcome name = 'World'/>);
  const welcomeElement = screen.getByText(/Hello World/i);
  expect(welcomeElement).toBeInTheDocument();
});


test('Home page includes React Home Page', () => {
  render(<App />);
  const text = screen.getByText(/React Home Page/i);
  expect(text).toBeInTheDocument();
});



