import React, {useEffect, useState} from "react";
import './ParagraphFromFile.css';

/**
 * @function ParagraphFromFile
 * @description A paragraph with text from file in /public/
 * @param {ParagraphFromFileProps} props - the file with the text
 * @returns {JSX.Element} A paragraph with the specified text
 * @example
 * <ParagraphFromFile file="/data/file.txt">
 */

/**
 * @typedef {Object} ParagraphFromFileProps 
 * @property {string} file
 */

interface ParagraphFromFileProps {
  file: string;
  className?: string 
}

const ParagraphFromFile: React.FC <ParagraphFromFileProps> = ({ file, className }) => {
  
  const [fileText, setFileText] = useState(''); // initialize state

  useEffect(() => {
    fetch(file) 
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contentType = response.headers.get('content-type');
        if (contentType != null && contentType.includes('html')) {
          alert('Error parsing JSON: file not found: ' + file);
          throw new Error ('File not found');        
        }        
        return response.text();
      })
      .then((data) => setFileText(data))
      .catch((err) => console.error(err));
  }, []);

  return <p className = {className || undefined} style = {{marginBottom: "1rem"}}>{fileText}</p>

}

export default ParagraphFromFile;