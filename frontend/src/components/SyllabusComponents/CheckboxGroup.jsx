import React, { useState } from "react";

function CheckboxGroup({
  id = "checkbox_group",
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
    <div
      id={id}
      role="group"
      aria-label="Checkbox group"
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
  );
}

export default CheckboxGroup;