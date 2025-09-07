import React, { useEffect, useState } from "react";
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RedirectingModal from "./RedirectingModal/RedirectingModal";

/*************************************************************************
 * Logic is as follows:
 * - checkLogin will wait for profile information
 * - handle login redirects to flask endpoint for google login
 *    - an optional referrer can be specified (flask redirects to this)
 *    - successful login sets user (id and name), which updates the page
 * 
 * TO DO: fetch urls should not be hardcoded here
 **************************************************************************/

export default function GoogleLogin({
                         display_logout = true, 
                         auto_navigate = false, 
                         display_modal = false}){

  const [user, setLocalUser] = useState(null);

  const {setUser} = useAuth();

  const navigate = useNavigate();

  // New modal states
  
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");


  useEffect(() => {
    // Check if already logged in (after callback redirect)

    const checkLogin = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/profile/", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();          
          setUser(data.user);  
          setLocalUser(data);  

          if (display_modal) {
            setModalStatus("success");
            setModalTitle("Login Successful");
            setModalMessage(`Welcome ${data.name}! Redirecting to your course page...`);          
            setModalVisible(true);
          }
          
          if (auto_navigate) {
            setTimeout(() => {                                      
                      navigate("/course-page");
                  }, 1500);    
          }  
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
          setLocalUser('');
        }
      } catch (err) {
        alert("Unable to logout");
      }
  };

  return (
    <>
    
      {!user ? (
              <button onClick={handleLogin}>Login using Google</button>                      
      ) : (      
            <h3>Welcome, {user.name} ({user.user}) </h3>
      )}

      {user && !auto_navigate? (
            <button onClick = {() => {navigate('/course-page')}}>Click to Continue</button>
        ) : (null)
      }

      {user && display_logout? (
            <button onClick = {logout}
                    style = {{backgroundColor:"maroon"}}
            >Logout</button>
        ) : (null)
      }
     

     
           {/* Reusable modal with props */}
            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />

    </>
  );
}

