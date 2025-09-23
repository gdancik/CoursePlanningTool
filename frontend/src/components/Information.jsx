import React from "react";

function Information({ text }) {
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
          background: "#228b22",
          borderRadius: "25px",
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
          background: "#32cd32",
          borderRadius: "25px",
          zIndex: 2,
        }}
      />
      
      {/* Main card */}
      <div
        style={{
          position: "relative",
          background: "#f0fff0",
          border: "3px solid #32cd32",
          borderRadius: "25px",
          padding: "16px 20px 16px 70px",
          color: "#333",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "1.4",
          display: "flex",
          alignItems: "center",
          minHeight: "50px",
          zIndex: 3,
        }}
      >
        {/* Circular icon with exclamation mark */}
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            background: "#dc143c",
            borderRadius: "50%",
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
        }}>
          {text}
        </span>
      </div>
    </div>
  );
}

export default Information;