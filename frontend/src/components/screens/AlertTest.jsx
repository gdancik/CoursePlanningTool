import React from "react";
import Alert from "../SyllabusComponents/Alert";

export default function AlertTest() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Alert Component Test</h2>
      <Alert text="The ELAC curriculum has five already-articulated learning competencies in Communication, Creativity, Critical Thinking, Ethical Reasoning, Quantitative Literacy (they are articulated below and can be found in SB 19-20_07. At least TWO of these competencies must be included in your ELAC Seminar or Disciplinary Perspectives Course Syllabus. You should convert these competencies into no more than 5-10 course level learning outcomes using the following guidance. You will want to consult the rubrics which are included in SB 19-20_07." />
      <Alert text="This is another example of the Alert component with a different message." />
    </div>
  );
}
