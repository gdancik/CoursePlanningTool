import React, { useEffect, useState } from "react";

/*************************************************************************
 * Logic is as follows:
 * - checkLogin will wait for profile information
 * - handle login redirects to flask endpoint for google login
 *    - an optional referrer can be specified (flask redirects to this)
 *    - successful login sets user (id and name), which updates the page
 * 
 * TO DO: fetch urls should not be hardcoded here
 **************************************************************************/

export default function GoogleLogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if already logged in (after callback redirect)
    const checkLogin = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/profile/", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();          
          setUser(data);
        }
      } catch (err) {
        console.error("Not logged in:", err);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/api/google_login/?referrer=" + window.location.href;
  };

const logout = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/logout/", {
          credentials: "include",
        });
        if (res.ok) {               
          setUser('');
        }
      } catch (err) {
        alert("Unable to logout");
      }
    };

  return (
    <div>
      {!user ? (<div>
        <h3>Login with Google</h3>
        <button onClick={handleLogin}>
          Login with Google
        </button>
        </div>
      ) : (
        <div>
          <h3> Login successful</h3>
          Welcome, {user.name} ({user.id}) &nbsp;
          <button onClick = {logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

