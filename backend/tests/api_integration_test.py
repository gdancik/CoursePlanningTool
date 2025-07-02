import requests

session = requests.Session()

# Step 1: Login
login_response = session.get("https://gdancik.pythonanywhere.com/api/test_login/?user=annie&password=password")
print("Login Response:", login_response.json())


# Step 2: Get all courses
get_response = session.post("https://gdancik.pythonanywhere.com/api/getSheet/")
print("Course List:", get_response.json())

# Step 2: Get all courses
get_response = session.post("https://gdancik.pythonanywhere.com/api/shareSheet/",json={"email": "christowindow@gmail.com"})
print("Course List:", get_response.json())
