
columns_detailed = {

  'basic_information' : [ 
        'course_id',
        'term_syllabus',
        'year_syllabus',
        'subj_code_syllabus',
        'crse_number_syllabus',
        'course_title_syllabus',
        'elac',
        'days1_syllabus',
        'times1_syllabus',
        'location1_syllabus',
        'days2_syllabus',
        'times2_syllabus',
        'location2_syllabus',
        'instructor_name_syllabus',
        'instructor_title_syllabus',    
        'form_of_address_syllabus',
        'email_syllabus',
        'office_location_syllabus',
        'phone_syllabus',
        'office_hours_syllabus',
        'instructor_additional_information'
    ],

    'description': [
        'desc_opportunities',
        'desc_hopes',
        'desc_important',
        'desc_envision',
        'desc_role',
        'desc_expectations1',
        'desc_expectations2',
        'desc_limitations',
        'course_description_syllabus'
    ],

    'learning_outcomes': [
        'lo_elac_competencies',
        'lo_which',
        'lo_how1',
        'lo_how2',
        'lo_how3',
        'lo_competencies_table1',
        'lo_competencies_table2',
        'learning_outcomes_syllabus'
    ],

    'high_impact_practices': [
        'hip_what',
        'hip_approach',
        'hip_other',
        'hip_teach',
        'hip_syllabus'
    ],

    'learning_resources': [
        'lr_materials',
        'lr_inequities',
        'lr_order',
        'course_materials_syllabus'
    ],

    'assessment': [
        'assmt_types',
        'assmt_order',
        'assmt_communicate',
        'assmt_feedback',
        'assmt_assignments_syllabus_json',
        'grade_table_syllabus_list',
        'grading_policies_syllabus_json'
    ],

    'course_schedule' : ['course_schedule_list'],

    'checklist': [
        'additional_sections_syllabus_json',
        'policy_statements',
        'university_resources'
    ],
    
    'metadata': ['created_at', 'last_edited']

}


columns = []
for key,values in columns_detailed.items() :
    columns += values
