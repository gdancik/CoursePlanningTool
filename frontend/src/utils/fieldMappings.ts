//This file holds all mappings for backend definitions to be sent via JSON and process user information

export const fieldMappings: Record<string, string> = {
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