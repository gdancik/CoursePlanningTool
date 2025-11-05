import React from 'react';
import ecsuLogoBlack from "../../assets/images/ecsu-logo-stacked-black.png"
import './standardFooter.css';

const StandardFooter = () => {
    return(
        <header className="footer-bottom">
            <img
                src = {ecsuLogoBlack}
                alt="Eastern Connecticut State University"
                className="ecsu-logo-standard"
            />
        </header>
    );
};
export default StandardFooter;