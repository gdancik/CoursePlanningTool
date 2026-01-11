import React from 'react';
import ecsuLogoWhite from '../../assets/images/ecsu-logo-white.png';
import './HeaderBanner.css';

const SyllabusHeader = ( {courseNumber} : {courseNumber?:string}) => {
    return (
        <header className="header-banner">
            <img
                src={ecsuLogoWhite}
                alt="Eastern Connecticut State University"
                className="ecsu-logo"
            />
            <h1 className="header-title"> {courseNumber} </h1>
            <h1 className="header-title">COURSE PLANNING TOOL</h1>
        </header>
    );
};

export default SyllabusHeader;
