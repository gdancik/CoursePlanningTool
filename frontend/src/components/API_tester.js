// This file defines a reusable components for sending requests to API endpoints
//  - AutoTestLogin -- automatically login in with specified 'user' name and 'password'
//  - AutoPostRequest -- submits a post request to given 'url' with 'body'

// Functional component that renders a styled button

import React, { useEffect, useState } from 'react';

export function AutoTestLogin(props) {
  // props should contain baseurl, user and password
  
  const [responseMessage, setResponseMessage] = useState('');

  const login_url = `${props.baseurl}?user=${props.user}&password=${props.password}`;

  useEffect(() => {
    const getData = async () => {
      try {
        // alert(login_url);
        const res = await fetch(login_url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
                    
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const result = await res.json();
        setResponseMessage(`Success: ${JSON.stringify(result)}`);
      } catch (error) {
        setResponseMessage(`Error: ${error.message}`);
      }
    };

    getData();
  }, [login_url]);

  return (
    <div>
      <h2>Login Successful</h2>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export function AutoPostRequest(props) {
// props should contain url, and header body as a JSON object

  const [responseMessage, setResponseMessage] = useState('');
  const url = props.url;
  const body = props.body;

  useEffect(() => {
    const postData = async () => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: body
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const result = await res.json();
        setResponseMessage(`Success: ${JSON.stringify(result)}`);
      } catch (error) {
        setResponseMessage(`Error: ${error.message}`);        
      }
    };

    postData();
  }, [url, body]);

  return (
    <div>
      <h2>POST Request Sent</h2>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};


