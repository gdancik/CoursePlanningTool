import React, { useState } from "react";

function CheckboxGroup({
  id = "meeting_days_checkboxes",
  data = ["M", "T", "W", "R", "F"],
  horizontal = false,
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
      aria-label="Meeting days"
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        gap: "0.5rem",
      }}
    >
      {data.map((d) => (
        <label
          key={d}
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <input
            type="checkbox"
            value={d}
            checked={
              d === "Check All"
                ? checked.length === items.length && items.length > 0
                : checked.includes(d)
            }
            onChange={() => handleChange(d)}
          />
          {d}
        </label>
      ))}
    </div>
  );
}

export default CheckboxGroup;
