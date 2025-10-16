import React, { useState } from "react";

/**
 * @function CheckboxGroup
 * @description A flexible checkbox group component with optional "Check All" functionality.
 * Used in the Syllabus Page Builder for selecting multiple options like meeting days, assessment types, etc.
 * Supports both horizontal and vertical layouts and includes smart "Check All" toggle behavior.
 * @param {string} [id="checkbox_group"] - Unique identifier for the checkbox group
 * @param {string} [label] - Optional label/title displayed above the checkbox group
 * @param {Array<string>} [data=["M", "T", "W", "R", "F"]] - Array of checkbox options. Include "Check All" in array to enable check all functionality
 * @param {boolean} [horizontal=true] - Layout direction. True for horizontal layout, false for vertical
 * @returns {JSX.Element} A group of checkboxes with optional "Check All" functionality and flexible layout
 * @example
 * // Horizontal layout with Check All and label
 * <CheckboxGroup 
 *   label="Meeting Days:"
 *   id="meeting_days"
 *   data={["Check All", "M", "T", "W", "R", "F"]}
 *   horizontal={true}
 * />
 * 
 * @example
 * // Vertical layout without Check All
 * <CheckboxGroup 
 *   label="Assessment Types:"
 *   id="assessment_types"
 *   data={["Quizzes", "Exams", "Projects", "Presentations"]}
 *   horizontal={false}
 * />
 */
function CheckboxGroup({
  id = "checkbox_group",
  label,
  data = ["M", "T", "W", "R", "F"],
  horizontal = true,
}) {
  // Exclude 'Check All' from initial checked state
  const items = data.filter((d) => d !== "Check All");
  const hasCheckAll = data.includes("Check All");
  const [checked, setChecked] = useState([]);

  const handleChange = (value) => {
    if (value === "Check All") {
      if (checked.length === items.length) {
        setChecked([]);
      } else {
        setChecked(items);
      }
    } else {
      if (checked.includes(value)) {
        setChecked(checked.filter((v) => v !== value));
      } else {
        setChecked([...checked, value]);
      }
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontWeight: "600",
            color: "#28a745",
            marginBottom: "0.5rem",
            fontSize: "1rem",
          }}
        >
          {label}
        </label>
      )}
      <div
        id={id}
        role="group"
        aria-label={label || "Checkbox group"}
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          gap: "0.5rem",
          flexWrap: horizontal ? "wrap" : "nowrap",
        }}
      >
      {data.map((d) => (
        <label
          key={d}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            padding: "0.25rem",
            fontSize: "1rem",
            fontWeight: d === "Check All" ? "600" : "400",
            color: d === "Check All" ? "#007acc" : "#333",
          }}
        >
          <input
            type="checkbox"
            value={d}
            checked={
              d === "Check All"
                ? checked.length === items.length
                : checked.includes(d)
            }
            onChange={() => handleChange(d)}
            style={{
              transform: "scale(1.2)",
              marginRight: "0.25rem",
            }}
          />
          {d}
        </label>
      ))}
      </div>
    </div>
  );
}

export default CheckboxGroup;