import { supabase } from './supabase.js'

import {
    Abfrage,
    DailyRecap,
    index_check,
    frage_stellen,
    frage_beantworten,
    antworten_darstellen,
    abfrage_beenden,
    buttons_erstellen,
    Daily_Abfrage,
    stimmungSpeichern,
    aktivitätenSpeichern
} from "./functions.js";

console.log('Supabase-Client erstellt:', supabase)

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

const Abfrage_Liste_Stimmung  = [Stimmung,Energie,Stress]
const Abfrage_Liste_Aktivitäten = [Schlaf,Arbeit,Sport,Sozial,Alkohol,Youtube,Zocken,Serien];

const Recaps_Stimmung = [];
const Antwort_Arrays_Stimmung = [];

const Recaps_Aktivitäten = [];
const Antwort_Arrays_Aktivitäten = [];

// HTML-Elemente
const output_1_Stimmung = document.querySelector("#Frage_Stimmung");
const output_2_Stimmung = document.querySelector("#Antworten_Stimmung");
const output_3_Stimmung = document.querySelector("#Progression_Abfrage_Stimmung");

const output_1_Aktivitäten = document.querySelector("#Frage_Aktivitäten");
const output_2_Aktivitäten = document.querySelector("#Antworten_Aktivitäten");
const output_3_Aktivitäten = document.querySelector("#Progression_Abfrage_Aktivitäten");

// Start-Button-Stimmung
document.querySelector("#start_Stimmung").addEventListener("click", function () {
    Daily_Abfrage(
        Recaps_Stimmung,
        Abfrage_Liste_Stimmung,
        Antwort_Arrays_Stimmung,
        output_1_Stimmung,
        output_2_Stimmung,
        output_3_Stimmung,
        'button_container_1_Stimmung',
        'button_container_2_Stimmung',
        stimmungSpeichern
    );
});

// Ausgabe leeren
document.querySelector("#clear_Stimmung").addEventListener("click", function () {
    output_2_Stimmung.innerText = "";
});

// Start-Button-Stimmung
document.querySelector("#start_Aktivitäten").addEventListener("click", function () {
    Daily_Abfrage(
        Recaps_Aktivitäten,
        Abfrage_Liste_Aktivitäten,
        Antwort_Arrays_Aktivitäten,
        output_1_Aktivitäten,
        output_2_Aktivitäten,
        output_3_Aktivitäten,
        'button_container_1_Aktivitäten',
        'button_container_2_Aktivitäten',
        aktivitätenSpeichern
    );
});
// Ausgabe leeren
document.querySelector("#clear_Aktivitäten").addEventListener("click", function () {
    output_2_Aktivitäten.innerText = "";
});

