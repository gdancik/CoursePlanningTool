import React from "react";
import CheckboxGroup from "../SyllabusComponents/CheckboxGroup";

export default function CheckboxGroupTest() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Horizontal Checkbox Group</h2>
      <CheckboxGroup
        id="meeting_days_checkboxes"
        data={["Check All", "M", "T", "W", "R", "F"]}
        horizontal={true}
      />
      <h2 style={{ marginTop: 32 }}>Vertical Checkbox Group</h2>
      <CheckboxGroup
        id="vertical_days_checkboxes"
        data={[ "M", "T", "W", "R", "F"]}
        horizontal={false}
      />
    </div>
  );
}
