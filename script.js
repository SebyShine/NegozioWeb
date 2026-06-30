/**
 * Progetto finale JS - Prodotti Negozio Online
 * Crea una pagina che mostra una lista di prodotti recuperati da un'API (es. http://localhost:5000/api/products)
 * Ogni prodotto ha: id, nome, descrizione, categoria, prezzo, immagine, disponibilità
 * 
 * FUNZIONALITÀ:
 * 1. Recupera i prodotti da API (fetch GET)
 * 2. Mostra i prodotti in una tabella con immagine, nome, prezzo e disponibilità
 * 3. Quando l'utente clicca su un prodotto, mostra i dettagli in una sezione a parte (usa le classi "modal" e "nascosto" nella sezione)
 * 4. Nella sezione dei dettagli, mostra TUTTE le info del prodotto e un pulsante "Chiudi" per nascondere la sezione
 * 
 * Suggerimenti per l'implementazione:
 * - Crea una funzione che genera una riga di un singolo prodotto
 * - Crea una funzione che visualizza l'intera tabella dei prodotti (che richiama la funzione precedente per ogni prodotto)
 * - Crea una funzione che fa mostra la sezione dei dettagli con le info del prodotto passato per parametro
 * - Aggiungi un event listener a ogni riga della tabella per mostrare i dettagli del prodotto cliccato (usa la funzione di visualizzazione dei dettagli)
 * - Aggiungi un event listener al pulsante "Chiudi" per nascondere la sezione dei dettagli
 * 
 * Bonus:
 * - Aggiungi una barra di ricerca per filtrare i prodotti per nome (filtro testuale)
 * - Aggiungi un filtro per categoria (dropdown) per mostrare solo i prodotti di una certa categoria
 * Nota: i filtri devono lavorare insieme e sui dati già recuperati, senza fare nuove richieste all'API
 */

// API: ( puo essere localhost o il pc del docente)
const BASE_URL = 'http://192.168.1.102:5000/api';
// Selettori dall'HTML:
const id = document.querySelector('#');
const nome = document.querySelector('#');
const descrizione = document.querySelector('#');
const categoria = document.querySelector('#');
const prezzo = document.querySelector('#');
const immagine = document.querySelector('#');
const disponibilità = document.querySelector('#');

async function recuperaDati() {
        
}

