import json
from bs4 import BeautifulSoup
import requests
import re
import sys
from nltk import sent_tokenize
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktParameters
import pprint

import dimensions
import repository

pp = pprint.PrettyPrinter(indent=4)

caps = "([A-Z])"
prefixes = "(Mr|St|Mrs|Ms|Dr)[.]"
suffixes = "(Inc|Ltd|Jr|Sr|Co)"
starters = "(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)"
acronyms = "([A-Z][.][A-Z][.](?:[A-Z][.])?)"
websites = "[.](com|net|org|io|gov)"

def parse(url):
    print url
    r  = requests.get(url)
    data = r.text
    soup = BeautifulSoup(data,from_encoding='utf8')

    quotes_array = parse_quotes(soup)
    image = parse_og_image(soup)
    alternate_image_array = parse_alternates(url, soup)
    title = parse_title(soup)

    return quotes_array, image, alternate_image_array, title

def parse_quotes(soup):
    allSen = []

    for paragraph in soup.find_all('p'):
        text = paragraph.get_text()
        text = " " + text + "  "
        text = text.replace("\n"," ")
        text = re.sub(prefixes,"\\1<prd>",text)
        text = re.sub(websites,"<prd>\\1",text)
        if "Ph.D" in text: text = text.replace("Ph.D.","Ph<prd>D<prd>")
        text = re.sub("\s" + caps + "[.] "," \\1<prd> ",text)
        text = re.sub(acronyms+" "+starters,"\\1<stop> \\2",text)
        text = re.sub(caps + "[.]" + caps + "[.]" + caps + "[.]","\\1<prd>\\2<prd>\\3<prd>",text)
        text = re.sub(caps + "[.]" + caps + "[.]","\\1<prd>\\2<prd>",text)
        text = re.sub(" "+suffixes+"[.] "+starters," \\1<stop> \\2",text)
        text = re.sub(" "+suffixes+"[.]"," \\1<prd>",text)
        text = re.sub(" " + caps + "[.]"," \\1<prd>",text)
        if "\"" in text: text = text.replace(".\"","\".")
        if "!" in text: text = text.replace("!\"","\"!")
        if "?" in text: text = text.replace("?\"","\"?")
        text = text.replace(".",".<stop>")
        text = text.replace("?","?<stop>")
        text = text.replace("!","!<stop>")
        text = text.replace("<prd>",".")
        sentences = text.split("<stop>")
        sentences = sentences[:-1]
        sentences = [s.strip() for s in sentences]
        sentence = u" ".join(sentences)
        allSen.append(sentence)
    allSen.sort(key = lambda sentence:score(sentence), reverse=True)
    return allSen

def parse_og_image(soup):
    #this returns og image in privilaged spot
    img2= soup.find_all('meta')                                
    for i in img2:
        prop=i.get('property')
        if prop=="og:image":
            return i.get('content')
    return None

def multiSplit(string):
    if not string:
        return []
    seperated= string.replace('/',' ').replace('.', ' ').replace('_', ' ').replace('&', ' ').split()
    return seperated

def parse_alternates(url, soup):
    origin=multiSplit(url)

    if 'com' in origin: #find the hostname of the website
        source= origin[origin.index('com')-1]

    
    images= []
    # old image finding code, to be updated

    
    stri=""
    img= soup.find_all('img')
    for i in img:
        stri=i.get('src')
        #print(str)
        
        pieces= multiSplit(stri)
        #if source in pieces and 'logo' not in pieces and 'png' not in pieces and 'gif' not in pieces and stri != None:
        if 'logo' not in pieces and 'png' not in pieces and 'gif' not in pieces and stri != None and stri[:3] == 'htt': #filter by source string
            #pp.pprint(stri)
            fileSize, dims=getsizes(stri)
            if dims==None:
                continue
            width, height= dims
            #w, h =jpeg_res(stri)
            if width>200 and height>200: # filter by image size
                good=True
                for p in i.parents: # filtering by the parents of the image
                    i = str(p.get('id'))
                    c= str(p.get('class'))
                    d= str(p.get('data-content-kicker'))
                    if 'related' in i:
                        good=False
                        break
                    elif 'wide-thumb' in c:
                        good= False
                        break
                    elif 'google_' in i:
                        good= False
                        break
                    elif 'moat_trackable' in c:
                        good= False
                        break
                    elif 'Related' in d:
                        good= False
                        break
                    elif 'extra' in c:
                        good= False
                        break
                if good:
                    images.append(stri)
    return images

def parse_title(soup):
    heads = soup.find_all('h1')
    head = ''

    if heads!=[]:
        for h in heads:
            #print h;
            if "logo" not in str(h.get('class')):
                head = h.get_text()
                break
    return head

def score(sentence):
    score=0
    sentence = sentence.lower()
    split = sentence.split()
    for word in split:
        if word in repository.emotive:
            score+=2
        if word in repository.personal:
            score+=3
    for word in repository.proper:
        if word in split:
            score+=1
    for word in repository.phrase:
        if word in split:
            score+=1
    score+= sentence.count('\"')
    score+= sentence.count(u"\u201C")
    score+= sentence.count(u"\u201D")

    return score

def trim(sentences, max, min):
    tempQuotes = []
    if len(sentences)>0:
        for quote in sentences:
            length = len(quote);
            if length >min and length <max:
                tempQuotes.append(quote)

    return tempQuotes

import urllib
from PIL import ImageFile

def getsizes(uri):
    # get file size *and* image size (None if not known)

    file = urllib.urlopen(uri)
    size = file.headers.get("content-length")
    if size: size = int(size)
    p = ImageFile.Parser()
    while 1:
        data = file.read(1024)
        if not data:
            break
        p.feed(data)
        if p.image:
            return size, p.image.size
            break
    file.close()
    return size, None

if __name__ == "__main__":
    l = parse('http://www.huffingtonpost.com/entry/ted-cruz-gold-standard-republican_us_571196bfe4b06f35cb6fbac6?cps=gravity_2425_-8385480002285021224')
    for i, x in enumerate(l):
        print i, x
#All text is in an image parse('http://luckypeach.com/how-to-overeat-professionally/')
#parse('http://www.huffingtonpost.com/entry/ted-cruz-gold-standard-republican_us_571196bfe4b06f35cb6fbac6?cps=gravity_2425_-8385480002285021224')

#parse('http://www.theblaze.com/stories/2016/04/12/trump-blasts-rnc-chairman-reince-priebus-should-be-ashamed-of-himself/')