const { GoogleGenAI, Type } = require("@google/genai");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { existingQuotes } = req.body;
    if (!Array.isArray(existingQuotes)) {
        return res.status(400).json({ error: 'existingQuotes must be an array.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const existingLatinPhrases = existingQuotes.map(q => q.latin).join('; ');

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a new, famous Latin quote that is NOT in the following list: ${existingLatinPhrases}. Provide the author, source (e.g., "Odes, I, 11"), translations, and detailed explanations for Italian, English, Spanish, French, and German. The author and source fields must also be translated into all 5 languages. The 'source' should be the direct citation, not a long description. The long description about the origin should go into the 'context' field inside 'details'.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              latin: { type: Type.STRING },
              author: {
                type: Type.OBJECT,
                properties: {
                  it: { type: Type.STRING }, en: { type: Type.STRING }, es: { type: Type.STRING }, fr: { type: Type.STRING }, de: { type: Type.STRING },
                },
                required: ['it', 'en', 'es', 'fr', 'de'],
              },
              source: {
                type: Type.OBJECT,
                properties: {
                  it: { type: Type.STRING }, en: { type: Type.STRING }, es: { type: Type.STRING }, fr: { type: Type.STRING }, de: { type: Type.STRING },
                },
                required: ['it', 'en', 'es', 'fr', 'de'],
              },
              translations: {
                type: Type.OBJECT,
                properties: {
                  it: { type: Type.STRING }, en: { type: Type.STRING }, es: { type: Type.STRING }, fr: { type: Type.STRING }, de: { type: Type.STRING },
                },
                required: ['it', 'en', 'es', 'fr', 'de'],
              },
              details: {
                type: Type.OBJECT,
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
          }
        }
    });
    
    // Trim whitespace from the response to ensure robust JSON parsing.
    const jsonString = response.text.trim();
    const newQuoteData = JSON.parse(jsonString);

    return res.status(200).json(newQuoteData);
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};