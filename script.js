/**
 * Progetto finale JS - Prodotti Negozio Online
 * Crea una pagina che mostra una lista di prodotti recuperati da un'API (es. http://localhost:5000/api/products)
 * Ogni prodotto ha: id, nome, descrizione, categoria, prezzo, immagine, disponibilità
 * * FUNZIONALITÀ:
 * 1. Recupera i prodotti da API (fetch GET)
 * 2. Mostra i prodotti in una tabella con immagine, nome, prezzo e disponibilità
 * 3. Quando l'utente clicca su un prodotto, mostra i dettagli in una sezione a parte (usa le classi "modal" e "nascosto" nella sezione)
 * 4. Nella sezione dei dettagli, mostra TUTTE le info del prodotto e un pulsante "Chiudi" per nascondere la sezione
 * * Suggerimenti per l'implementazione:
 * - Crea una funzione che genera una riga di un singolo prodotto
 * - Crea una funzione che visualizza l'intera tabella dei prodotti (che richiama la funzione precedente per ogni prodotto)
 * - Crea una funzione che fa mostra la sezione dei dettagli con le info del prodotto passato per parametro
 * - Aggiungi un event listener a ogni riga della tabella per mostrare i dettagli del prodotto cliccato (usa la funzione di visualizzazione dei dettagli)
 * - Aggiungi un event listener al pulsante "Chiudi" per nascondere la sezione dei dettagli
 * * Bonus:
 * - Aggiungi una barra di ricerca per filtrare i prodotti per nome (filtro testuale)
 * - Aggiungi un filtro per categoria (dropdown) per mostrare solo i prodotti di una certa categoria
 * Nota: i filtri devono lavorare insieme e sui dati già recuperati, senza fare nuove richieste all'API
 */

// API: ( puo essere localhost o il pc del docente)
// Costante con l'indirizzo base API
const BASE_URL = 'http://192.168.1.102:5000/api';

// Variabile globale che salva i prodotti
let tuttiIProdotti = [];

// Selettori dall'html
const tabellaProdotti = document.querySelector('#tabellaProdotti'); // Seleziona il corpo della tabella
const cercaNomeInput = document.querySelector('#cercaNome'); // Seleziona la barra di ricerca
const filtroCategoriaSelect = document.querySelector('#filtroCategoria'); // Seleziona il menu a tendina categorie
const modale = document.querySelector('#modale'); // Seleziona il contenitore del modale
const chiudiModaleBtn = document.querySelector('#chiudi'); // Seleziona il pulsante di chiusura (×)
const prodottoNome = document.querySelector('#prodottoNome'); // Seleziona il titolo nel modale
const prodottoImmagine = document.querySelector('#prodottoImmagine'); // Seleziona l'immagine nel modale
const prodottoDescrizione = document.querySelector('#prodottoDescrizione'); // Seleziona la descrizione nel modale
const prodottoPrezzo = document.querySelector('#prodottoPrezzo'); // Seleziona il prezzo nel modale
const prodottoDisponibilita = document.querySelector('#prodottoDisponibilita'); // Seleziona la disponibilità nel modale

// Funzione asincrona che recupera i dati dal server
async function recuperaDati() {
    // Apro Try / Catch
    try { // Prova a eseguire
        const response = await fetch(`${BASE_URL}/products`); // Esegue la richiesta HTTP
        if (!response.ok) { // Controlla se la risposta è valida
            throw new Error(`Errore di rete: ${response.status}`); // Genera un errore se fallisce
        }
        tuttiIProdotti = await response.json(); // Converte i dati in JSON
        mostraProdotti(tuttiIProdotti); // Popola la tabella
        popolaCategorie(tuttiIProdotti); // Popola il filtro categorie
    } catch (error) { // Cattura eventuali errori
        console.error("Errore recupero dati:", error); // Stampa errore in console
        alert("Impossibile caricare i prodotti."); // Avvisa l'utente
    }
}

