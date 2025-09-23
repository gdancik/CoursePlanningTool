import React from "react";
import InformationB from "../SyllabusComponents/InformationB";

export default function InformationTest() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Information Component Test</h2>
      <InformationB text="Information entered on this page will appear in the final syllabus exactly as written." />
      <InformationB text="This is another example of the Information component with a different message." />
    </div>
  );
}
