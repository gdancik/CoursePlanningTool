import React from 'react';

type ImageProps = {
    type : string;
    value: string;
    alt?: string;
    className?: string;
}
//Image Icon Helper Function
export const getImageSource = (icon: string) => {
    if (icon.startsWith("/") || icon.startsWith("http")) {
        return icon;
    }
    return `/${icon}`
}

function Image({value, alt = '', className = ''}:ImageProps) {
    if (!value) return null;

    return(
        <img
            src={getImageSource(value)}
            alt={alt}
            className={className}
            loading = 'lazy'
        />
    );
}
export default Image;