import React from 'react';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
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
            <div className = "center-group">
            <p><a href = '/'>Home</a> | 
               <a href = '/about/'>About</a> | 
               <a href = '/policies'>Policies</a>
               </p>      
               </div>      
            <div className = "right-item footer">
            <ScrollToTop/>                          
                      
            </div>            
        </header>
    );
};
export default StandardFooter;