import requests

session = requests.Session()

# Step 1: Login
login_response = session.get("https://gdancik.pythonanywhere.com/api/test_login/?user=annie&password=password")
print("Login Response:", login_response.json())

# Step 2: Create a new course
new_course_data = {
    "dict_of_columns_and_vals": {
        "subj_code_syllabus": "CSC",
        "course_number_syllabus": "335",
        "term_syllabus": "Spring",
        "year_syllabus": "2026"
    }
}
create_response = session.post(
    "https://gdancik.pythonanywhere.com/api/createNewCourse/",
    json=new_course_data
)
print("Create Course Response:", create_response.json())

# Step 3: Get all courses
get_response = session.post("https://gdancik.pythonanywhere.com/api/getSheet/")
print("Course List:", get_response.json())
