import React from "react";

function AlertB({ text }) {
  return (
    <div
      style={{
        position: "relative",
        background: "#fcf6e3",
        border: "4px solid #e6b800",
        borderRadius: 0,
        boxShadow: "6px 6px 0 0 #e6b800, 0 2px 8px 0 rgba(0,0,0,0.10)",
        padding: "1.5rem 2rem 1.5rem 4.5rem",
        color: "#222",
        fontSize: "1.25rem",
        fontWeight: 500,
        margin: "2rem 0 1rem 0",
        maxWidth: 1200,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "1.25rem",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.5rem",
          height: "2.5rem",
          background: "#fff",
          clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
          border: "4px solid #e6b800",
          boxSizing: "border-box",
        }}
      >
        <i className="fa-solid fa-circle-exclamation" style={{ color: "#c30052", fontSize: "1.5rem" }} aria-hidden="true"></i>
      </span>
      <span>{text}</span>
    </div>
  );
}

export default AlertB;
