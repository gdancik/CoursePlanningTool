import React, { useEffect, useState } from "react";
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RedirectingModal from "./RedirectingModal/RedirectingModal";
import api from "../services/axios";
import './google_login.css';

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
     
        const res = await api.get("profile/");
        console.log(res);

        if (res.status === 200) {
          console.log("status is ok");
          const data = await res.data;
          console.log("got data");          
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
    window.location.href = api.defaults.baseURL + "google_login/?referrer=" + window.location.href;
  };

const logout = async () => {
      try {

        //const res = await fetch("http://127.0.0.1:5000/api/logout/", {
        //  credentials: "include",
        //});

        const res = await api.get('logout/');

        if (res.status == 200) {               
          setLocalUser('');
        }
      } catch (err) {
        alert("Error: Unable to logout");
      }
  };

const gButton = `
<button class="gsi-material-button" style="width:100%;>
  <div class="gsi-material-button-state"></div>
  <div class="gsi-material-button-content-wrapper">
    <div class="gsi-material-button-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="display: block;">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
    <span class="gsi-material-button-contents">Sign in with Google</span>
    <span style="display: none;">Sign in with Google</span>
  </div>
</button>
`
  return (
    <>
  
      {!user ? (            
        <center>
              { <div onClick = {handleLogin} dangerouslySetInnerHTML={{ __html: (gButton) }} /> }                    
        </center>
      ) : ( 

        <center>
        <p>Welcome, {user.name} ({user.user}) </p>
        </center>
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

