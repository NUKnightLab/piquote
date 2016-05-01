import json
from bs4 import BeautifulSoup
import requests
import re
import sys
from nltk import sent_tokenize
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktParameters
import pprint

pp = pprint.PrettyPrinter(indent=4)
DictQuote={}
final_quote=""
final_image=""

punctuation = [".", "!", "?", ")", "]", "\"", "'", u"\u201D", u"\u201C"] 
prefixes = ['dr', 'vs', 'mr', 'mrs','ms' ,'prof', 'inc','jr','f.b.i','i.e']

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
    proper=[]
    for para in paras:
        text=para.get_text()
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
            elif c=="." and (text[lastSpace+1:i].lower() in prefixes or i-lastCap<2 or i-lastSpace<2): 
                # all the cases for when a period doesn't end a sentence
                do=0
                #continue
            elif c== "." or c=="!" or c=="?" or c==";": # end of a sentence
                j=i
                while j<len(text) and text[j] in punctuation:
                    j+=1
                s = text[lastBegin:j]
                sentences.append(s)
                nextBegin= j

                if capC>1:
                    proper.append(text[properStart:i])
                capC=0

                #print str(hadQ)+"-----"
                hadQ=False
                if wasQ:
                    hadQ=True
                wasQ=False
            elif c == "\"": # AScii quote, toggles whether or not to be in a quote
                if inQuote:
                    q= text[quoteStart:i+1]
                    #print str(quoteStart)+ " - ascii end"
                    inQuote=False
                    if spaceQ>3:
                        if mightMer:
                            merge.append(len(quotes)+len(allQuotes))
                        quotes.append(q)
                    spaceQ=0
                    if not (nextBegin>i):
                        wasQ=True
                    mightMer=False
                else:
                    inQuote=True
                    quoteStart=i
                    #print str(quoteStart)+" - " +str(lastBegin)+"  //  "+ str(hadQ)
                    if quoteStart-lastBegin<2 and hadQ:
                        mightMer=True

            elif c==u'\u201c': #unicode quote begin
                inQuote=True
                quoteStart=i
                #print str(quoteStart)+" - " +str(lastBegin)+"  //  "+ str(hadQ)
                if quoteStart-lastBegin<2 and hadQ:
                    mightMer=True
            elif c==u'\u201d': # unicode quote end
                q= text[quoteStart:i+1]
                    #print str(quoteStart)+ " - ascii end"
                inQuote=False
                if spaceQ>3: # quote has 4 or more words
                    if mightMer:
                        merge.append(len(quotes)+len(allQuotes))
                    quotes.append(q)
                spaceQ=0
                if not (nextBegin>i):
                    wasQ=True
                mightMer=False
            elif ord(c)>64 and ord(c)<91:
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
        if punc == ",":
            punc= "."
        qFin= q1 +punc+ " "+ q2[1:]
        allQuotes[i-1]=qFin
    mod=0
    for i in merge:
        allQuotes.pop(i+mod)
        mod-=1

    #for s in allSen:
        #score = 0
        #for e in personal:
            #if

    allQuotes.sort(key= lambda q:len(q), reverse=True)

    while len(allQuotes[0])>500:
        allQuotes=allQuotes[1:]
    allQuotes.reverse()
    while len(allQuotes[0])<40:
        allQuotes=allQuotes[1:]
    allQuotes.reverse()

    properU=[]
    for line in proper:
        if line not in properU:
            properU.append(line)


    #pp.pprint(properU)


   
    origin=multiSplit(data)

    source= origin[origin.index('www')+1]


    images= []
    # old image finding code, to be updated

    
    stri=""
    for i in img:
        stri=i.get('src')
        #print(str)
        pieces= multiSplit(stri)
        if source in pieces and 'logo' not in pieces:
            #w, h =jpeg_res(stri)
            images.append(stri)
            #pp.pprint(str(w)+ "/"+str(H)+ " - "+ stri)
        
    #pp.pprint(images)

    content=''                                
    for i in img2:
        prop=i.get('property')
        if prop=="og:image":
            content= i.get('content')
            break


    return allQuotes,content, images
def multiSplit(string):

    list= string.replace('/',' ').replace('.', ' ').replace('_', ' ').split()
    return list

   
#parse('http://www.huffingtonpost.com/entry/david-cameron-dodgy_us_570bf446e4b0885fb50dc004')
#parse('http://www.huffingtonpost.com/entry/ted-cruz-gold-standard-republican_us_571196bfe4b06f35cb6fbac6?cps=gravity_2425_-8385480002285021224')

#parse('http://www.theblaze.com/stories/2016/04/12/trump-blasts-rnc-chairman-reince-priebus-should-be-ashamed-of-himself/')