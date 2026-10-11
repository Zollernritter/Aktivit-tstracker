import datetime
from datetime import datetime, timedelta
import numpy as np

from pyscript import web, when

class Abfrage:
    def __init__(self,Frage:str,Attribute:list):
        self.Frage = Frage
        self.Attribute = Attribute
        self.Anzahl = len(Attribute)

    def __str__(self):
        return f"Frage: {self.Frage} Attribute: {self.Attribute}"

    def __repr__(self):
        return f"Frage: {self.Frage} Attribute: {self.Attribute}"

class Daily_Recap:
    def __init__(self,Datum,Antworten:np.array):
        self.Datum = Datum
        self.Antworten = Antworten

    def __str__(self):
        return 'Datum: ' + str(self.Datum) + '\n' + 'Antworten:' + str(self.Antworten)


def eingaben_check(input,Abfrage_Liste,i):
    if int(input.value) in np.arange(1, Abfrage_Liste[i].Anzahl + 1):
        return True
    else:
        return False
    

def index_check(Abfrage_Liste,i):
    if i<len(Abfrage_Liste):
        return True
    else:
        return False

def frage_stellen(Abfrage_Liste,output_frage,i):
    Abfrage = Abfrage_Liste[i]
    output_frage.innerText = Abfrage

def frage_beantworten(Ant_Array:np.array,input,Recap):
    Antwort = int(input.value)
    Antwort = Antwort - 1 
    input.value = ""

    Recap.Antworten = np.append(Recap.Antworten,Antwort)
    Ant_Array.append(Recap.Antworten)
    return Antwort,Recap


def antworten_darstellen(Abfrage_Liste,output_antworten,Antworten_str,Antwort,i):
    Antworten_str = Antworten_str + Abfrage_Liste[i].Frage + ' ' +  Abfrage_Liste[i].Attribute[Antwort] + '\n'
    output_antworten.innerText = Antworten_str
    return Antworten_str


def abfrage_beenden(Recap_Liste,output_fragen,output_antworten,Antworten_str,Recap):
    Recap_Liste.append(Recap)
    Antworten_str = Antworten_str + ' Daily Abfrage beendet '  + '\n'
    output_fragen.innerText = ''
    output_antworten.innerText = Antworten_str
    


def Daily_Abfrage(Recap_Liste:list[Daily_Recap],Abfrage_Liste:list[Abfrage],Ant_Array:np.array,input,output_1,output_2):
    Datum = datetime.today()
    Antworten_string = "Tägliche abfrage" + '\n' + 'Datum:' + f'{Datum.date()}' + '\n'
    New_Recap = Daily_Recap(Datum,np.array([]))
    output_2.innerText = Antworten_string
    
    i=0
    frage_stellen(Abfrage_Liste,output_1,i)

    def fragen(event):
        nonlocal i
        nonlocal New_Recap
        nonlocal Antworten_string
        if index_check(Abfrage_Liste,i) == False:
            return
        
        if eingaben_check(input,Abfrage_Liste,i) == True:
            Antwort = frage_beantworten(Ant_Array,input,New_Recap)
            Antwort_index = Antwort[0]
            New_Recap = Antwort[1]
            Antworten_string = antworten_darstellen(Abfrage_Liste,output_2,Antworten_string,Antwort_index,i)

            i=i+1

            if index_check(Abfrage_Liste,i) == True:
                frage_stellen(Abfrage_Liste,output_1,i)
            else:
                abfrage_beenden(Recap_Liste,output_1,output_2,Antworten_string,New_Recap)

    @when("click", "#enter")
    def click_handler(event):
            fragen(event)

    @when("keydown", "body")
    def keydown_handler(event):
        if event.key == "Enter":
            event.preventDefault()
            fragen(event)


def print_daily_recaps(Recap_Liste,Abfrage_Liste):
    for recap in Recap_Liste:
        print(recap.Datum)
        i=0
        for i in range(len(Abfrage_Liste)):
            print(Abfrage_Liste[i].Frage+' '+Abfrage_Liste[i].Attribute[int(recap.Antworten[i])])
        print('')

def string_daily_recaps(Recap_Liste,Abfrage_Liste):
    output_string =''
    
    for recap in Recap_Liste:
        output_string= output_string + f'{recap.Datum}\n'
        i=0
        for i in range(len(Abfrage_Liste)):
            output_string= output_string+ f'{Abfrage_Liste[i].Frage} {Abfrage_Liste[i].Attribute[int(recap.Antworten[i])]}\n'
        output_string= output_string + '\n'
    
    return output_string

Stimmung = Abfrage('Wie fühlst du dich heute?',['1','2','3','4','5','6','7','8','9','10'])
Energie = Abfrage('Wie viel Energie hattest du heute?',['1','2','3','4','5','6','7','8','9','10'])
Stress = Abfrage('Wie gestresst warst du heute?',['1','2','3','4','5','6','7','8','9','10'])

Sport = Abfrage('Wie lange hast du heute Sport gemacht?',['gar keinen','30min','1h','1.5h','2h+'])
Arbeit = Abfrage('Wie lange hast du heute produktiv gearbeitet?',['unter 4h','4-6h','6-8h','8-10h','10-12h'])
Schlaf = Abfrage('Wie lange hast du heute geschlafen?',['unter 4h','4-6h','6-8h','8-10h','10-12h'])
Sozial = Abfrage('Wie lange hast du dich heute Unterhalten?',['unter 30min','1h','2h','3h','4h+'])
Alkohol = Abfrage('Wie viel Alkohol hast du heute getrunken',['1Bier','2Bier','3Bier','4Bier','5Bier+'])
Youtube = Abfrage('Wie lange hast du heute Youtube geschaut?',['unter 30min','1h','2h','3h','4h+'])
Zocken = Abfrage('Wie lange hast du heute gezockt?',['0h','1h','2h','3h','4h+'])
Serien = Abfrage('Wie viele Serien hast du heute geschaut?',['0 Folgen','1 Folge','2 Folgen','3 Folgen','4+ Folgen'])

Erste_Abfrage_Liste = [Stimmung,Energie,Stress,
                 Schlaf,Arbeit,Sport,Sozial,Alkohol,Youtube,Zocken,Serien]

List_of_daily_Recaps = []
Antwort_Array = []

@when("click", "#start")
def start(event):
    Daily_Abfrage(List_of_daily_Recaps,Erste_Abfrage_Liste,Antwort_Array,
                  input= web.page["abfrage_input"],output_1= web.page["Frage"],output_2 = web.page["Antworten"])

@when("click", "#clear")
def start(event):
    web.page["Antworten"].innerText = ''

@when("click", "#print_list")
def start(event):
    web.page["list_output"].innerText = string_daily_recaps(List_of_daily_Recaps,Erste_Abfrage_Liste)

@when("click", "#clear_list")
def start(event):
    web.page["list_output"].innerText = ''