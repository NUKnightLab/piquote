### Developer info

**Getting started**

Clone this repository

Create a virtual environment

Activate virtual environment

Install project requirements

`pip install -r requirements.txt`

Run local Flask development server

`python api.py`

**Code organization**

api.py
* Flask application file

conf
* staging and production server configs

core
* settings files for local, staging and production environments
* settings are imported into api.py

static
* all static media goes here, e.g. css, js, images, etc

templates
* Flask templates directory




