from backend.services.firestore_editor import fsEditor
from flask_login import current_user
from backend.config import Config
import logging
def get_fs_editor() :
    logging.debug(f'Config MAX_READS: {Config.MAX_READS}, MAX_WRITES: {Config.MAX_WRITES}, MAX_DELETES: {Config.MAX_DELETES}')
    return fsEditor(current_user.id,Config.MAX_READS, Config.MAX_WRITES, Config.MAX_DELETES)