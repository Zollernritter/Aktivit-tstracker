
class Abfrage {
    constructor(Frage, Attribute) 
    {
        this.Frage = Frage;
        this.Attribute = Attribute;
        this.Anzahl = Attribute.length;
    }

    toString() 
    {
        return `Frage: ${this.Frage} Attribute: ${this.Attribute}`;
    }
}

class DailyRecap {
    constructor(Datum, Antworten = []) 
    {
        this.Datum = Datum;
        this.Antworten = Antworten;
    }

    toString() 
    {
        return `Datum: ${this.Datum}\nAntworten: ${this.Antworten}`;
    }
}


// Prüft, ob noch Fragen vorhanden sind
function index_check(Abfrage_Liste, i) 
{
    return i < Abfrage_Liste.length;
}


// Zeigt die aktuelle Frage an
function frage_stellen(Abfrage_Liste, output_frage, i) 
{
    const abfrage = Abfrage_Liste[i].Frage;
    output_frage.innerText = abfrage.toString();
}


// Speichert eine Antwort
function frage_beantworten(Ant_Array, input, Recap) 
{
    const Antwort = Number(input.value) - 1;
    input.value = "";
    Recap.Antworten.push(Antwort);
    Ant_Array.push(Antwort);
    return [Antwort, Recap];
}


// Zeigt die gegebene Antwort an
function antworten_darstellen(Abfrage_Liste,output_antworten,Antworten_str,Antwort,i) 
{
    Antworten_str +=Abfrage_Liste[i].Frage + " " +Abfrage_Liste[i].Attribute[Antwort] + "\n";
    output_antworten.innerText = Antworten_str;
    return Antworten_str;
}


// Beendet eine tägliche Abfrage
function abfrage_beenden(Recap_Liste,output_fragen,output_antworten,Antworten_str,Recap,Ant_Array,Ant_Arrays) 
{
    Recap_Liste.push(Recap);
    Ant_Arrays.push(Ant_Array);
    console.log(Recap)
    console.log(Ant_Array)

    Antworten_str += "Daily Abfrage beendet\n";

    output_fragen.innerText = "";
    output_antworten.innerText = Antworten_str;
}


function buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,Antworten_str,i){

    for (let j = 0; j < Abfrage_Liste[i].Anzahl; j++) 
        {
        //button funktionalität und text erstellen
        antwort=Abfrage_Liste[i].Attribute[j]
        let button = document.createElement("button");
        button.textContent = antwort;

        button.addEventListener("click", function() {
            // Antwort speichern + anzeigen
            Ant_Array[i] = j;
            Recap.Antworten[i] = j;
            Antworten_str = antworten_darstellen(Abfrage_Liste,output_antworten,Antworten_str,j,i)
            //buttons clearen
            document.getElementById(container_1).replaceChildren();
            document.getElementById(container_2).replaceChildren();

            if (index_check(Abfrage_Liste, i+1)) 
            {
                //nächste Frage stellen
                frage_stellen(Abfrage_Liste, output_frage, i+1)
                buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,Antworten_str,i+1)
            } 
            else {
                abfrage_beenden(Recap_Liste,output_frage,output_antworten,Antworten_str,Recap,Ant_Array,Ant_Arrays);
                document.getElementById(container_2).replaceChildren();
                alert("Abfrage beendet!");
            }
            }
        );

        // Button in den Container einfügen
        document.getElementById(container_1).appendChild(button);
        }

    let zurück = document.createElement("button");
    zurück.textContent = 'zurück';
    document.getElementById(container_2).appendChild(zurück);

    let überspringen = document.createElement("button");
    überspringen.textContent = 'überspringen';
    document.getElementById(container_2).appendChild(überspringen);

    zurück.addEventListener("click", function() {
        if (i > 0)
        {
            document.getElementById(container_1).replaceChildren();
            document.getElementById(container_2).replaceChildren();
            frage_stellen(Abfrage_Liste, output_frage, i-1)
            buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,Antworten_str,i-1)
        }
    })

    überspringen.addEventListener("click", function() {
        if (i < Abfrage_Liste.length-2)
        {
            document.getElementById(container_1).replaceChildren();
            document.getElementById(container_2).replaceChildren();
            frage_stellen(Abfrage_Liste, output_frage, i+1)
            buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,Antworten_str,i+1)
        }
    })
    
}


