# Yu-Gi-Oh! Catalog 🃏 

Questo progetto è una semplice applicazione React per visualizzare un catalogo di carte, con funzionalità di filtro, visualizzazione dettagliata e gestione dei preferiti per utenti loggati.


## Indice

- [Funzionalità principali](#-funzionalità-principali)
- [Tecnologie utilizzate](#️-tecnologie-utilizzate)
- [Struttura del repository](#-struttura-del-repository)
- [Come configurare e avviare il progetto](#️-come-configurare-e-avviare-il-progetto)

## ✨ Funzionalità principali

- **Home - Carte in evidenza**  
  Mostra una selezione delle carte in evidenza.
  
- **Catalogo carte**  
  Visualizza tutte le carte con filtri su nome, tipo, attributo, livello, ATK e DEF. Supporta paginazione e navigazione tra le pagine.

- **Pagina dettaglio carta**  
  Mostra tutte le informazioni dettagliate della singola carta. Permette di aggiungere o rimuovere la carta dai preferiti solo se l'utente ha effettuato login.

- **Preferiti**  
  Visualizza la lista delle carte preferite dall'utente.

## 🛠️ Tecnologie utilizzate

- React (con React Router)
- Fetch API per comunicazione con backend REST
- CSS personalizzato per lo stile (catalogo, carte, paginazione)
- Backend in Flask per gestire dati carte e preferiti
- MongoDB come database NoSQL per la memorizzazione di carte e preferiti
- Ambiente in Python 3.12

## 📁 Struttura del repository

- `backend/`: contiene il codice del server Flask, le API REST per gestire le carte, gli utenti e i preferiti, e la logica di comunicazione con il database MongoDB.
- `dataset/`: include i file di dati originali delle carte, utilizzati per popolare e aggiornare il database MongoDB.
- `frontend/`: contiene il codice React per l’interfaccia utente, con tutte le pagine, i componenti, il routing e gli stili CSS personalizzati.
- `semilavorati/`: contiene la documentazione e la presentazione del progetto.

## ⚙️ Come configurare e avviare il progetto

### Prerequisiti

- [Node.js](https://nodejs.org/) (versione 14+ consigliata)
- [Python 3.12](https://www.python.org/downloads/)
- [MongoDB](https://www.mongodb.com/try/download/community) (installato e in esecuzione)

### Backend

1. Spostarsi nella cartella `backend`:
   ```bash
   cd backend
   ```
2. Creazione di un ambiente virtuale (consigliato):
   ```bash
   python -m venv venv
   source venv/bin/activate      # Linux/macOS
   venv\Scripts\activate         # Windows
   ```
3. Installare le dipendenze Python:
   ```bash
   pip install -r requirements.txt
   ```
4. Configurare la connessione a MongoDB (creare il file di configurazione `.env`).
5. Eseguire il file `import_cards.py` per popolare il database:
   ```bash
   python import_cards.py
   ```
7. Avviare il server Flask:
   ```bash
   flask run
   ```
### Frontend

1. Spostarsi nella cartella `frontend`:
   ```bash
   cd frontend
   ```
2. Installare le dipendenze npm:
   ```bash
   npm install
   ```
3. Avviare l'app React in modalità sviluppo:
   ```bash
   npm start
   ```


