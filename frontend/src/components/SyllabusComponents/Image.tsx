import React from 'react';

type ImageProps = {
    type : string;
    value: string;
    alt?: string;
    className?: string;
}

function Image({value, alt = '', className = ''}:ImageProps) {
    if (!value) return null;

    return(
        <img
            src={value}
            alt={alt}
            className={className}
            loading = 'lazy'
        />
    );
}
export default Image;