// Funzione che popola la tabella HTML
function mostraProdotti(prodotti) {
    tabellaProdotti.innerHTML = ""; // Svuota la tabella
    if (prodotti.length === 0) { // Controlla se l'array è vuoto
        tabellaProdotti.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nessun prodotto trovato.</td></tr>`;
        return; // Ferma l'esecuzione
    }
    prodotti.forEach(prodotto => { // Cicla ogni prodotto
        const rigaProdotto = creaRigaProdotto(prodotto); // Crea la riga
        tabellaProdotti.append(rigaProdotto); // Aggiunge la riga in tabella
    });
}

// Funzione che genera il codice HTML della singola riga
function creaRigaProdotto(prodotto) {
    const tr = document.createElement('tr'); // Crea elemento <tr>
    const classeDispo = prodotto.disponibilita ? 'available' : 'unavailable'; // Imposta classe CSS
    const testoDispo = prodotto.disponibilita ? 'Disponibile' : 'Non disponibile'; // Imposta testo

    tr.innerHTML = `
        <td><img src="${prodotto.immagine}" alt="${prodotto.nome}"></td>
        <td><strong>${prodotto.nome}</strong></td>
        <td>€ ${prodotto.prezzo.toFixed(2)}</td>
        <td class="${classeDispo}">${testoDispo}</td>
    `; // Inserisce i dati HTML

    tr.addEventListener('click', () => { // Ascolta il click sulla riga
        apriModaleDettagli(prodotto); // Apre il modale
    });

    return tr; // Ritorna la riga pronta
}

// Funzione che inserisce i dati nel modale e lo rende visibile
function apriModaleDettagli(prodotto) {
    prodottoNome.textContent = prodotto.nome; // Inserisce nome
    prodottoImmagine.src = prodotto.immagine; // Inserisce URL immagine
    prodottoImmagine.alt = prodotto.nome; // Inserisce testo alternativo immagine
    prodottoDescrizione.innerHTML = `<strong>Descrizione:</strong> ${prodotto.descrizione}`; // Inserisce descrizione
    prodottoPrezzo.innerHTML = `<strong>Prezzo:</strong> € ${prodotto.prezzo.toFixed(2)}`; // Inserisce prezzo

    if (prodotto.disponibilita) { // Verifica disponibilità per il colore
        prodottoDisponibilita.innerHTML = `<strong>Disponibilità:</strong> <span class="available">Disponibile</span>`;
    } else {
        prodottoDisponibilita.innerHTML = `<strong>Disponibilità:</strong> <span class="unavailable">Non disponibile</span>`;
    }
    modale.classList.remove('nascosto'); // Mostra modale togliendo la classe
}

// Funzione che estrae categorie uniche e crea le <option> per la select
function popolaCategorie(prodotti) {
    const categorie = []; // Array d'appoggio vuoto
    prodotti.forEach(p => { // Cicla i prodotti
        if (!categorie.includes(p.categoria)) { // Controlla duplicati
            categorie.push(p.categoria); // Aggiunge categoria
        }
    });
    categorie.forEach(cat => { // Cicla le categorie trovate
        const opzione = document.createElement('option'); // Crea l'opzione
        opzione.value = cat; // Imposta value
        opzione.textContent = cat; // Imposta testo a schermo
        filtroCategoriaSelect.appendChild(opzione); // Aggiunge al menu
    });
}

// Ascolta click sul pulsante "X" per chiudere modale
chiudiModaleBtn.addEventListener('click', () => {
    modale.classList.add('nascosto'); // Nasconde modale
});

// Funzione che aggiorna la tabella in base ai filtri di ricerca e categoria
function applicaFiltri() {
    const testoRicerca = cercaNomeInput.value.toLowerCase(); // Legge input in minuscolo
    const categoriaSelezionata = filtroCategoriaSelect.value; // Legge categoria scelta

    const prodottiFiltrati = tuttiIProdotti.filter(prodotto => { // Crea array filtrato
        const matchNome = prodotto.nome.toLowerCase().includes(testoRicerca); // Verifica match nome
        const matchCategoria = categoriaSelezionata === "" || prodotto.categoria === categoriaSelezionata; // Verifica match categoria
        return matchNome && matchCategoria; // Trattiene prodotto se entrambi validi
    });
    mostraProdotti(prodottiFiltrati); // Disegna tabella aggiornata
}

// Ascolta input testo per avviare filtro in tempo reale
cercaNomeInput.addEventListener('input', applicaFiltri);

// Ascolta cambio select per avviare filtro
filtroCategoriaSelect.addEventListener('change', applicaFiltri);

// Richiama la funzione principale per scaricare dati all'avvio
recuperaDati();