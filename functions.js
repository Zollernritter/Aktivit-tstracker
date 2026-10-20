import { supabase } from "./supabase.js";

export class Abfrage {
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

export class DailyRecap {
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
export function index_check(Abfrage_Liste, i) 
{
    return i < Abfrage_Liste.length;
}


// Zeigt die aktuelle Frage an
export function frage_stellen(Abfrage_Liste, output_frage, i) 
{
    const abfrage = Abfrage_Liste[i].Frage;
    output_frage.innerText = abfrage.toString();
}


// Speichert eine Antwort
export function frage_beantworten(Ant_Array, input, Recap) 
{
    const Antwort = Number(input.value) - 1;
    input.value = "";
    Recap.Antworten.push(Antwort);
    Ant_Array.push(Antwort);
    return [Antwort, Recap];
}


// Zeigt die gegebene Antwort an
export function antworten_darstellen(Abfrage_Liste,output_antworten,Antworten_str,Antwort,i) 
{
    Antworten_str +=Abfrage_Liste[i].Frage + " " +Abfrage_Liste[i].Attribute[Antwort] + "\n";
    output_antworten.innerText = Antworten_str;
    return Antworten_str;
}


export async function stimmungSpeichern(Recap) {
    const Gefühle = Recap.Antworten;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("Kein Nutzer angemeldet.");
        return;
    }

    const { data, error } = await supabase
        .from("Gefühle")
        .insert({
            Gefühl_1: Gefühle[0],
            Gefühl_2: Gefühle[1],
            Gefühl_3: Gefühle[2],
            user_id: user.id
        })
        .select();

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        return;
    }
    console.log('Speichern erfolgreich')
    return data;
}


export async function aktivitätenSpeichern(Recap) {
    const Aktivitäten = Recap.Antworten;

    //const { data: { user } } = await supabase.auth.getUser();


    const { data: { user }, error: userError } = await supabase.auth.getUser();


    console.log("Auth-Fehler:", userError);
    console.log("Angemeldeter Nutzer vorhanden:", Boolean(user));
    console.log("User-ID vorhanden:", Boolean(user?.id));

    if (!user) {
        console.error("Kein Nutzer angemeldet.");
        return;
    }
    console.log("Angemeldet:", Boolean(user));
    console.log("User-ID vorhanden:", Boolean(user?.id));


    const eintrag = {
            Antwort_1: Aktivitäten[0],
            Antwort_2: Aktivitäten[1],
            Antwort_3: Aktivitäten[2],
            Antwort_4: Aktivitäten[3],
            Antwort_5: Aktivitäten[4],
            Antwort_6: Aktivitäten[5],
            Antwort_7: Aktivitäten[6],
            Antwort_8: Aktivitäten[7],
            user_id: user.id
        }

    console.log("Eintrag zum Speichern:", eintrag);

    console.log("User-ID:", user.id);
    console.log("Eintrag-user_id:", eintrag.user_id);
    console.log("IDs identisch:", user.id === eintrag.user_id);

    const { data, error } = await supabase.from("Aktivitäten").insert(eintrag).select();

    console.log("Ergebnis:", data);
    console.log("Fehler:", error);

    if (error) {
        console.error("Fehler beim Speichern:", error.message);
        return;
    }
    console.log('Speichern erfolgreich')
    return data;
}


// Beendet eine tägliche Abfrage
export async function abfrage_beenden(Recap_Liste,output_fragen,output_antworten,Antworten_str,Recap,Ant_Array,Ant_Arrays,speicher_func) 
{
    Recap_Liste.push(Recap);
    Ant_Arrays.push(Ant_Array);
    console.log(Recap);
    console.log(Ant_Array);
    await speicher_func(Recap);

    Antworten_str += "Daily Abfrage beendet\n";

    output_fragen.innerText = "";
    output_antworten.innerText = Antworten_str;
}


export async function buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,output_progress,Antworten_str,speicher_func,i){

    output_progress.innerText = "Frage "+(i+1)+' von '+Abfrage_Liste.length;

    for (let j = 0; j < Abfrage_Liste[i].Anzahl; j++) 
        {
        //button funktionalität und text erstellen
        const antwort=Abfrage_Liste[i].Attribute[j]
        let button = document.createElement("button");
        button.textContent = antwort;

        button.addEventListener("click", async function() {
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
                buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,output_progress,Antworten_str,speicher_func,i+1)
            } 
            else {
                await abfrage_beenden(Recap_Liste,output_frage,output_antworten,Antworten_str,Recap,Ant_Array,Ant_Arrays,speicher_func);
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
            buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,output_progress,Antworten_str,speicher_func,i-1)
        }
    })

    überspringen.addEventListener("click", function() {
        if (i < Abfrage_Liste.length-2)
        {
            document.getElementById(container_1).replaceChildren();
            document.getElementById(container_2).replaceChildren();
            frage_stellen(Abfrage_Liste, output_frage, i+1)
            buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,Recap,output_frage,output_antworten,output_progress,Antworten_str,speicher_func,i+1)
        }
    })
    
}


