import React from "react";

export interface CheckboxGroupProps {
  id?: string;
  data?: string[];
  horizontal?: boolean;
  value: string[];
  label?: string;
  className?: string;
  onChange: (vals: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id = "checkbox_group",
  data = [],
  horizontal = true,
  label,
  value = [],
  className = "",
  onChange,
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
    <div id={`${id}_wrapper`} className="flex flex-col gap-2">
      {label && (
        <span className="font-bold mb-1">{label}</span>
      )}

      <div
        id={id}
        role="group"
        aria-label="Checkbox group"
        className={`flex ${horizontal ? "flex-row flex-wrap" : "flex-col"} gap-4`}
      >
        {data.map((d) => (
          <label key={d} className="flex items-center gap-2 mx-2 my-1 cursor-pointer">
            <input
              type="checkbox"
              value={d}
              checked={
                d === "Check All"
                  ? value.length === items.length
                  : value.includes(d)
              }
              onChange={() => handleChange(d)}
              className={`w-5 h-5 border-2 rounded-sm focus:ring-2 ${className}`}
            />
            <span className="text-gray-800 font-medium">{d}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
