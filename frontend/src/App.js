import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Welcome from './welcome.js';


function Home() {
  return (
   <div>
    <Welcome name = 'World'/> 
    <h2>React Home Page</h2>
   </div>
  );
}

function Login() {
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/login/')
      .catch((err) => {
        setError(err);
      });
  }, []);
 
  if (error) {
    return ( 
      <div>
       <h3> Error: Login was not successful (is flask running?) </h3> 
      </div>
    );
  }
 
  return (
    <div>
      <h2>You are logged in! Now check out <Link to = "/hello/">/hello/</Link></h2>
    </div>
  );
}


function Logout() {
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/logout/')
      .catch((err) => {
        setError(err);
      });
  }, []);
 
  if (error) {
    return ( 
      <div>
       <h3> Error: Logout was not successful (is flask running?) </h3> 
      </div>
    );
  }
 
  return (
    <div>
      <h2>You are logged out! Now check out <Link to = "/hello/">/hello/</Link></h2>
    </div>
  );
}


//.catch(err => setMessage('Error fetching data: make sure /api/hello endpoint is available from a running flask instance', err));
function Hello() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  // window.location.href = "http://localhost:5000/api/hello/";
  // window.location.href = "http://example.com";

  useEffect(() => {
    fetch('/api/hello/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, []);
  
  if (error) {
    return ( 
      <div>
       <h3> Error: either flask is not running, or you must <Link to="/login/">login</Link> </h3> 
      </div>
    );
  }
 
  return (
    <div>
      <h2>{message}</h2>
    </div>
  );

}

function App() {
  return (

    <Router future={{v7_relativeSplatPath: true,}}>
      <br/>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login/">Login</Link>
        | <Link to="/hello/">Hello</Link> | <Link to="/logout/">Logout</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/hello/" element={<Hello />} />
        <Route path="/logout/" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;


