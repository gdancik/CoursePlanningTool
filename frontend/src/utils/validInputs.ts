// src/utils/validInputs.ts

// FRONTEND → BACKEND
export const validInputs: Record<string, string> = {
    "Subject Code": "subj_code_syllabus",
    "Course Number": "crse_number_syllabus",
    "Course Title": "course_title_syllabus",
    "Meeting Time": "times1_syllabus",
    "Meeting Days": "days1_syllabus",
    "Additional Meeting Time": "times2_syllabus",
    "Additional Meeting Days": "days2_syllabus",
    "Classroom Location": "location1_syllabus",
    "Semester": "term_syllabus",
    "Year": "year_syllabus",
    "Instructor Name": "instructor_name_syllabus",
    "Instructor Title": "instructor_title_syllabus",
    "Email": "email_syllabus",
    "Office Location": "office_location_syllabus",
    "Phone (optional)": "phone_syllabus",
    "Office Hours": "office_hours_syllabus",
    "Additional Information (optional)": "additional_contact_info_syllabus",
};

// BACKEND → FRONTEND
export const reverseFieldMappings: Record<string, string> = Object.fromEntries(
    Object.entries(validInputs).map(([front, back]) => [back, front])
);
