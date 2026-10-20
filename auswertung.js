import { supabase } from './supabase.js'

import {
    Abfrage,
    DailyRecap,
    tabelle_auslesen,
    stimmungs_tabelle,
    aktivitäts_tabelle
} from "./functions.js";

console.log('Supabase-Client erstellt:', supabase)

const List_of_daily_Recaps = [];

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

let Recaps_Stimmung = [];
Recaps_Stimmung = await tabelle_auslesen("Gefühle")
console.log(Recaps_Stimmung);
const Antwort_Arrays_Stimmung = [];

let Recaps_Aktivitäten = [];
Recaps_Aktivitäten = await tabelle_auslesen("Aktivitäten")
console.log(Recaps_Aktivitäten);
const Antwort_Arrays_Aktivitäten = [];

const ausgabe_Gefühle = document.getElementById("output_Gefühle");
const ausgabe_Aktivitäten = document.getElementById("output_Aktivitäten");



document.querySelector("#print_Gefühle").addEventListener("click", function () {
    stimmungs_tabelle(Recaps_Stimmung,ausgabe_Gefühle)
});

// Historienausgabe leeren
document.querySelector("#clear_Gefühle").addEventListener("click", function () {
    ausgabe_Gefühle.innerText = "";
});

document.querySelector("#print_Aktivitäten").addEventListener("click", function () {
    aktivitäts_tabelle(Recaps_Aktivitäten,ausgabe_Aktivitäten,Abfrage_Liste_Aktivitäten)
});

// Historienausgabe leeren
document.querySelector("#clear_Aktivitäten").addEventListener("click", function () {
    ausgabe_Aktivitäten.innerText = "";
});