from . import  main_bp

# route to the homepage
@main_bp.route('/')
def index() :
    s = '''
    <h1> Course Planning Tool Homepage</h1>
    <ul>
    <li> <a href = '/api/test_login/?user=annie&password=password'>Test Login</a> </li>
    <li> <a href = '/api/logout/'>Logout</a> </li>
    <li> <a href = '/api/hello/'>Hello</a> </li>
    <li> <a href = '/profile/'>Profile</a> </li>
    <li> <a href = '/valid_inputs/'>Valid Inputs </a> </li>
    <li> <a href = '/admin/'>admin </a> </li>
    </ul>
    '''
    return s

