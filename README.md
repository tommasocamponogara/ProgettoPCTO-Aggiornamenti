# Smart Factory Demo

Applicazione WEB sviluppata con frontend **Vite + React + TypeScript + Tailwind CSS**
e backend **Node.js + Express + SQLite**.

Il progetto include:

- gestione routing con **React Router**
- API REST backend con **Express**
- gestione CORS con **cors**
- persistenza dati locale con **sqlite3**

## TEST PERMESSI

## Tecnologie utilizzate

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- cors
- sqlite3

### Qualità codice / Tooling

- ESLint
- TypeScript Compiler (tsc)

---

## Requisiti

Installazioni obbligatorie:

- **Node.js** (versione consigliata: >= 18)
- **npm**

Verificare le versioni installate:

```bash
node -v
npm -v
```

## Passaggi installazione file Applicazione

1. Entrare nella cartella progetto

```bash
cd smart-factory-demo
```

2. Installare dipendenze frontend

```bash
npm install
```

3. Installare dipendenze backend

```bash
cd backend
npm install
cd ..
```

4. Avviare backend (API + generazione telemetrie casuali)

```bash
cd backend
npm start
```

5. Avviare frontend (in un secondo terminale)

```bash
npm run dev
```

6. Build produzione (opzionale)

```bash
npm run build
```

7. Preview build (opzionale)

```bash
npm run preview
```

### Note operative

- Il backend parte su `http://localhost:3000`.
- Il frontend Vite parte normalmente su `http://localhost:5173`.
- Le telemetrie vengono generate automaticamente all'avvio del backend.
