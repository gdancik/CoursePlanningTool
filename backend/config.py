class Config:
    DEBUG = True
    #LOGGING can be DEBUG, INFO, WARN, ERROR, CRITICAL and NONE
    LOGGING = 'DEBUG'

    #Fire store access limits, can be set to an positive integer or None for unlimted.
    MAX_READS = 500
    MAX_WRITES = 500
    MAX_DELETES = 500