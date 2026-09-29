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


# def Daily_Abfrage(Recap_Liste:list[Daily_Recap],Abfrage_Liste:list[Abfrage],Ant_Array:np.array):
#     print('Tägliche abfrage')
#     Datum = datetime.today()
#     print('Datum:' , datetime.today().date())
#     New_Recap = Daily_Recap(Datum,np.array([]))
#     output_Frage = web.page["Frage"]
#     output_Antworten = web.page["Antworten"]
#     Antworten = ""
#     for Abfrage in Abfrage_Liste:
#         output_Frage.innerText = Abfrage
#         Antwort = 0
#         @when("click", "#enter")
#         def start(event):
#             abfrage_input = web.page["abfrage_input"]
#             try:
#                 Antwort = int(abfrage_input.value)
#             except ValueError:
#                 return
#             if Antwort not in np.arange(1, Abfrage.Anzahl + 1):
#                 return
#         while Antwort not in np.arange(1,Abfrage.Anzahl+1):
#             abfrage_input = web.page["abfrage_input"]
#             Antwort = int(abfrage_input)
#         Antwort = Antwort - 1 
#         Antworten = Antworten + Abfrage.Frage + ' ' +  Abfrage.Attribute[Antwort] + '\n'
#         output_Antworten.innerText = Antworten
#         New_Recap.Antworten = np.append(New_Recap.Antworten,Antwort)
#     Ant_Array.append(New_Recap.Antworten)
#     Recap_Liste.append(New_Recap)



def Daily_Abfrage(Recap_Liste:list[Daily_Recap],Abfrage_Liste:list[Abfrage],Ant_Array:np.array):
    print('Tägliche abfrage')
    Datum = datetime.today()
    print('Datum:' , datetime.today().date())
    New_Recap = Daily_Recap(Datum,np.array([]))
    output_Frage = web.page["Frage"]
    output_Antworten = web.page["Antworten"]
    Antworten_str = ""
    
    i=0
    while i < len(Abfrage_Liste):
        output_Frage.innerText = Abfrage_Liste[i]
        @when("click", "#enter")
        def start(event):
            abfrage_input = web.page["abfrage_input"]
            Antwort = int(abfrage_input.value)
            if Antwort in np.arange(1, Abfrage_Liste[i].Anzahl + 1):
                Antwort = Antwort - 1 
                Antworten_str = Antworten_str + Abfrage_Liste[i].Frage + ' ' +  Abfrage_Liste[i].Attribute[Antwort] + '\n'
                output_Antworten.innerText = Antworten_str
                New_Recap.Antworten = np.append(New_Recap.Antworten,Antwort)
                i=i+1
            else:
                return
    Ant_Array.append(New_Recap.Antworten)
    Recap_Liste.append(New_Recap)





def print_daily_recaps(Recap_Liste,Abfrage_Liste):
    for recap in Recap_Liste:
        print(recap.Datum)
        i=0
        for i in range(len(Abfrage_Liste)):
            print(Abfrage_Liste[i].Frage+' '+Abfrage_Liste[i].Attribute[int(recap.Antworten[i])])
        print('')

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
    Daily_Abfrage(List_of_daily_Recaps,Erste_Abfrage_Liste,Antwort_Array)