// Führt die tägliche Abfrage aus
export async function Daily_Abfrage(
    Recap_Liste,
    Abfrage_Liste,
    Ant_Arrays,
    output_1,
    output_2,
    output_3,
    container_1,
    container_2,
    speicher_func
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

    buttons_erstellen(Abfrage_Liste,Recap_Liste,container_1,container_2,Ant_Array,Ant_Arrays,New_Recap,output_1,output_2,output_3,Antworten_string,speicher_func,i)
}


// Gibt alle Tageszusammenfassungen als Text zurück
// export function string_daily_recaps(Recap_Liste, Abfrage_Liste) {
//     let output_string = "";

//     for (const recap of Recap_Liste) {
//         const datum = recap.Datum instanceof Date
//             ? recap.Datum.toString()
//             : String(recap.Datum);

//         output_string += `${datum}\n`;

//         for (let i = 0; i < Abfrage_Liste.length; i++) {
//             if (i >= recap.Antworten.length) 
//             {
//                 break;
//             }
//             output_string += `${Abfrage_Liste[i].Frage} ` + `${Abfrage_Liste[i].Attribute[recap.Antworten[i]]}\n`;
//         }
//         output_string += "\n";
//     }
//     return output_string;
// }

// Gibt alle Tageszusammenfassungen als Text zurück
export async function tabelle_auslesen(Supabase_Tabelle) {
    const { data, error } = await supabase.from(Supabase_Tabelle).select("*");

    if (error) {
        console.error("Fehler beim Auslesen:", error.message);
        return;
    }

    return data;
}

export function stimmungs_tabelle(Recaps_Stimmung,output_list) {
    const tabelle = document.createElement("table");

    // Tabellenkopf
    const kopf = tabelle.createTHead();
    const kopfzeile = kopf.insertRow();

    const spalten = [
        "ID",
        "Zeitpunkt",
        "Stimmung",
        "Energie",
        "Stress"
    ];

    for (const spalte of spalten) {
        const th = document.createElement("th");
        th.textContent = spalte;
        kopfzeile.appendChild(th);
    }

    // Tabelleninhalt
    const tbody = tabelle.createTBody();

    for (const eintrag of Recaps_Stimmung) {
        const zeile = tbody.insertRow();

        zeile.insertCell().textContent = eintrag.id;
        zeile.insertCell().textContent = new Date(eintrag.created_at).toLocaleString("de-DE");
        zeile.insertCell().textContent = (eintrag.Gefühl_1+1).toString() + " / 10";
        zeile.insertCell().textContent = (eintrag.Gefühl_2+1).toString() + " / 10";
        zeile.insertCell().textContent = (eintrag.Gefühl_3+1).toString() + " / 10";
    }

    output_list.replaceChildren(tabelle);
}

export function aktivitäts_tabelle(Recaps_Aktivitäten,output_list,Abfrage_Liste_Aktivitäten) {
    const tabelle = document.createElement("table");

    // Tabellenkopf
    const kopf = tabelle.createTHead();
    const kopfzeile = kopf.insertRow();

    const spalten = [
        "ID",
        "Datum",
        "Schlaf",
        "Arbeit",
        "Sport",
        "Sozial",
        "Alkohol",
        "Youtube",
        "Zocken",
        "Serien"
    ];

    for (const spalte of spalten) {
        const th = document.createElement("th");
        th.textContent = spalte;
        kopfzeile.appendChild(th);
    }

    // Tabelleninhalt
    const tbody = tabelle.createTBody();

    for (const eintrag of Recaps_Aktivitäten) {
        const zeile = tbody.insertRow();

        console.log( Abfrage_Liste_Aktivitäten[0].Attribute[eintrag.Aktivität_1])

        zeile.insertCell().textContent = eintrag.id;
        zeile.insertCell().textContent = eintrag.created_at;
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[0].Attribute[eintrag.Antwort_1];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[1].Attribute[eintrag.Antwort_2];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[2].Attribute[eintrag.Antwort_3];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[3].Attribute[eintrag.Antwort_4];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[4].Attribute[eintrag.Antwort_5];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[5].Attribute[eintrag.Antwort_6];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[6].Attribute[eintrag.Antwort_7];
        zeile.insertCell().textContent = Abfrage_Liste_Aktivitäten[7].Attribute[eintrag.Antwort_8];
    }

    output_list.replaceChildren(tabelle);
}

