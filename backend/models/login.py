from flask_login import LoginManager, UserMixin

###############################################
# login manager
###############################################

login_manager = LoginManager()

''' Classes and functions to handle login '''
class User(UserMixin):
    def __init__(self, id):
      self.id = id

@login_manager.user_loader
def load_user(user_id):   
    return User(user_id)