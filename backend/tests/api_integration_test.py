import requests

session = requests.Session()

# Step 1: Login
login_response = session.get("https://gdancik.pythonanywhere.com/api/test_login/?user=annie&password=password")
print("Login Response:", login_response.json())


# Step 2: Get all courses
get_response = session.post("https://gdancik.pythonanywhere.com/api/getSheet/")
print("Course List:", get_response.json())

json = {'dict_of_columns_and_vals' :

            {'term_syllabus': 'Fall',

             'year_syllabus': '2025',

             'subj_code_syllabus': 'ART',

             'crse_number_syllabus': '100'}

        }



response = session.post('https://gdancik.pythonanywhere.com/api/createNewCourse/', json = json)

print(response.text)

