# -*- coding: utf-8 -*-
from flask import Flask, request, redirect, url_for, render_template, session , jsonify, send_from_directory
import getopt
import importlib
import os
import sys
import traceback
import quote
from selenium import webdriver
import requests

# Import settings module
if __name__ == "__main__":
    if not os.environ.get('FLASK_SETTINGS_MODULE', ''):
        os.environ['FLASK_SETTINGS_MODULE'] = 'core.settings.loc'

settings_module = os.environ.get('FLASK_SETTINGS_MODULE')

try:
    importlib.import_module(settings_module)
except ImportError, e:
    raise ImportError(
        "Could not import settings '%s' (Is it on sys.path?): %s" \
        % (settings_module, e))

app = Flask(__name__)
#app.config.from_envvar('FLASK_CONFIG_MODULE')

settings = sys.modules[settings_module]


@app.context_processor
def inject_static_url():
    """
    Inject the variable 'static_url'/STATIC_URL into the templates. 
    Grab it from the environment variable STATIC_URL, or use the 
    default.  Template variable will always have a trailing slash.
    """
    static_url = settings.STATIC_URL or app.static_url_path
    if not static_url.endswith('/'):
        static_url += '/'    
    return dict(static_url=static_url, STATIC_URL=static_url)


#To test the Backend Algorithm.
@app.route("/test_backend")
def test_backend():
    return render_template('test_backend.html')

#Screenshot test case
@app.route("/screen_shot",methods=['POST'])
def screen_shot():
    a = request.args.get('a','')
    br = webdriver.PhantomJS(service_args=['--cookies-file=/tmp/ph_cook.txt'])
    br.set_window_size(800, 800)
    br.get("www.google.com")
    br.save_screenshot('screenshot.png')
    br.quit

    return "Screen shot saved"

#Ajax call after entering the URL 
@app.route('/getResults',methods=['GET'])
def getResults():
    a = request.args.get('a', '')
    
    #Calling scrape.py for quote and Image
    #print 'before parse'
    quotes_array,image, extras, title= quote.parse(a)
    q, i= formatArrays(quotes_array,image, extras, True)
    # more_stuff for prototyping purposes
    j = jsonify(quote=q,image=i, headline=title)

    # return jsonify(image=image,quote=quote)
    j.headers['Access-Control-Allow-Origin'] = '*'
    j.headers['Access-Control-Allow-Methods'] = 'GET'
   
    return j

# assume any other requests are for static content.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def fallback(path):
    if path == '': path = 'index.html'
    return send_from_directory('static',path)

# mock stuff for prototype
import random

# FAKE_QUOTES = [
#     "Soon enough. We can't compete with Mom! Her company is big and evil! Ours is small and neutral! I daresay that Fry has discovered the smelliest object in the known universe! Who am I making this out to?",
#     "Ah, now we see the violence inherent in the system! On second thoughts, let's not go there. It is a silly place. …Are you suggesting that coconuts migrate?",
#     "And the hat. She's a witch! We found them. Where'd you get the coconuts? Why do you think that she is a witch? Why do you think that she is a witch?",
#     "Not tricks, Michael, illusions. I don't criticize you! And if you're worried about criticism, sometimes a diet is the best defense. I don't criticize you! And if you're worried about criticism, sometimes a diet is the best defense. There's so many poorly chosen words in that sentence.",
#     "Hey, Luke! May the Force be with you. You're all clear, kid. Let's blow this thing and go home! But with the blast shield down, I can't even see! How am I supposed to fight?",
#     "The plans you refer to will soon be back in our hands. You're all clear, kid. Let's blow this thing and go home! I don't know what you're talking about. I am a member of the Imperial Senate on a diplomatic mission to Alderaan--",
#     "Oh, so they have Internet on computers now! I can't go to juvie. They use guys like me as currency. Fire can be our friend; whether it's toasting marshmallows or raining down on Charlie.",
#     "How is education supposed to make me feel smarter? Besides, every time I learn something new, it pushes some old stuff out of my brain. Remember when I took that home winemaking course, and I forgot how to drive?",
#     "Marge, you being a cop makes you the man! Which makes me the woman — and I have no interest in that, besides occasionally wearing the underwear, which as we discussed, is strictly a comfort thing. D'oh. I can't go to juvie. They use guys like me as currency.",
# ]

FAKE_IMAGES = [
    'http://lorempixel.com/640/480',
    'http://baconmockup.com/640/480',
    'http://loremflickr.com/640/480',
    'http://lorempixel.com/320/480',
    'http://lorempixel.com/500/500',
    'http://lorempixel.com/g/500/500',
    'http://loremflickr.com/500/500',
    'http://lorempixel.com/g/640/480',
    'http://baconmockup.com/300/425',
    'http://lorempixel.com/100/540',
    'http://lorempixel.com/200/353',
]

def more_stuff(item,more_items,target_len=None):
    if not item: # sometimes there will be no image or no quote...
        return []
    l = [item]
    if target_len is None:
        target_len = random.randint(1,max(len(more_items),6))
    while len(l) < target_len and more_items:
        
        extra = random.choice(more_items)
        
        l.append(extra)
    
    return l
def formatArrays(text, best, others, final):
    if final:
        t=text[:2]
        t=[t[0],t[0],t[1],t[1]]
        i=[best]
        for j in range(3):
            if others:
                i.append(random.choice(others))
            else:
                i.append(best)
        return t, i
    else:
        i=[best]
        for j in range(len(text)-1):
            if others:
                i.append(random.choice(others))
            else:
                i.append(best)
        return text, i

if __name__ == '__main__':
    class Usage(Exception):
        def __init__(self, msg):
            self.msg = msg
            
    opt_port = 5000

    try:        
        try:
            opts, args = getopt.getopt(sys.argv[1:], "p:", ["port="])
        except getopt.error, msg:
            raise Usage(msg)

        for option, value in opts:
            if option in ("-p", "--port"):
                opt_port = int(value)
    except Usage, err:
        print >>sys.stderr, err.msg
        sys.exit(1)
        
    app.run(host='0.0.0.0', port=opt_port, debug=True)
