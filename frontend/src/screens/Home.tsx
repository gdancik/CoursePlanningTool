/*
 Home page, Test to see if the previous functional test from old App after being
 merged to this file still work when running npm test
 */

import Welcome from '../welcome';

const Home = () => {
    return (
        <div>
            <Welcome name  = 'World'/>
            <h2>React Home Page</h2>
        </div>
    );
};

export default Home;

