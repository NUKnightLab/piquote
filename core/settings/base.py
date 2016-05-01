"""
Base settings and globals.
"""
from os.path import abspath, dirname

CORE_ROOT = dirname(dirname(abspath(__file__)))

PROJECT_ROOT = dirname(CORE_ROOT)

DATABASES = {}

