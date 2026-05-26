class Config:
    DEBUG = True
    #LOGGING can be DEBUG, INFO, WARN, ERROR, CRITICAL and NONE
    LOGGING = 'ERROR'

    #Fire store access limits, can be set to an positive integer or None for unlimted.
    MAX_READS = None 
    MAX_WRITES = None
    MAX_DELETES = None

    #Admin users can view all e-mails on the admin page (otherwise these are filtered out)
    admin_users = ['annie', 'garrett.dancik@gmail.com']

