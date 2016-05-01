"""
WSGI config for piquote
"""
import os
import sys
import site

site.addsitedir('/home/apps/env/piquote/lib/python2.7/site-packages')
sys.path.append('/home/apps/sites/piquote')
sys.stdout = sys.stderr

os.environ.setdefault('FLASK_SETTINGS_MODULE', 'core.settings.stg')

from api import app as application
