import React from "react";
import { FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
import bgImage from '../assets/images/bookstack-bg.png'
import StandardHeader from '../components/Header/standardHeader';
import StandardFooter from '../components/Footer/Footer';
import './Policies.css';

export default function Policies() {
  return (      
    <div className="min-h-screen w-screen" style={{ backgroundImage: `url(${bgImage})` }}>
    <StandardHeader/>

    <h1 className="text-white text-5xl font-bold text-center pt-10">POLICIES</h1>
    <div className="p-20 pt-10 shadow-2xl">
      {/* TOP SECTION */} 
        <UsagePolicy/>        
        <PrivacyPolicy/>
        <div className="footer-container">
            <StandardFooter />
        </div>
      </div>
      
    </div>       
  );
}


const div_class = "bg-white p-4";
const h1_class = "text-3xl font-bold text-[#012460] mb-8 tracking-wide";
const p_class = "text-base text-gray-700 leading-relaxed mb-4";

/* -------------------------------------------
  Usage Policy Component
------------------------------------------- */
function UsagePolicy() {
  return (
    <div className={div_class}>
      <h1 className={h1_class}>Usage Policy</h1>
      <p></p>
        <img style = {{width: "186px", marginBottom: "10px"}}
        src = "https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.svg">          
        </img>              
      <p className={p_class}>
        This tool is free to use under a Creative Commons license (CC BY-NC-SA). You may
        share and adapt the work as long as you give credit to the creators (BY), do not use it for commercial purposes (NC), and license any new creations under the same terms (SA). 
        Proper attribution to the creators (<b>Dr. Courtney Broscious</b>, <b>Dr. Garrett Dancik</b>,
        and <b>Lora Lee</b>) is required when referencing or sharing materials developed using this tool. Please include a citation or acknowledgment in any course materials, presentations, or publications that incorporate content created with this tool.
      </p>    
      <p className={p_class}> Source code is available from: <a 
        style = {{margin: "0px"}} href = "https://github.com/gdancik/CoursePlanningTool">
          https://github.com/gdancik/CoursePlanningTool</a>
        </p>  
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className={div_class}>
      <h1 className={h1_class}>Privacy Policy</h1>
      <p className={p_class}>
        <b>Last updated</b>: December 5, 2025
      </p>
        <p className={p_class}>
        Thank you for using the Course Planning Tool, an online platform designed to help
        university instructors plan and create new courses. Your privacy is important to us.
         This Privacy Policy explains how we collect, use, store, and protect your information when you use our services. 
      </p>
        <p className={p_class}>

        <ol>
          <li>Information We Collect</li>
          <ol>
          <li>Information obtained from logging in, which is limited to your e-mail address and name provided by Google</li>
          <li>Information which you provide to us, i.e., course information</li>
          <li>Automated information including your IP address, browser, operating system, and activity logs </li>
          </ol>
        
         <li> Cookies and Tracking </li>
          <ol>
            <li>Session cookies are used to handle authentication. Google cookies are used for Google Analytics. No other cookies are used and we do not use cookies to track your activity. </li>
            </ol>

            <li>Data Storage</li>
            <ol>
              <li>Information you enter may be stored on an encrypted database hosted by Google whose privacy policies are described <a href = "https://firebase.google.com/support/privacy">here</a>. </li>
              <li>Your e-mail address and usage information is stored on an unencrypted server to monitor usage. </li>        
              <li>This information is accessible only to the system administrator, who will access data in accordance with this privacy policy</li>
            </ol>
            <li>Data Sharing</li>
            <ol>
              <li>We share information only with service providers necessary for operation (such as hosting or analytics services).</li>        
              <li>We do <b>not</b> sell your personal information.</li>
              <li>We do <b>not</b> share your data with third parties except as described above or required by law.</li>
            </ol>
            <li> Children's Privacy</li>
            <ol>
              <li>This platform is intended for use by adults in higher
                education. We do not knowingly collect personal information from children under 13.
              </li>
            </ol>
            <li> Changes to this policy</li>
            <ol>              
              <li>We may update this Privacy Policy periodically. When we do, we will revise the “Last updated” date.
                </li>
              </ol>


        </ol>
          </p>

    </div>
  );
}
