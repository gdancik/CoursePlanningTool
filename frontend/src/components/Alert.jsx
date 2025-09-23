import React from "react";

function Alert({ text }) {
  return (
    <div
      style={{
        position: "relative",
        margin: "1rem 0",
        maxWidth: "100%",
      }}
    >
      {/* Stack of cards effect - background cards */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          right: "-8px",
          bottom: "-8px",
          background: "#b8860b",
          borderRadius: "4px",
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
          background: "#daa520",
          borderRadius: "4px",
          zIndex: 2,
        }}
      />
      
      {/* Main card */}
      <div
        style={{
          position: "relative",
          background: "#fff8dc",
          border: "3px solid #daa520",
          borderRadius: "4px",
          padding: "16px 20px 16px 70px",
          color: "#333",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "1.4",
          display: "flex",
          alignItems: "flex-start",
          minHeight: "60px",
          zIndex: 3,
        }}
      >
        {/* Octagon with exclamation mark */}
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "16px",
            width: "40px",
            height: "40px",
            background: "#dc143c",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
            }}
          >
            !
          </span>
        </div>
        
        {/* Text content */}
        <span style={{ 
          display: "block",
          paddingTop: "2px"
        }}>
          {text}
        </span>
      </div>
    </div>
  );
}

export default Alert;