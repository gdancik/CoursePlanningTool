import React from "react";

function InformationB({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#d2f4e1",
        border: "4px solid #2ecc71",
        borderRadius: "999px",
        padding: "0.5rem 1.5rem 0.5rem 1rem",
        color: "#222",
        fontSize: "1.25rem",
        fontWeight: 500,
        gap: "1rem",
        margin: "1rem 0"
      }}
    >
      <span style={{
        color: "#c30052",
        fontSize: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        height: "2.5rem",
        background: "#fff",
        borderRadius: "50%",
        border: "4px solid #2ecc71",
        marginRight: "0.75rem"
      }}>
        <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      </span>
      <span>{text}</span>
    </div>
  );
}

export default InformationB;
