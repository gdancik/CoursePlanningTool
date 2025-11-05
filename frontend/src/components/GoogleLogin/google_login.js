import { useState } from "react";
import {useAuth} from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider } from "@react-oauth/google";

import api from "../../services/axios";
import ErrorModal from "../Modals/ErrorModal/ErrorModal";

// requires REACT_APP_CLIENT_ID set in .env

/**
 * @function MyGoogleLogin
 * @description The GoogleLogin component
 * @param autonavigate - If true, then automatically navigates
 *              to user's course page following login (default = false)
 * @returns {html} a container containing Google Login button, and
 *                  Continue and Logout buttons after a successful
 *                  login.
 */
export default function MyGoogleLogin ({                        
                            auto_navigate = false, 
                         } ) {

    const {user, setUser} = useAuth();
    const [errorModalMessage, setErrorModalMessage] = useState("")
    const [errorModalVisible, setErrorModalVisible] = useState(false)
    const [errorModalCode, setErrorModalCode] = useState("")
    
    const navigate = useNavigate();
   
    // confirm jwt with backend,      
    const google_login = async (jwt) => { 
    try {
        const response = await api.post('google_login', {"jwt": jwt})
        console.log("status = " + response.status);
        
        if (response.status !== 200) {          
          setErrorModalCode(response.status);
          setErrorModalMessage(response.setErrorModalMessage)
          setErrorModalVisible(true);
          console.log(response);          
        }   
        
        console.log("confirmed...");          
        console.log(response.data);            
                
        const data = response.data;
        setUser({user: data.user, name: data.name});            
        
          
        if (auto_navigate) {
            setTimeout(() => {                                      
                      navigate("/course-page");
            }, 1500);    
        }              
    } catch(error) {
        console.error("Error", error);
        setErrorModalMessage("Unable to log in: " + error.message);    
        setErrorModalCode(error.status);        
        setErrorModalVisible(true);    
    };    
}

    // handles logout on backend
    const logout = async () => {
        try {
    
        const res = await api.get('logout/');

        if (res.status == 200) {               
            setUser(null);
        }
        } catch (err) {
        alert("Error: Unable to logout");        
        }
    };

    const closeModal = () => {
      setErrorModalVisible(false);
    }

  return (

    <>

    { errorModalVisible? (
    <ErrorModal message = {errorModalMessage}
                errorCode = {errorModalCode}
                onClose = {closeModal}
                ></ErrorModal>
    ) : (null)
  }

    { user? (
        <center>
            <p>Welcome, {user.name} ({user.user}) </p>
        </center>
        ) : (null)
    }

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
       <GoogleLogin
        theme="filled_blue"
        shape="pill"
        onSuccess={(credentialResponse) => {
          console.log("Encoded JWT ID token:", credentialResponse.credential);
          const decoded = jwtDecode(credentialResponse.credential);
          console.log("Decoded JWT:", decoded);
          console.log("calling fetch...");

          // log on to backend
          google_login(credentialResponse.credential);
          
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      /> 
    </GoogleOAuthProvider>
    {user && !auto_navigate? (
        <>         
            <div style = {{marginTop: "10px"}}>
            <button onClick = {() => {navigate('/course-page')}}
                    style = {{backgroundColor:"lightblue",
                                height: "30px"
                    }}>Click to Continue</button>
                    &nbsp;
             <button onClick = {logout}
                    style = {{backgroundColor:"#dc3545",
                        height: "30px"
                    }}
            >Logout</button>
            </div>
            </>
        ) : (null)
      }

    </div>      

    </>

  );

}
