from flask_login import LoginManager, UserMixin

###############################################
# login manager
###############################################

login_manager = LoginManager()

''' Classes and functions to handle login '''
class User(UserMixin):
    def __init__(self, id, name):
      self.id = id
      self.name = name

@login_manager.user_loader
def load_user(user_id):
    # need to look up user based on user_id
    return User(user_id, user_id)