// Führt die tägliche Abfrage aus
function Daily_Abfrage(
    Recap_Liste,
    Abfrage_Liste,
    Ant_Arrays,
    output_1,
    output_2,
    container_1,
    container_2
) {
    // Variablen initialisieren
    const jetzt = new Date();
    const Datum =`${jetzt.getFullYear()}-` +`${String(jetzt.getMonth() + 1).padStart(2, "0")}-` +`${String(jetzt.getDate()).padStart(2, "0")}`;
    let Antworten_string = "Tägliche Abfrage\nDatum: " + Datum + "\n";
    let New_Recap = new DailyRecap(jetzt, new Array(Abfrage_Liste.length).fill(null));
    output_2.innerText = Antworten_string;

    let Ant_Array = new Array(Abfrage_Liste.length).fill(null);
    let i = 0;

    document.getElementById(container_1).replaceChildren();
    document.getElementById(container_2).replaceChildren();
    
    frage_stellen(Abfrage_Liste, output_1, i);

    //überspringen und zurück buttons

    buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,New_Recap,output_1,output_2,Antworten_string,i)
}


// Gibt alle Tageszusammenfassungen als Text zurück
function string_daily_recaps(Recap_Liste, Abfrage_Liste) {
    let output_string = "";

    for (const recap of Recap_Liste) {
        const datum = recap.Datum instanceof Date
            ? recap.Datum.toString()
            : String(recap.Datum);

        output_string += `${datum}\n`;

        for (let i = 0; i < Abfrage_Liste.length; i++) {
            if (i >= recap.Antworten.length) 
            {
                break;
            }
            output_string += `${Abfrage_Liste[i].Frage} ` + `${Abfrage_Liste[i].Attribute[recap.Antworten[i]]}\n`;
        }
        output_string += "\n";
    }
    return output_string;
}

// Fragen definieren
const Stimmung = new Abfrage("Wie fühlst du dich heute?",["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
const Energie = new Abfrage("Wie viel Energie hattest du heute?",["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
const Stress = new Abfrage("Wie gestresst warst du heute?",["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);

const Sport = new Abfrage("Wie lange hast du heute Sport gemacht?",["gar keinen", "30min", "1h", "1.5h", "2h+"]);
const Arbeit = new Abfrage("Wie lange hast du heute produktiv gearbeitet?",["unter 4h", "4-6h", "6-8h", "8-10h", "10-12h"]);
const Schlaf = new Abfrage("Wie lange hast du heute geschlafen?",["unter 4h", "4-6h", "6-8h", "8-10h", "10-12h"]);
const Sozial = new Abfrage("Wie lange hast du dich heute unterhalten?",["unter 30min", "1h", "2h", "3h", "4h+"]);
const Alkohol = new Abfrage("Wie viel Alkohol hast du heute getrunken?",["1Bier", "2Bier", "3Bier", "4Bier", "5Bier+"]);
const Youtube = new Abfrage("Wie lange hast du heute Youtube geschaut?",["unter 30min", "1h", "2h", "3h", "4h+"]);
const Zocken = new Abfrage("Wie lange hast du heute gezockt?",["0h", "1h", "2h", "3h", "4h+"]);
const Serien = new Abfrage("Wie viele Serien hast du heute geschaut?",["0 Folgen", "1 Folge", "2 Folgen", "3 Folgen", "4+ Folgen"]);

const Erste_Abfrage_Liste = [Stimmung,Energie,Stress,Schlaf,Arbeit,Sport,Sozial,Alkohol,Youtube,Zocken,Serien];

// Speicher im Arbeitsspeicher
const List_of_daily_Recaps = [];
const Antwort_Arrays = [];

// HTML-Elemente
const input = document.querySelector("#abfrage_input");
const output_1 = document.querySelector("#Frage");
const output_2 = document.querySelector("#Antworten");

// Start-Button
document.querySelector("#start").addEventListener("click", function () {
    Daily_Abfrage(
        List_of_daily_Recaps,
        Erste_Abfrage_Liste,
        Antwort_Arrays,
        output_1,
        output_2,
        'button_container_1',
        'button_container_2'
    );
});

// Ausgabe leeren
document.querySelector("#clear").addEventListener("click", function () {
    output_2.innerText = "";
});

// Tageszusammenfassungen anzeigen
document.querySelector("#print_list").addEventListener("click", function () {
    document.querySelector("#list_output").innerText =
        string_daily_recaps(
            List_of_daily_Recaps,
            Erste_Abfrage_Liste
        );
});

// Historienausgabe leeren
document.querySelector("#clear_list").addEventListener("click", function () {
    document.querySelector("#list_output").innerText = "";
});
