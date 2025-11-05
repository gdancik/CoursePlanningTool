import React from "react";

export interface CheckboxGroupProps {
  id?: string;
  data?: string[];
  horizontal?: boolean;
  value: string[];           
  label?: string;       
  onChange: (vals: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id = "checkbox_group",
  data = [],
  horizontal = true,
  label,
  value = [],
  onChange = () => {},
}) => {
  const items = data.filter((d) => d !== "Check All");

  const handleChange = (val: string) => {
    if (val === "Check All") {
      if (value.length === items.length) {
        onChange([]);
      } else {
        onChange(items);
      }
    } else {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
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
      {label && <span style ={{fontWeight: "bold"}}>{label}</span>}
      {data.map((d) => (
        <label key={d}>
          <input
            type="checkbox"
            value={d}
            checked={
              d === "Check All"
                ? value.length === items.length
                : value.includes(d)
            }
            onChange={() => handleChange(d)}
          />
          {d}
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
