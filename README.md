# Sapientia Latina

Un'applicazione web per scoprire ed esplorare famose citazioni latine.

---

## 1. 🔑 Configurazione Chiave API (OBBLIGATORIO)

Per permettere all'applicazione di generare nuove citazioni, è **assolutamente necessario** configurare la tua chiave API di Google Gemini come variabile d'ambiente in Vercel.

**Segui questi passaggi:**

1.  **Vai alla Dashboard di Vercel** e seleziona il tuo progetto.
2.  Vai su **Settings -> Environment Variables**.
3.  Crea una nuova variabile:
    *   **Name:** `API_KEY`
    *   **Value:** Incolla qui la tua chiave API di Gemini.
4.  Assicurati che la variabile sia disponibile in tutti gli ambienti (Production, Preview, Development).
5.  **Salva** le modifiche.
6.  **Esegui un nuovo deploy:** Vai alla scheda **Deployments**, clicca sui tre puntini (`...`) accanto all'ultimo deployment e seleziona **Redeploy** per applicare la nuova variabile.

Senza questo passaggio, la funzione "Nuova Citazione" non potrà funzionare e mostrerà solo le citazioni già presenti.

---

## 2. ‼️ ISTRUZIONI PER IL DEPLOY SU VERCEL ‼️

Se riscontri un errore di build come `vite: command not found`, è dovuto a un'impostazione errata del "Framework Preset" su Vercel.

**Come risolvere:**

1.  Nella dashboard del tuo progetto Vercel, vai su **Settings -> General**.
2.  Trova la sezione **Build & Development Settings**.
3.  Imposta il **Framework Preset** su **Other**.
4.  **Salva** e riesegui il deploy.

Questo garantirà che Vercel utilizzi la configurazione di build corretta definita nel nostro progetto.