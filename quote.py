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
DictQuote={}
final_quote=""
final_image=""

punctuation = [".", "!", "?", ")", "]", "\"", "'", u"\u201D", u"\u201C"] 
prefixes = ['dr', 'vs', 'mr', 'mrs','ms' ,'prof', 'inc','jr','i.e']
"""
emotive= ['feel', 'chill', 'fire', 'burn', 'feel the fire']



s='feel the fire'
for word in emotive:
    if word in s:
        score +=1
"""
def parse(argv):

    found_text=0    
    
    text=""
    r  = requests.get(argv)
    data = r.text
    soup = BeautifulSoup(data,from_encoding='utf8')
    paras = soup.find_all('p')
    img= soup.find_all('img')
    img2= soup.find_all('meta')
                
    allQuotes=[]
    allSen = []
    merge=[]
    mergeComma=[]
    proper=[]
    for para in paras:
        text=para.get_text()
        web= para.find_all('webonly')
        if web:
            for w in web:
                s=w.string
                i=text.find(s)
                text1= text[:i]
                text2= text[i+len(s):]
                text=text1+text2
       
        text.encode('utf-8')

        sentences= []
        quotes= []

        
        properStart=0
        capC=0;

        lastBegin=0 #tracks where the last sentence began
        nextBegin=0 # tracks where the next sentence will begin, set when ending punctuation is found
        lastSpace=0
        inQuote= False
        quoteStart = 0
        lastCap=0 # last capitol symbol (ASCII only)
        spaceQ=0 # number of spaces in a quote

        wasQ= False # was there a quote in the last sentence (not if the qutoe ended it)
        hadQ=False  # did the last sentence have a quote
        mightMer=False #If the quote should be merged witht the previous one
        mergeC=False

        
            
        for i in range(len(text)):
            if i == nextBegin: # sets the start of a new sentence
                lastBegin=i
            c=text[i]
            if c in punctuation and c!="'":
                if capC>1:
                    proper.append(text[properStart:i])
                capC=0
            if c== " ": 
                lastSpace=i
                if inQuote:
                    spaceQ+=1
            elif c=="." and (text[lastSpace+1:i].lower() in prefixes or i-lastCap<4 or i-lastSpace<2): 
                # all the cases for when a period doesn't end a sentence
                do=0
                #continue
            elif c== "." or c=="!" or c=="?" or c==";": # end of a sentence
                j=i
                while j<len(text) and text[j] in punctuation:
                    j+=1
                s = text[lastBegin:j]
                sentences.append(s)
                nextBegin= j+1

                if capC>1:
                    proper.append(text[properStart:i])
                capC=0

                #print str(hadQ)+"-----"
                hadQ=False
                if wasQ:
                    hadQ=True
                wasQ=False
            elif c == "\"": # Ascii quote, toggles whether or not to be in a quote
                if inQuote:
                    q= text[quoteStart:i+1]
                    #print str(quoteStart)+ " - ascii end"
                    inQuote=False
                    if spaceQ>3:
                        if mightMer:
                            place=len(quotes)+len(allQuotes)
                            merge.append(place)
                            if mergeC:
                                mergeComma.append(place)
                        quotes.append(q)
                    spaceQ=0
                    if not (nextBegin>i):
                        wasQ=True
                    mightMer=False
                    mergeC= False
                else:
                    inQuote=True
                    quoteStart=i
                    #print str(quoteStart)+" - " +str(lastBegin)+"  //  "+ str(hadQ)
                    if quoteStart-lastBegin<2 and hadQ:
                        mightMer=True
                    elif wasQ:
                        mightMer=True
                        mergeC=True

            elif c==u'\u201c': #unicode quote begin
                inQuote=True
                quoteStart=i
                #print str(quoteStart)+" - " +str(lastBegin)+"  //  "+ str(hadQ)
                if quoteStart-lastBegin<2 and hadQ:
                    mightMer=True
                elif wasQ:
                    mightMer=True
                    mergeC=True
            elif c==u'\u201d': # unicode quote end
                q= text[quoteStart:i+1]
                    #print str(quoteStart)+ " - ascii end"
                inQuote=False
                if spaceQ>3: # quote has 4 or more words
                    if mightMer:
                        place=len(quotes)+len(allQuotes)
                        merge.append(place)
                        if mergeC:
                            mergeComma.append(place)

                    quotes.append(q)
                spaceQ=0
                if not (nextBegin>i):
                    wasQ=True
                mightMer=False
                mergeC=False
            elif ord(c)>64 and ord(c)<91: # CAPITOL LETTER
                lastCap = i
                if capC==0:
                    properStart=i
                capC+=1
            elif i-lastSpace<=1:
                if capC>1:
                    proper.append(text[properStart:i-1])
                capC=0
        #pp.pprint(quotes)
        if len(quotes)>=1:
            allQuotes+=quotes
        if len(sentences)>=1:
            allSen+=sentences
        #pp.pprint(sentences)
    #print merge

    for i in merge: #merge is a list of indecies where the qutoe at i must merge witht he one at i-1
        q1=allQuotes[i-1]
        q2=allQuotes[i]
        punc=q1[len(q1)-2]
        q1=q1[:len(q1)-2]

        if punc == "," and i not in mergeComma: #in the case "quote, " i said, "end of quote." / the comma shouldnt be replaced
            punc= "."
        qFin= q1 +punc+ " "+ q2[1:]
        allQuotes[i-1]=qFin
    mod=0
    for i in merge:
        allQuotes.pop(i+mod)
        mod-=1

    properU=[]
    for line in proper:
        if line not in properU:
            properU.append(line) # a list of unique proper names, unused for now


    tempQuotes= []
    for quote in allQuotes:
        ascii=ord(quote[1])
        if ascii>64 and ascii<91:
            tempQuotes.append(quote)
    allQuotes=tempQuotes
    
    """
    blockQuote= soup.find_all(attrs={ "class" : "pullquote" }) # pull block quotes -----NOT WORKING-----
    for line in blockQuote:
        allQuotes.push(line.get_text())
    """

    

    """"
    Errors with this algorithm:
    
    -If you use a while loop it will exit as soon as you find one quote that
        doesnt meet your criteria, and you wont check all quotes.
        Also I think you have the lengths backward; should be ...<180 and ... >80.

    
    if len(allQuotes)>0:
        while len(allQuotes[0])>180: #max quote size
            allQuotes=allQuotes[1:]
        allQuotes.reverse()
        while len(allQuotes[0])<80: # min quote size
            allQuotes=allQuotes[1:]
        allQuotes.reverse()"""


    numQuotes=6
    goodSen=[]

    blocks=[]
    blockQuote= soup.find_all('blockquote') # pull block quotes 
    for line in blockQuote:
        
        blocks.append(line.get_text())

    pp.pprint(blocks)
    blocks= trim(blocks, 180,80)
    blocks.sort(key= lambda q:score(q), reverse=True)
    
    remain =numQuotes-len(blocks)
    if remain<=0:
        goodSen= blocks[:numQuotes]
    else:
        goodSen+= blocks
        allQuotes= trim(allQuotes,180, 80)
        allQuotes.sort(key= lambda q:score(q), reverse=True)
        remain2= remain-len(allQuotes)

        if remain2<=0:
            goodSen+= allQuotes[:remain]
        else:
            goodSen+= allQuotes
            #
            # Future Pan: Make it able to combine sentences instead of trimming...
            #
            allSen = trim(allSen,180,80)
            allSen.sort(key= lambda q:score(q), reverse=True)

            goodSen+= allSen[:remain2]


    #for i in range(len(allQuotes)):
    #    q=allQuotes[i]
    #    q+=str(len(q))
    #    allQuotes[i]=q

   


    #pp.pprint(properU)


   
    origin=multiSplit(argv)

    if 'com' in origin: #find the hostname of the website
        source= origin[origin.index('com')-1]

    
    images= []
    # old image finding code, to be updated

    
    stri=""
    for i in img:
        stri=i.get('src')
        #print(str)
        
        pieces= multiSplit(stri)
        if source in pieces and 'logo' not in pieces and 'png' not in pieces and 'gif' not in pieces: #filter by source string
            fileSize, dims=getsizes(stri)
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
                if good:
                    images.append(stri)
            #pp.pprint(str(w)+ "/"+str(H)+ " - "+ stri)

    #pp.pprint(source)    
    #pp.pprint(images)

    content=''                                
    for i in img2:
        prop=i.get('property')
        if prop=="og:image":
            content= i.get('content') # supposed to be a guarenteed good image for every article 'technically'
            break

    return goodSen,content, images

