import React from 'react';
import ecsuLogoWhite from '../assets/images/ecsu-logo-white.png';
import './standardHeader.css';

const standardHeader = () => {
    return(
        <header className="header-top">
            <img
                src = {ecsuLogoWhite}
                alt="Eastern Connecticut State University"
                className="ecsu-logo-standard"
            />
        </header>
    );
};
export default standardHeader;