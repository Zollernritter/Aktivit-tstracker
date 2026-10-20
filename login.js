import { supabase } from './supabase.js'

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("register");
const output = document.getElementById("login_output");

// check of already logged in

const {data: { session },error} = await supabase.auth.getSession();

if (error) 
{
    output.textContent = "Die Sitzung konnte nicht geprüft werden.";
} else if (session) 
{
    window.location.replace("./eingabe.html");
}


// Login Button

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { error } = await supabase.auth.signInWithPassword({email,password});

    if (error)  
    {
        output.textContent = "Anmeldung fehlgeschlagen.";
        console.error("Registrierungsfehler:", error.message);
        return;
    }
    else
    {
        window.location.replace("./eingabe.html");
    }
});

// Registrieren Button

registerButton.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || password.length < 6) 
    {
        output.textContent = "Bitte eine E-Mail-Adresse und ein Passwort mit mindestens 6 Zeichen eingeben.";
        return;
    }

    output.textContent = "Registrierung läuft ...";
    const { data,error } = await supabase.auth.signUp({email,password});

    if (error)  
    {
        output.textContent = "Registrierung fehlgeschlagen.";
        console.error("Registrierungsfehler:", error.message);
        return;
    }

    if (data.session) 
    {
        window.location.replace("./eingabe.html");
    }
    else 
    {
        output.textContent = "Bitte prüfe deine E-Mails und bestätige dein Konto.";
    }
});



