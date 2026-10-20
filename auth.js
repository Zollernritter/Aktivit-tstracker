
import { supabase } from "./supabase.js";

const emailAnzeige = document.getElementById("user-email");
const logoutButton = document.getElementById("logout-button");

// 1. Prüfen, ob eine Session existiert
async function nutzerAnzeigen() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) 
    {
        window.location.replace("./login.html");
        return;
    }

    // 2. E-Mail-Adresse anzeigen
    emailAnzeige.textContent =
        data.session.user.email ?? "E-Mail unbekannt";
}

// 3. Logout-Button
logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    const { error } = await supabase.auth.signOut();

    if (error) 
    {
        console.error("Logout fehlgeschlagen:", error.message);
        logoutButton.disabled = false;
        return;
    }

    window.location.replace("./login.html");
});

// 4. Auf Änderungen der Session reagieren
supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) 
    {
        window.location.replace("./login.html");
        return;
    }

    emailAnzeige.textContent =
        session.user.email ?? "E-Mail unbekannt";
});

// 5. Prüfung beim Laden starten
nutzerAnzeigen();
