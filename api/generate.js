// Importa le dipendenze necessarie da @google/genai utilizzando la sintassi ES Module
import { GoogleGenAI, Type } from "@google/genai";

// Definisce la funzione serverless utilizzando la sintassi export default
export default async (req, res) => {
  // --- 1. Validazione della richiesta ---
  // Accetta solo richieste di tipo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // --- 2. Controllo della configurazione del server ---
    if (!process.env.API_KEY) {
      console.error('La variabile d\'ambiente API_KEY non è impostata.');
      return res.status(500).json({ error: 'Errore di configurazione del server: Chiave API mancante. Per favore, imposta la variabile d\'ambiente API_KEY nel tuo hosting.' });
    }

    // --- 3. Parsing e validazione dell'input ---
    const { existingQuotes } = req.body;
    if (!Array.isArray(existingQuotes)) {
        return res.status(400).json({ error: 'existingQuotes must be an array.' });
    }

    // --- 4. Inizializzazione dell'API Gemini ---
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Crea una stringa con le frasi latine esistenti per evitare duplicati
    const existingLatinPhrases = existingQuotes.map(q => q.latin).join('; ');

    // --- 5. Definizione dello schema JSON per la risposta ---
    const quoteSchema = {
      type: Type.OBJECT,
      properties: {
        latin: { type: Type.STRING, description: "La citazione originale in latino." },
        author: {
          type: Type.OBJECT,
          description: "L'autore della citazione, tradotto in più lingue.",
          properties: {
            it: { type: Type.STRING }, en: { type: Type.STRING }, es: { type: Type.STRING }, fr: { type: Type.STRING }, de: { type: Type.STRING },
          },
          required: ['it', 'en', 'es', 'fr', 'de'],
        },
        source: {
          type: Type.OBJECT,
          description: "La fonte della citazione (es. libro, discorso), tradotta.",
          properties: {
            it: { type: Type.STRING }, en: { type: Type.STRING }, es: { type: Type.STRING }, fr: { type: Type.STRING }, de: { type: Type.STRING },
          },
          required: ['it', 'en', 'es', 'fr', 'de'],
        },
        translations: {
          type: Type.OBJECT,
          description: "La traduzione della citazione latina in più lingue.",
          properties: {
            it: { type: Type.STRING }, en: { type: Type.STRING }, es: { type: Type.STRING }, fr: { type: Type.STRING }, de: { type: Type.STRING },
          },
          required: ['it', 'en', 'es', 'fr', 'de'],
        },
        details: {
          type: Type.OBJECT,
          description: "Contesto dettagliato, applicazione pratica ed esempi per ogni lingua.",
          properties: {
            it: { type: Type.OBJECT, properties: { context: { type: Type.STRING }, application: { type: Type.STRING }, example: { type: Type.STRING } }, required: ['context', 'application', 'example'] },
            en: { type: Type.OBJECT, properties: { context: { type: Type.STRING }, application: { type: Type.STRING }, example: { type: Type.STRING } }, required: ['context', 'application', 'example'] },
            es: { type: Type.OBJECT, properties: { context: { type: Type.STRING }, application: { type: Type.STRING }, example: { type: Type.STRING } }, required: ['context', 'application', 'example'] },
            fr: { type: Type.OBJECT, properties: { context: { type: Type.STRING }, application: { type: Type.STRING }, example: { type: Type.STRING } }, required: ['context', 'application', 'example'] },
            de: { type: Type.OBJECT, properties: { context: { type: Type.STRING }, application: { type: Type.STRING }, example: { type: Type.STRING } }, required: ['context', 'application', 'example'] },
          },
          required: ['it', 'en', 'es', 'fr', 'de'],
        }
      },
      required: ['latin', 'author', 'source', 'translations', 'details'],
    };
    
    // --- 6. Chiamata all'API Gemini ---
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Genera un oggetto JSON per una nuova, famosa citazione latina. La citazione NON deve essere presente nella seguente lista: "${existingLatinPhrases}". La risposta deve contenere il testo originale in latino, l'autore, la sua fonte (es. "Odi, I, 11") e traduzioni per italiano, inglese, spagnolo, francese e tedesco. Anche i campi autore e fonte devono essere tradotti in tutte e 5 le lingue. Fornisci un contesto dettagliato, un'applicazione pratica e un esempio di utilizzo per ogni lingua all'interno dell'oggetto 'details'. La 'source' dovrebbe essere la citazione diretta, non una lunga descrizione. La descrizione lunga sull'origine va nel campo 'context'.`,
        config: {
          systemInstruction: "Sei un'API ad alta precisione che restituisce dati JSON su famose citazioni latine. Il tuo unico output deve essere un singolo oggetto JSON valido che si conformi rigorosamente allo schema fornito. Non includere alcun testo conversazionale, spiegazioni, scuse o formattazione markdown come ```json.",
          responseMimeType: 'application/json',
          responseSchema: quoteSchema
        }
    });

    // --- 7. Elaborazione della risposta ---
    const jsonString = response.text.trim();
    
    if (!jsonString) {
      throw new Error('Risposta vuota dal modello AI.');
    }
    
    const newQuoteData = JSON.parse(jsonString);

    // --- 8. Invio della risposta di successo ---
    return res.status(200).json(newQuoteData);

  } catch (error) {
    // --- 9. Gestione degli errori ---
    console.error('Errore in /api/generate:', error);
    // Fornisce un messaggio di errore più specifico in base al tipo
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'Impossibile analizzare la risposta dell\'IA.', details: error.message });
    }
    return res.status(500).json({ error: 'Si è verificato un errore interno del server.', details: error.message });
  }
};