def score(s):
    score=0

    j=s.lower()
    for p in punctuation:
        j=j.replace(p, ' ')
    l=j.split()
    for w in l:
        if w in repository.emotive:
            score+=2
        if w in repository.personal:
            score+=3
    for w in repository.nouns:
        if w in j:
            score+=1
    for w in repository.people:
        if w in j:
            score+=1
    score+= s.count('\"')
    score+= s.count(u"\u201C")
    score+= s.count(u"\u201D")

    return score
def trim(sentences, max, min):
    tempQuotes = []
    if len(sentences)>0:
        for quote in sentences:
            length = len(quote);
            if length >min and length <max:
                tempQuotes.append(quote)

    return tempQuotes


def multiSplit(string):
    if not string:
        return []
    seperated= string.replace('/',' ').replace('.', ' ').replace('_', ' ').split()
    return seperated

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

#parse('http://www.huffingtonpost.com/entry/david-cameron-dodgy_us_570bf446e4b0885fb50dc004')
#parse('http://www.huffingtonpost.com/entry/ted-cruz-gold-standard-republican_us_571196bfe4b06f35cb6fbac6?cps=gravity_2425_-8385480002285021224')

#parse('http://www.theblaze.com/stories/2016/04/12/trump-blasts-rnc-chairman-reince-priebus-should-be-ashamed-of-himself/')