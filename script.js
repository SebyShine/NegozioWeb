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
// CORRETTO: Lasciato solo /api così l'unione con /products sotto funziona
const BASE_URL = 'http://192.168.1.102:5000/api';

// Variabile globale per memorizzare i prodotti una volta scaricati dall'API
let tuttiIProdotti = [];
// Selettori dall'HTML per la Tabella e i Filtri:
const tabellaProdotti = document.querySelector('#tabellaProdotti');
const cercaNomeInput = document.querySelector('#cercaNome');
const filtroCategoriaSelect = document.querySelector('#filtroCategoria');

// Selettori dall'HTML per il Modale e i suoi campi interni:
const modale = document.querySelector('#modale');
const chiudiModaleBtn = document.querySelector('#chiudi');

const prodottoNome = document.querySelector('#prodottoNome');
const prodottoImmagine = document.querySelector('#prodottoImmagine');
const prodottoDescrizione = document.querySelector('#prodottoDescrizione');
const prodottoPrezzo = document.querySelector('#prodottoPrezzo');
const prodottoDisponibilita = document.querySelector('#prodottoDisponibilita');

// Funzione recuperaDati:
async function recuperaDati() {
    // Apro Try/Catch:
    try {
        // Effettuo la chiamata fetch verso l'endpoint dei prodotti (assumendo /products):
        const response = await fetch(`${BASE_URL}/products`);
        // Controllo risposta ok:
        if (!response.ok) {
            throw new Error(`Errore di rete: ${response.status}`);
        }
        // Conversione in JSON in una variabile:
        tuttiIProdotti = await response.json();

        // Inizializzo la pagina mostrando tutti i prodotti e configurando il filtro delle categorie
        // CORRETTO: Le funzioni vanno avviate QUI dentro, quando i dati sono effettivamente pronti!
        mostraProdotti(tuttiIProdotti);
        popolaCategorie(tuttiIProdotti);

    } catch (error) {
        // Dai l'errore:
        // CORRETTO: Cambiato "errore" in "error" per corrispondere al catch
        console.error("Si è verificato un errore nel recupero dei dati:", error);
        alert("Impossibile caricare i prodotti.");
    }
}

// Funzione mostraProdotti:
function mostraProdotti(prodotti) {
    // Svuoto tabella:
    tabellaProdotti.innerHTML = "";

    if (prodotti.length === 0) {
        tabellaProdotti.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nessun prodotto trovato.</td></tr>`;
        return;
    }
    // Ciclo per creare la riga del prodotto in tabella:
    prodotti.forEach(prodotto => {
        const rigaProdotto = creaRigaProdotto(prodotto);
        // CORRETTO: Cambiato "riga" in "rigaProdotto"
        tabellaProdotti.append(rigaProdotto);
    });
}

// Funzione creaRigaProdotto
function creaRigaProdotto(prodotto) {
    const tr = document.createElement('tr');

    // Mostro se è Disponibile o Non Disponibile:
    const classeDispo = prodotto.disponibilita ? 'available' : 'unavailable';
    const testoDispo = prodotto.disponibilita ? 'Disponibile' : 'Non disponibile';

    // Inserisco il contenuto HTML nella riga della tabella
    tr.innerHTML = `
        <td><img src="${prodotto.immagine}" alt="${prodotto.nome}"></td>
        <td><strong>${prodotto.nome}</strong></td>
        <td>€ ${prodotto.prezzo.toFixed(2)}</td>
        <td class="${classeDispo}">${testoDispo}</td>
    `;

    // Aggiungo l'event listener per aprire il modale al click sulla riga
    tr.addEventListener('click', () => {
        apriModaleDettagli(prodotto);
    });

    return tr;
}

function apriModaleDettagli(prodotto) {
    // Riempio i campi del modale con i dati del prodotto selezionato
    prodottoNome.textContent = prodotto.nome;
    prodottoImmagine.src = prodotto.immagine;
    prodottoImmagine.alt = prodotto.nome;
    prodottoDescrizione.innerHTML = `<strong>Descrizione:</strong> ${prodotto.descrizione}`;
    prodottoPrezzo.innerHTML = `<strong>Prezzo:</strong> € ${prodotto.prezzo.toFixed(2)}`;

    // Gestione visualizzazione disponibilità nel modale
    if (prodotto.disponibilita) {
        prodottoDisponibilita.innerHTML = `<strong>Disponibilità:</strong> <span class="available">Disponibile</span>`;
    } else {
        prodottoDisponibilita.innerHTML = `<strong>Disponibilità:</strong> <span class="unavailable">Non disponibile</span>`;
    }

    // Mostro il modale rimuovendo la classe 'nascosto'
    modale.classList.remove('nascosto');
}

function popolaCategorie(prodotti) {
    const categorie = [];

    // Raccolgo le categorie senza duplicati
    prodotti.forEach(p => {
        if (!categorie.includes(p.categoria)) {
            categorie.push(p.categoria);
        }
    });

    // Menu a tendina per ogni categoria individuata
    categorie.forEach(cat => {
        const opzione = document.createElement('option');
        opzione.value = cat;
        opzione.textContent = cat;
        filtroCategoriaSelect.appendChild(opzione);
    });
}

// Aggiungere anche l'event listener per chiudere il modale!
chiudiModaleBtn.addEventListener('click', () => {
    modale.classList.add('nascosto');
});

// --- FUNZIONE BONUS: Applica i filtri combinati (Nome + Categoria) ---
function applicaFiltri() {
    const testoRicerca = cercaNomeInput.value.toLowerCase();
    const categoriaSelezionata = filtroCategoriaSelect.value;

    const prodottiFiltrati = tuttiIProdotti.filter(prodotto => {
        const matchNome = prodotto.nome.toLowerCase().includes(testoRicerca);
        const matchCategoria = categoriaSelezionata === "" || prodotto.categoria === categoriaSelezionata;

        return matchNome && matchCategoria;
    });

    mostraProdotti(prodottiFiltrati);
}

// --- LISTENERS BONUS: Ascolta i cambiamenti sugli input dei filtri ---
cercaNomeInput.addEventListener('input', applicaFiltri);
filtroCategoriaSelect.addEventListener('change', applicaFiltri);

recuperaDati();