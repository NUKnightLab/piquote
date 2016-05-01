"""
Local settings and globals.
"""
import sys
import os
from .base import *

# Import secrets
# secrets_path = os.path.normpath(os.path.join(PROJECT_ROOT, '../secrets/snapmap/loc'))
# sys.path.append(secrets_path)
# from secrets import *

STATIC_URL = '/static/'

# Flask configuration
#os.environ['FLASK_CONFIG_MODULE'] = os.path.join(secrets_path, 'flask_config.py')
