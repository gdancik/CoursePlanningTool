import React from 'react';
import ecsuLogoBlack from "../../assets/images/ecsu-logo-stacked-black.png"
import './standardFooter.css';

const StandardFooter = () => {
    return(
        <header className="footer-bottom"> 

            {/* 
            <img
                src = {ecsuLogoBlack}
                alt="Eastern Connecticut State University"
                className="ecsu-logo-standard"
            />
            */}
            <p></p>
            <p><a href = '/'>Home</a> | 
               <a href = '/about/'>About</a> | 
               <a href = '/policies'>Policies</a>
               </p>            
            
            <p></p>
        </header>
    );
};
export default StandardFooter;