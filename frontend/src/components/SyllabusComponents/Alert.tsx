import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import ParagraphFromFile from "../../components/SyllabusComponents/ParagraphFromFile";
import SafeIcon from "../../utils/ComponentWrapper";
/**
 * 
 * @function Alert
 * @description A yellow warning alert component with stacked paper effect and octagonal red icon.
 * Used in the Syllabus Page Builder to display important warnings or notifications to users.
 * Features a layered background design with multiple shadow layers for visual depth.
 * @param text - The warning message text to display in the alert
 * @param file - the file to read the text from (overwrites 'text')
 * @returns {JSX.Element} A styled alert component with yellow background, red octagonal icon, and stacked paper visual effect
 * @example
 * <Alert text="The ELAC requires that you implement at least two High Impact Practices into your course." />
 */

interface AlertProps {
  text?: string;
  file?: string;
}

function Alert({ text, file }: AlertProps) {
  return (
    <div
      style={{
        position: "relative",
        margin: "1rem 0",
        maxWidth: "100%",
      }}
    >
      {/* Stack of paper layers - back to front */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          right: "-8px",
          bottom: "-8px",
          background: "#fff3cd",
          border: "2px solid #ffc107",
          // borderRadius: "8px",
          opacity: "0.3",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          right: "-4px",
          bottom: "-4px",
          background: "#fff3cd",
          border: "2px solid #ffc107",
          // borderRadius: "8px",
          opacity: "0.6",
          zIndex: 2,
        }}
      />
      
      {/* Main content layer */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "#fff3cd",
          border: "2px solid #ffc107",
          // borderRadius: "8px",
          padding: "16px 20px 16px 16px",
          fontSize: "16px",
          fontWeight: "400",
          color: "#856404",
          lineHeight: "1.4",
          boxSizing: "border-box",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
          zIndex: 3,
        }}
      >
        {/* Octagonal Icon Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "#dc3545",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            marginRight: "16px",
            flexShrink: 0,
          }}
        >
          <SafeIcon Icon={FaExclamationCircle} style={{color: "#fff", fontSize: "20px"}} />
        </div>
        
        {/* Text content */}
        <span style={{ flex: 1 }}>
          {file ? <ParagraphFromFile file = {file}/> : <b>{text}</b>}                                
        </span>
      </div>
    </div>
  );
}

export default Alert;