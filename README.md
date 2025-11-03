# Sapientia Latina

Un'applicazione web per scoprire ed esplorare famose citazioni latine.

---

## ‼️ ISTRUZIONI CRITICHE PER IL DEPLOY SU VERCEL ‼️

**ATTENZIONE:** L'errore `vite: command not found` che stai riscontrando **NON** è un problema del codice, ma un'impostazione nell'interfaccia utente di Vercel che sta sovrascrivendo la nostra configurazione.

Per risolvere definitivamente questo problema, segui questi passaggi:

1.  **Vai alla Dashboard di Vercel** e seleziona il tuo progetto (`sapientialatina.xyz`).
2.  Vai alla scheda **Settings**.
3.  Nel menu a sinistra, seleziona **General**.
4.  Trova la sezione **Build & Development Settings**.
5.  Cerca l'opzione **Framework Preset**. Molto probabilmente è impostata su "Vite".
6.  Clicca sul menu a tendina e seleziona **Other**.
7.  Clicca su **Save**.



Una volta salvata questa impostazione, Vercel smetterà di cercare di usare `vite` e seguirà correttamente le istruzioni di build definite nel nostro progetto.

**Per avviare un nuovo deploy dopo aver modificato l'impostazione:**
Vai alla scheda **Deployments**, clicca sui tre puntini (`...`) accanto all'ultimo tentativo di build e seleziona **Redeploy**. Assicurati di non avere modifiche non salvate.

Questo risolverà il problema di deploy una volta per tutte.
