import requests

# Create a session to maintain cookies
session = requests.Session()

print("🔐 Step 1: Authenticating with test login...")
# First, authenticate using test login
login_url = "http://localhost:5000/api/test_login/?user=testuser&password=password"
try:
    login_response = session.get(login_url)
    print(f"Login Status Code: {login_response.status_code}")
    print(f"Login Response: {login_response.text}")
    
    if login_response.status_code == 200:
        print("✅ Authentication successful!")
        
        print("\n📋 Step 2: Testing getSheet endpoint...")
        # Now test the getSheet endpoint with authenticated session
        url = "http://localhost:5000/api/getSheet/"
        headers = {"Content-Type": "application/json"}
        data = {}
        
        response = session.post(url, headers=headers, json=data)
        print(f"getSheet Status Code: {response.status_code}")
        print(f"getSheet Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ getSheet API is working!")
            try:
                json_response = response.json()
                if isinstance(json_response, dict):
                    print(f"📊 Number of courses found: {len(json_response)}")
                    if json_response:
                        print(f"🔑 Course IDs: {list(json_response.keys())}")
                        # Show first course data structure
                        first_key = list(json_response.keys())[0]
                        print(f"📝 Sample course data structure: {list(json_response[first_key].keys())}")
                    else:
                        print("📋 No courses found (empty data - normal for new user)")
                else:
                    print(f"Response type: {type(json_response)}")
            except Exception as e:
                print(f"JSON parsing error: {e}")
        else:
            print("❌ getSheet API call failed")
    else:
        print("❌ Authentication failed")
        
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to Flask server")
except Exception as e:
    print(f"❌ Error: {e}")