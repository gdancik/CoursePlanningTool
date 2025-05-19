from flask import Flask, render_template, request, send_file, session, jsonify
from docx import Document
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

import io
import random

''' Create app and login manager '''

app = Flask(__name__)
app.secret_key = "my secret key"

login_manager = LoginManager()
login_manager.init_app(app)

''' Classes and functions to handle login '''

class User(UserMixin):
    def __init__(self, id, name):
      self.id = id
      self.name = name

@login_manager.user_loader
def load_user(user_id):
    # need to look up user based on user_id
    return User('testUser', 'testUser')

@app.route('/login/')
def login() :
    # need to check credentials
    user = User('testUser', 'testUser')
    login_user(user)
    return 'Login successful, now you can access <a href = "/api/hello/">/api/hello/</a>' 

@app.route('/logout/')
def logout():
    logout_user()
    session.clear()
    return 'User is logged out, now you cannot access <a href = "/api/hello/">/api/hello/</a>' 

@app.route('/profile/')
def profile():
   if current_user.is_authenticated :
      return f'<p>ID: {current_user.id}</p><p>Name: {current_user.name}</p>'
   return '<p>You are currently not logged in. To log in, go to <a href = "/login/">/login/</a>'

# route to the homepage
@app.route('/')
def index() :
    return '<h1> Course Planning Tool Homepage</h1>'

''' 
The 'session' object allows you to store information specific to a user. We
may be able to accomplish the same thing using flask_login and current_user
''' 

@app.route('/get_session_number/')
def get_session_number():
    session['number'] = random.randint(0,100)
    return 'A random number has been assigned; go to /show_session_number/ to view'

@app.route('/show_session_number/')
def test():
    number = session.get('number', None) 
    if number :
      return f'The number is : {number}'

    return 'To get a number, go to /get_session_number/'


''' 
API calls should return a jsonified message.
The 'hello' endpoint requires a login, while the 'hi' one does not
'''

@app.route('/api/hello/')
@login_required
def hello():
    return jsonify(message="Hello there from Flask!")
    #if current_user :
    #  return {'message': current_user.id}
    #return 'no current user!'

@app.route('/api/hi/')
def hi():
    return jsonify(message="Hi there from Flask!")


''' Generate a word document! '''
@app.route('/generate/', methods=['GET', 'POST'])
def generate():

    if request.method == 'POST':
        name = request.form.get('name')
        message = request.form.get('message')

        # Create Word document in memory
        doc = Document()
        doc.add_heading(f"Message from {name}", 0)
        doc.add_paragraph(message)

        # Save to a BytesIO stream
        file_stream = io.BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)

        return send_file(
            file_stream,
            as_attachment=True,
            download_name=f"{name}_message.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    return render_template('form.html')


if __name__ == '__main__':
    app.run(debug=True)

