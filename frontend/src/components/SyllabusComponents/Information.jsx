import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

function Information({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#d4edda",
        border: "2px solid #28a745",
        borderRadius: "50px",
        padding: "12px 24px 12px 16px",
        margin: "1rem 0",
        fontSize: "16px",
        fontWeight: "400",
        color: "#155724",
        lineHeight: "1.4",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Exclamation Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          border: "2px solid #28a745",
          marginRight: "12px",
          flexShrink: 0,
        }}
      >
        <FaExclamationCircle 
          style={{ 
            color: "#dc3545", 
            fontSize: "18px" 
          }}
        />
      </div>
      
      {/* Text content */}
      <span style={{ flex: 1 }}>
        {text}
      </span>
    </div>
  );
}

export default Information;