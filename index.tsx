/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  Heart,
  Languages,
  BookOpen,
  Lightbulb,
  Share2,
  Copy,
  Star,
  X,
  Eye,
  Volume2,
  Sun,
  Moon,
  AlertCircle,
  Shuffle,
} from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- DATA & TYPES ---

type Language = 'it' | 'en' | 'es' | 'fr' | 'de';
type Theme = 'light' | 'dark';
type ToastType = 'info' | 'error';
type ActiveTab = 'translation' | 'context' | 'application';

interface Quote {
  id: number;
  latin: string;
  author: Record<Language, string>;
  source: Record<Language, string>;
  translations: Record<Language, string>;
  details: Record<Language, {
    context: string;
    application: string;
    example: string;
  }>
}

const initialQuotes: Quote[] = [
  {
    id: 1,
    latin: 'Carpe diem, quam minimum credula postero.',
    author: { it: 'Orazio', en: 'Horace', es: 'Horacio', fr: 'Horace', de: 'Horaz' },
    source: { it: 'Odi, I, 11', en: 'Odes, I, 11', es: 'Odas, I, 11', fr: 'Odes, I, 11', de: 'Oden, I, 11' },
    translations: {
      it: "Cogli l'attimo, confida il meno possibile nel domani.",
      en: 'Seize the day, trusting as little as possible in the next.',
      es: 'Aprovecha el día, no confíes en el mañana.',
      fr: 'Cueille le jour, et ne crois pas au lendemain.',
      de: 'Nutze den Tag, vertraue so wenig wie möglich auf den Nächsten.',
    },
    details: {
      it: {
        context: "Parte di un'ode che invita Leuconoe a godersi il presente senza preoccuparsi del futuro, un tema centrale nella filosofia epicurea.",
        application: "Usa 'Carpe diem' su un post social per una foto di un momento speciale, o per motivare un amico a cogliere un'opportunità immediata invece di rimandare.",
        example: 'Esempio: "Questa gita improvvisata in montagna... Carpe diem!"',
      },
      en: { context: "Part of an ode that invites Leuconoe to enjoy the present without worrying about the future, a central theme in Epicurean philosophy.", application: "Use 'Carpe diem' on a social media post for a photo of a special moment, or to motivate a friend to seize an immediate opportunity instead of procrastinating.", example: 'Example: "This spontaneous trip to the mountains... Carpe diem!"' },
      es: { context: 'Parte de una oda que invita a Leucónoe a disfrutar del presente sin preocuparse por el futuro, un tema central en la filosofía epicúrea.', application: "Usa 'Carpe diem' en una publicación en redes sociales para una foto de un momento especial, o para motivar a un amigo a aprovechar una oportunidad inmediata en lugar de posponerla.", example: 'Ejemplo: "Este viaje espontáneo a las montañas... ¡Carpe diem!"' },
      fr: { context: "Partie d'une ode qui invite Leuconoé à profiter du présent sans se soucier de l'avenir, un thème central de la philosophie épicurienne.", application: "Utilisez 'Carpe diem' sur un post de réseau social pour une photo d'un moment spécial, ou pour motiver un ami à saisir une opportunità immédiate au lieu de procrastiner.", example: 'Exemple : "Ce voyage improvisé à la montagne... Carpe diem !"' },
      de: { context: 'Teil einer Ode, die Leukonoe einlädt, die Gegenwart zu genießen, ohne sich um die Zukunft zu sorgen, ein zentrales Thema in der epikureischen Philosophie.', application: "Verwenden Sie 'Carpe diem' in einem Social-Media-Beitrag für ein Foto eines besonderen Moments oder um einen Freund zu motivieren, eine sofortige Gelegenheit zu ergreifen, anstatt sie aufzuschieben.", example: 'Beispiel: "Dieser spontane Ausflug in die Berge... Carpe diem!"' },
    }
  },
  {
    id: 2,
    latin: 'Veni, vidi, vici.',
    author: { it: 'Giulio Cesare', en: 'Julius Caesar', es: 'Julio César', fr: 'Jules César', de: 'Julius Cäsar' },
    source: { it: 'Vite Parallele di Plutarco', en: "Plutarch's Parallel Lives", es: 'Vidas paralelas de Plutarco', fr: 'Vies parallèles de Plutarque', de: 'Parallelbiographien von Plutarch' },
    translations: { it: 'Venni, vidi, vinsi.', en: 'I came, I saw, I conquered.', es: 'Vine, vi, vencí.', fr: "Je suis venu, j'ai vu, j'ai vaincu.", de: 'Ich kam, ich sah, ich siegte.' },
    details: {
      it: { context: 'La celebre frase pronunciata da Giulio Cesare nel 47 a.C. dopo la rapida e vittoriosa battaglia di Zela. Riassume la sua efficienza militare e la sua determinazione.', application: 'Perfetta per una caption dopo aver superato una sfida difficile, come un esame o un progetto importante. Esprime successo rapido e totale.', example: 'Esempio: "Presentazione consegnata, cliente convinto. Veni, vidi, vici."' },
      en: { context: 'The famous phrase uttered by Julius Caesar in 47 BC after the swift and victorious Battle of Zela. It summarizes his military efficiency and determination.', application: 'Perfect for a caption after overcoming a tough challenge, like an exam or a major project. It expresses quick and total success.', example: 'Example: "Presentation delivered, client convinced. Veni, vidi, vici."' },
      es: { context: 'La famosa frase pronunciada por Julio César en el 47 a.C. tras la rápida y victoriosa batalla de Zela. Resume su eficacia militar y su determinación.', application: 'Perfecta para un pie de foto después de superar un desafío difícil, como un examen o un proyecto importante. Expresa un éxito rápido y total.', example: 'Ejemplo: "Presentación entregada, cliente convencido. Veni, vidi, vici."' },
      fr: { context: "La célèbre phrase prononcée par Jules César en 47 av. J.-C. après la bataille rapide et victorieuse de Zéla. Elle résume son efficacité militaire et sa détermination.", application: "Parfait pour une légende après avoir surmonté un défi difficile, comme un examen ou un projet majeur. Elle exprime un succès rapide et total.", example: 'Exemple : "Présentation livrée, client convaincu. Veni, vidi, vici."' },
      de: { context: 'Der berühmte Satz, den Julius Cäsar 47 v. Chr. nach der schnellen und siegreichen Schlacht von Zela aussprach. Er fasst seine militärische Effizienz und Entschlossenheit zusammen.', application: 'Perfekt für eine Bildunterschrift nach der Bewältigung einer schwierigen Herausforderung, wie einer Prüfung oder einem großen Projekt. Es drückt schnellen und vollständigen Erfolg aus.', example: 'Beispiel: "Präsentation geliefert, Kunde überzeugt. Veni, vidi, vici."' },
    }
  },
  { id: 3, latin: 'Alea iacta est.', author: { it: 'Giulio Cesare', en: 'Julius Caesar', es: 'Julio César', fr: 'Jules César', de: 'Julius Cäsar' }, source: { it: 'Svetonio, De vita Caesarum', en: 'Suetonius, De vita Caesarum', es: 'Suetonio, De vita Caesarum', fr: 'Suétone, De vita Caesarum', de: 'Sueton, De vita Caesarum' }, translations: { it: 'Il dado è tratto.', en: 'The die is cast.', es: 'La suerte está echada.', fr: 'Le sort en est jeté.', de: 'Der Würfel ist gefallen.' }, details: { it: { context: 'Attribuita a Cesare al momento di attraversare il fiume Rubicone con il suo esercito, un atto che scatenò la guerra civile. Significa che una decisione irrevocabile è stata presa.', application: "Da usare quando si prende una decisione importante e non si può più tornare indietro, come inviare una candidatura per il lavoro dei sogni o iniziare un'impresa.", example: 'Esempio: "Ho appena prenotato un volo di sola andata per iniziare la mia nuova vita all\'estero. Alea iacta est."' }, en: { context: 'Attributed to Caesar when crossing the Rubicon river with his army, an act that triggered the civil war. It means an irrevocable decision has been made.', application: 'Use it when making an important decision you cannot go back on, like applying for a dream job or starting a business.', example: 'Example: "I just booked a one-way flight to start my new life abroad. Alea iacta est."' }, es: { context: 'Atribuida a César al cruzar el río Rubicón con su ejército, un acto que desencadenó la guerra civil. Significa que se ha tomado una decisión irrevocable.', application: 'Para usar al tomar una decisión importante sin vuelta atrás, como postular a un trabajo soñado o empezar un negocio.', example: 'Ejemplo: "Acabo de reservar un vuelo de solo ida para empezar mi nueva vida en el extranjero. Alea iacta est."' }, fr: { context: 'Attribuée à César lorsqu\'il a traversé le fleuve Rubicon avec son armée, un acte qui a déclenché la guerre civile. Cela signifie qu\'une décision irrévocable a été prise.', application: 'À utiliser lors de la prise d\'une décision importante sur laquelle on ne peut plus revenir, comme postuler à l\'emploi de ses rêves ou démarrer une entreprise.', example: 'Exemple : "Je viens de réserver un aller simple pour commencer ma nouvelle vie à l\'étranger. Alea iacta est."' }, de: { context: 'Cäsar zugeschrieben, als er mit seiner Armee den Rubikon überquerte, was den Bürgerkrieg auslöste. Es bedeutet, dass eine unwiderrufliche Entscheidung getroffen wurde.', application: 'Zu verwenden, wenn man eine wichtige Entscheidung trifft, die nicht rückgängig gemacht werden kann, wie die Bewerbung für einen Traumjob oder die Gründung eines Unternehmens.', example: 'Beispiel: "Ich habe gerade einen Hinflug gebucht, um mein neues Leben im Ausland zu beginnen. Alea iacta est."' } } },
  { id: 4, latin: 'Cogito, ergo sum.', author: { it: 'Cartesio (René Descartes)', en: 'Descartes (René Descartes)', es: 'Descartes (René Descartes)', fr: 'Descartes (René Descartes)', de: 'Descartes (René Descartes)' }, source: { it: 'Discorso sul metodo', en: 'Discourse on the Method', es: 'Discurso del método', fr: 'Discours de la méthode', de: 'Abhandlung über die Methode' }, translations: { it: 'Penso, dunque sono.', en: 'I think, therefore I am.', es: 'Pienso, luego existo.', fr: 'Je pense, donc je suis.', de: 'Ich denke, also bin ich.' }, details: { it: { context: 'Anche se post-classica, è una delle frasi latine più famose. È il fondamento del pensiero razionalista di Cartesio: il solo fatto di dubitare e pensare dimostra la propria esistenza.', application: 'Ideale per un post riflessivo o una bio sui social che vuole esprimere un approccio intellettuale e introspettivo alla vita.', example: 'Esempio: "Bio di Twitter: \'Navigando tra dubbi e certezze. Cogito, ergo sum.\'"' }, en: { context: 'Although post-classical, it is one of the most famous Latin phrases. It is the foundation of Descartes\' rationalist thought: the very act of doubting and thinking proves one\'s existence.', application: 'Ideal for a reflective post or a social media bio that aims to express an intellectual and introspective approach to life.', example: 'Example: "Twitter Bio: \'Navigating between doubts and certainties. Cogito, ergo sum.\'"' }, es: { context: 'Aunque posclásica, es una de las frases latinas más famosas. Es el fundamento del pensamiento racionalista de Descartes: el mero hecho de dudar y pensar demuestra la propia existencia.', application: 'Ideal para una publicación reflexiva o una biografía en redes sociales que busque expresar un enfoque intelectual e introspectivo de la vida.', example: 'Ejemplo: "Biografía de Twitter: \'Navegando entre dudas y certezas. Cogito, ergo sum.\'"' }, fr: { context: 'Bien que post-classique, c\'est l\'une des phrases latines les plus célèbres. C\'est le fondement de la pensée rationaliste de Descartes : le simple fait de douter et de penser prouve sa propre existence.', application: 'Idéal pour un post réfléchi ou une bio sur les réseaux sociaux qui vise à exprimer une approche intellectuelle et introspective de la vie.', example: 'Exemple : "Bio Twitter : \'Naviguer entre doutes et certitudes. Cogito, ergo sum.\'"' }, de: { context: 'Obwohl nachklassisch, ist es einer der berühmtesten lateinischen Sätze. Es ist die Grundlage von Descartes\' rationalistischem Denken: Allein die Tatsache des Zweifelns und Denkens beweist die eigene Existenz.', application: 'Ideal für einen nachdenklichen Beitrag oder eine Social-Media-Bio, die einen intellektuellen und introspektiven Lebensansatz zum Ausdruck bringen möchte.', example: 'Beispiel: "Twitter-Bio: \'Navigieren zwischen Zweifeln und Gewissheiten. Cogito, ergo sum.\'"' } } },
  { id: 5, latin: 'In vino veritas.', author: { it: 'Plinio il Vecchio', en: 'Pliny the Elder', es: 'Plinio el Viejo', fr: "Pline l'Ancien", de: 'Plinius der Ältere' }, source: { it: 'Naturalis Historia', en: 'Naturalis Historia', es: 'Naturalis Historia', fr: 'Naturalis Historia', de: 'Naturalis Historia' }, translations: { it: 'Nel vino è la verità.', en: 'In wine, there is truth.', es: 'En el vino está la verdad.', fr: 'Dans le vin, la vérité.', de: 'Im Wein liegt die Wahrheit.' }, details: { it: { context: "Questo proverbio suggerisce che le persone tendono a rivelare i loro veri sentimenti e pensieri quando sono sotto l'effetto del vino, perdendo le loro inibizioni.", application: "Perfetto per una didascalia ironica per una foto di una serata con amici e un buon bicchiere di vino, alludendo a conversazioni sincere e divertenti.", example: 'Esempio: "Didascalia Instagram: \'Dopo il secondo bicchiere sono iniziate le grandi rivelazioni. In vino veritas, amici!\'"' }, en: { context: "This proverb suggests that people tend to reveal their true feelings and thoughts when under the influence of wine, losing their inhibitions.", application: "Perfect for a witty caption for a photo of an evening with friends and a good glass of wine, alluding to sincere and fun conversations.", example: 'Example: "Instagram caption: \'After the second glass, the great revelations began. In vino veritas, my friends!\'"' }, es: { context: "Este proverbio sugiere que las personas tienden a revelar sus verdaderos sentimientos y pensamientos cuando están bajo la influencia del vino, perdiendo sus inhibiciones.", application: "Perfecto para una leyenda ingeniosa para una foto de una noche con amigos y una buena copa de vino, aludiendo a conversaciones sinceras y divertidas.", example: "Ejemplo: \"Leyenda de Instagram: 'Después de la segunda copa, comenzaron las grandes revelaciones. ¡In vino veritas, amigos!'\"" }, fr: { context: "Ce proverbe suggère que les gens ont tendance à révéler leurs vrais sentiments et pensées sous l'influence du vin, en perdant leurs inhibitions.", application: "Parfait pour une légende pleine d'esprit pour une photo d'une soirée entre amis avec un bon verre de vin, faisant allusion à des conversations sincères et amusantes.", example: "Exemple : \"Légende Instagram : 'Après le deuxième verre, les grandes révélations ont commencé. In vino veritas, mes amis !'\"" }, de: { context: "Dieses Sprichwort besagt, dass Menschen dazu neigen, ihre wahren Gefühle und Gedanken unter dem Einfluss von Wein zu offenbaren und ihre Hemmungen zu verlieren.", application: "Perfekt für eine witzige Bildunterschrift für ein Foto von einem Abend mit Freunden und einem guten Glas Wein, das auf aufrichtige und lustige Gespräche anspielt.", example: "Beispiel: \"Instagram-Bildunterschrift: 'Nach dem zweiten Glas begannen die großen Enthüllungen. In vino veritas, meine Freunde!'\"" } } },
];
const languageMap: Record<Language, string> = { it: 'Italiano', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch' };
const uiTranslations = { it: { translate: 'Traduci', context: 'Contesto', practicalUse: 'Uso Pratico', exampleLabel: "Esempio d'uso", saveFavorite: 'Salva nei preferiti', removeFavorite: 'Rimuovi dai preferiti', showFavorites: 'Mostra preferiti', share: 'Condividi', copied: 'Copiato!', favoritesTitle: 'Le tue citazioni preferite', closeFavorites: 'Chiudi preferiti', closeFavoritesAria: 'Chiudi pannello preferiti', noFavorites: 'Non hai ancora nessuna citazione preferita. Clicca sul cuore per salvarne una!', showDetails: 'Mostra dettagli', showDetailsAria: (quote) => `Mostra dettagli per "${quote}"`, removeFromFavorites: 'Rimuovi dai preferiti', removeFromFavoritesAria: (quote) => `Rimuovi dai preferiti "${quote}"`, playPronunciation: 'Riproduci pronuncia', switchToLight: 'Passa al tema chiaro', switchToDark: 'Passa al tema scuro', loading: 'Carico la frase del giorno...', storageFailed: 'Impossibile salvare le preferenze.', shuffle: 'Nuova Citazione', shuffleAria: 'Ottieni una nuova citazione', newQuoteError: 'Impossibile generare una nuova citazione. Ti mostriamo un\'altra frase dalla nostra collezione.' }, en: { translate: 'Translate', context: 'Context', practicalUse: 'Practical Use', exampleLabel: 'Usage Example', saveFavorite: 'Save to favorites', removeFavorite: 'Remove from favorites', showFavorites: 'Show favorites', share: 'Share', copied: 'Copied!', favoritesTitle: 'Your Favorite Quotes', closeFavorites: 'Close favorites', closeFavoritesAria: 'Close favorites panel', noFavorites: 'You don\'t have any favorite quotes yet. Click the heart to save one!', showDetails: 'Show details', showDetailsAria: (quote) => `Show details for "${quote}"`, removeFromFavorites: 'Remove from favorites', removeFromFavoritesAria: (quote) => `Remove from favorites "${quote}"`, playPronunciation: 'Play pronunciation', switchToLight: 'Switch to light theme', switchToDark: 'Switch to dark theme', loading: 'Loading the quote of the day...', storageFailed: 'Could not save preferences.', shuffle: 'New Quote', shuffleAria: 'Get a new quote', newQuoteError: 'Could not generate a new quote. Showing another from our collection.' }, es: { translate: 'Traducir', context: 'Contexto', practicalUse: 'Uso Práctico', exampleLabel: 'Ejemplo de Uso', saveFavorite: 'Guardar en favoritos', removeFavorite: 'Eliminar de favoritos', showFavorites: 'Mostrar favoritos', share: 'Compartir', copied: '¡Copiado!', favoritesTitle: 'Tus Citas Favoritas', closeFavorites: 'Cerrar favoritos', closeFavoritesAria: 'Cerrar panel de favoritos', noFavorites: 'Aún no tienes citas favoritas. ¡Haz clic en el corazón para guardar una!', showDetails: 'Mostrar detalles', showDetailsAria: (quote) => `Mostrar detalles de "${quote}"`, removeFromFavorites: 'Eliminar de favoritos', removeFromFavoritesAria: (quote) => `Eliminar de favoritos "${quote}"`, playPronunciation: 'Reproducir pronunciación', switchToLight: 'Cambiar a tema claro', switchToDark: 'Cambiar a tema oscuro', loading: 'Cargando la cita del día...', storageFailed: 'No se pudieron guardar las preferencias.', shuffle: 'Nueva Cita', shuffleAria: 'Obtener una nueva cita', newQuoteError: 'No se pudo generar una nueva cita. Mostrando otra de nuestra colección.' }, fr: { translate: 'Traduire', context: 'Contexte', practicalUse: 'Usage Pratique', exampleLabel: "Exemple d'utilisation", saveFavorite: 'Enregistrer dans les favoris', removeFavorite: 'Retirer des favoris', showFavorites: 'Afficher les favoris', share: 'Partager', copied: 'Copié !', favoritesTitle: 'Vos Citations Préférées', closeFavorites: 'Fermer les favoris', closeFavoritesAria: 'Fermer le panneau des favoris', noFavorites: "Vous n'avez pas encore de citations préférées. Cliquez sur le cœur pour en enregistrer une !", showDetails: 'Afficher les détails', showDetailsAria: (quote) => `Afficher les détails de "${quote}"`, removeFromFavorites: 'Retirer des favoris', removeFromFavoritesAria: (quote) => `Retirer des favoris "${quote}"`, playPronunciation: 'Jouer la pronunciation', switchToLight: 'Passer au thème clair', switchToDark: 'Passer au thème sombre', loading: 'Chargement de la citation du jour...', storageFailed: 'Impossible d\'enregistrer les préférences.', shuffle: 'Nouvelle Citation', shuffleAria: 'Obtenir une nouvelle citation', newQuoteError: 'Impossible de générer une nouvelle citation. Affichage d\'une autre de notre collection.' }, de: { translate: 'Übersetzen', context: 'Kontext', practicalUse: 'Praktische Anwendung', exampleLabel: 'Anwendungsbeispiel', saveFavorite: 'Zu Favoriten hinzufügen', removeFavorite: 'Aus Favoriten entfernen', showFavorites: 'Favoriten anzeigen', share: 'Teilen', copied: 'Kopiert!', favoritesTitle: 'Deine Lieblingszitate', closeFavorites: 'Favoriten schließen', closeFavoritesAria: 'Favoriten-Panel schließen', noFavorites: 'Du hast noch keine Lieblingszitate. Klicke auf das Herz, um eines zu speichern!', showDetails: 'Details anzeigen', showDetailsAria: (quote) => `Details für "${quote}" anzeigen`, removeFromFavorites: 'Aus den Favoriten entfernen', removeFromFavoritesAria: (quote) => `Aus den Favoriten entfernen "${quote}"`, playPronunciation: 'Aussprache abspielen', switchToLight: 'Zum hellen Thema wechseln', switchToDark: 'Zum dunklen Thema wechseln', loading: 'Zitat des Tages wird geladen...', storageFailed: 'Einstellungen konnten nicht gespeichert werden.', shuffle: 'Neues Zitat', shuffleAria: 'Neues Zitat erhalten', newQuoteError: 'Neues Zitat konnte nicht generiert werden. Zeige ein anderes aus unserer Sammlung.' },
};
const LS_KEYS = {
  FAVORITES: 'verba_latina_favorites',
  THEME: 'verba_latina_theme',
};

// --- CUSTOM HOOKS ---

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

function useToast() {
  const [toast, setToast] = useState({ message: '', visible: false, type: 'info' as ToastType });
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 6000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, type, visible: true });
    timeoutRef.current = window.setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, duration);
  }, []);
  
  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}

// --- API SERVICE ---

const api = {
  /**
   * Fetches a new quote from the backend API.
   * @param existingQuotes - An array of current quotes to avoid duplicates.
   * @returns A promise that resolves to a new quote object.
   */
  async generateQuote(existingQuotes: Quote[]): Promise<Omit<Quote, 'id'>> {
    const controller = new AbortController();
    // Set an 8-second timeout for the API request
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ existingQuotes }),
        signal: controller.signal,
      });

      // If the response is not OK, handle the error case first.
      if (!response.ok) {
        let errorMessage = `La richiesta API è fallita con stato ${response.status}`;
        let errorDetails = '';
        try {
          // Try to parse the error response from our backend
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          errorDetails = errorData.details || '';
        } catch (e) {
          // If parsing fails, it means the server sent something else (e.g., HTML error page)
          errorDetails = await response.text(); // Get the raw text for debugging
          console.error("Could not parse error response as JSON:", errorDetails);
        }
        
        const error = new Error(errorMessage);
        (error as any).details = errorDetails;
        throw error;
      }

      // If response is OK, we can safely parse the JSON.
      const newQuoteData = await response.json();
      
      // Basic validation of the successful response data
      if (!newQuoteData || typeof newQuoteData.latin !== 'string' || !newQuoteData.latin) {
        throw new Error('Received invalid or incomplete quote data from API.');
      }
      
      return newQuoteData;
    } finally {
      // Clear the timeout regardless of the outcome
      clearTimeout(timeoutId);
    }
  },
};

// --- UI COMPONENTS ---

const Toast = ({ message, type, isVisible, onDismiss }) => {
  if (!isVisible) return null;
  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-4 p-4 rounded-lg shadow-lg text-white animate-fade-in-up ${type === 'error' ? 'bg-red-600' : 'bg-blue-500'}`} role="alert">
      <AlertCircle size={24} />
      <p>{message}</p>
      <button onClick={onDismiss} aria-label="Dismiss notification" className="p-1 rounded-full hover:bg-white/20"><X size={18} /></button>
    </div>
  );
};

const FavoritesPanel = ({ isOpen, onClose, favoriteQuotes, onRemove, onView, t, selectedLanguage }) => {
  useEffect(() => {
    const handleEsc = (event) => event.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex justify-center items-end transition-colors duration-300 ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="favorites-title">
      <div className={`w-full max-w-2xl max-h-[80vh] flex flex-col bg-[var(--color-card)] rounded-t-2xl shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)] flex-shrink-0">
          <h2 id="favorites-title" className="text-2xl font-semibold text-[var(--color-accent)]">{t.favoritesTitle}</h2>
          <button onClick={onClose} title={t.closeFavorites} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-button-hover)] hover:text-[var(--color-text-primary)] transition-colors" aria-label={t.closeFavoritesAria}><X size={20} /></button>
        </header>
        <div className="overflow-y-auto p-4">
          {favoriteQuotes.length > 0 ? (
            <ul className="space-y-3">
              {favoriteQuotes.map((quote, index) => (
                <li key={quote.id} className="bg-[var(--color-card-secondary)] rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="flex-1">
                    <p className="font-serif italic text-[var(--color-text-primary)] text-xl">"{quote.latin}"</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">- {(quote.author[selectedLanguage] || quote.author.it)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                     <button onClick={() => onView(quote)} title={t.showDetails} className="p-2 rounded-full bg-[var(--color-button)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors" aria-label={t.showDetailsAria(quote.latin)}><Eye size={18} /></button>
                     <button onClick={() => onRemove(quote.id)} title={t.removeFromFavorites} className="p-2 rounded-full bg-[var(--color-button)] text-red-500 hover:bg-red-500 hover:text-[var(--color-accent-text)] transition-colors" aria-label={t.removeFromFavoritesAria(quote.latin)}><X size={18} /></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (<p className="text-center text-[var(--color-text-secondary)] py-8">{t.noFavorites}</p>)}
        </div>
      </div>
    </div>
  );
};

const QuoteDisplay = ({ quote, author, source, onPlay, isPlaying, t }) => (
    <header key={quote.id} className="animate-fade-in">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
            <h1 className="font-serif text-5xl sm:text-6xl text-[var(--color-accent)] text-center italic">
                "{quote.latin}"
            </h1>
            <button onClick={onPlay} disabled={isPlaying} title={t.playPronunciation} aria-label={t.playPronunciation} className="p-2 rounded-full text-[var(--color-accent-muted)] hover:bg-[var(--color-button-hover)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                <Volume2 size={24} className={isPlaying ? 'animate-pulse' : ''} />
            </button>
        </div>
        <p className="text-center text-[var(--color-text-secondary)] mt-3 text-xl">- {author}, <i>{source}</i></p>
    </header>
);

const DetailsTabs = ({ quote, t, selectedLanguage, onLanguageChange, activeTab, onTabChange }) => {
    const currentDetails = quote.details[selectedLanguage] || quote.details.it;
    const TabButton = ({ tabName, label, Icon }) => (
        <button onClick={() => onTabChange(tabName)} title={label} aria-label={label} className={`flex-1 py-3 sm:py-2 px-4 flex items-center justify-center gap-2 text-base rounded-md transition-colors duration-300 ${activeTab === tabName ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]' : 'bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] text-[var(--color-text-secondary)]'}`} aria-pressed={activeTab === tabName}>
            <Icon size={18} />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="bg-[var(--color-card-secondary)] rounded-lg p-4">
            <div className="flex gap-2 mb-4">
                <TabButton tabName="translation" label={t.translate} Icon={Languages} />
                <TabButton tabName="context" label={t.context} Icon={BookOpen} />
                <TabButton tabName="application" label={t.practicalUse} Icon={Lightbulb} />
            </div>
            <div key={activeTab + selectedLanguage + quote.id} className="min-h-[120px] text-[var(--color-text-primary)] animate-fade-in-up">
                {activeTab === 'translation' && (
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(Object.keys(languageMap) as Language[]).map((lang) => (<button key={lang} onClick={() => onLanguageChange(lang)} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedLanguage === lang ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] font-semibold' : 'bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] text-[var(--color-text-secondary)]'}`} aria-pressed={selectedLanguage === lang}>{languageMap[lang]}</button>))}
                        </div>
                        <p className="italic text-xl">"{quote.translations[selectedLanguage]}"</p>
                    </div>
                )}
                {activeTab === 'context' && <p className="leading-relaxed text-lg">{currentDetails.context}</p>}
                {activeTab === 'application' && (
                    <div className="space-y-3">
                        <p className="leading-relaxed text-lg">{currentDetails.application}</p>
                        <blockquote className="border-l-2 border-[var(--color-accent-muted)] pl-3">
                            <p className="text-base font-semibold text-[var(--color-accent-darker)]">{t.exampleLabel}</p>
                            <p className="italic text-[var(--color-text-secondary)] text-base">{currentDetails.example}</p>
                        </blockquote>
                    </div>
                )}
            </div>
        </div>
    );
};

// FIX: Added onAnimationEnd to the component's props to fix a TypeScript error.
const ActionBar = ({ t, theme, onToggleTheme, isFavorite, onToggleFavorite, isPulsing, onShuffle, isShuffling, onShowFavorites, favoriteCount, onShare, copied, onAnimationEnd }) => (
    <footer className="flex items-center justify-around gap-3 pt-4 border-t border-[var(--color-border)]">
        <button onClick={onToggleTheme} title={theme === 'dark' ? t.switchToLight : t.switchToDark} className="p-3 rounded-full bg-[var(--color-button)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
        <button onClick={onToggleFavorite} onAnimationEnd={onAnimationEnd} title={isFavorite ? t.removeFavorite : t.saveFavorite} className="p-3 rounded-full bg-[var(--color-button)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors"><Heart size={20} className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''} ${isPulsing ? 'animate-heart-pulse' : ''}`} /></button>
        <button onClick={onShuffle} disabled={isShuffling} title={t.shuffle} aria-label={t.shuffleAria} className="p-3 rounded-full bg-[var(--color-button)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors disabled:opacity-50 disabled:cursor-wait"><Shuffle size={20} className={isShuffling ? 'animate-spin' : ''} /></button>
        <button onClick={onShowFavorites} title={t.showFavorites} className="p-3 rounded-full bg-[var(--color-button)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors relative">
            <Star size={20} />
            {favoriteCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-[var(--color-accent-text)]">{favoriteCount}</span>)}
        </button>
        <button onClick={onShare} title={copied ? t.copied : t.share} className="p-3 rounded-full bg-[var(--color-button)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors">{copied ? <Copy size={20} /> : <Share2 size={20} />}</button>
    </footer>
);

// --- MAIN APP COMPONENT ---

function App() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('it');
  const [activeTab, setActiveTab] = useState<ActiveTab>('translation');
  const [favorites, setFavorites] = useLocalStorage<number[]>(LS_KEYS.FAVORITES, []);
  const [copied, setCopied] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false); // For heart animation
  const { toast, showToast, dismissToast } = useToast();
  const [theme, setTheme] = useLocalStorage<Theme>(LS_KEYS.THEME, 'light');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = useMemo(() => uiTranslations[selectedLanguage], [selectedLanguage]);
  const currentQuote = useMemo(() => currentQuoteIndex !== null ? quotes[currentQuoteIndex] : null, [quotes, currentQuoteIndex]);
  const isFavorite = useMemo(() => currentQuote ? favorites.includes(currentQuote.id) : false, [favorites, currentQuote]);
  const favoriteQuotes = useMemo(() => quotes.filter(quote => favorites.includes(quote.id)), [favorites, quotes]);

  // App Initialization
  useEffect(() => {
    // Determine quote of the day
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
    setCurrentQuoteIndex(dayOfYear % initialQuotes.length);

    // Set initial theme based on system preference if not stored
    if (!localStorage.getItem(LS_KEYS.THEME) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
    setIsLoading(false);
  }, []);

  // Theme Management
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  // SEO & Metadata Management
  useEffect(() => {
    if (currentQuote) {
        const translation = currentQuote.translations[selectedLanguage];
        const author = currentQuote.author[selectedLanguage] || currentQuote.author.it;
        const newTitle = `Verba Latina: "${currentQuote.latin}"`;
        const newDescription = `"${currentQuote.latin}" (${translation}) - ${author}. Scopri il significato e l'uso di questa famosa citazione.`;
        
        document.title = newTitle;
        document.documentElement.lang = selectedLanguage;
        
        const updateMeta = (selector, content) => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('content', content);
        };
        updateMeta('meta[name="description"]', newDescription);
        updateMeta('meta[property="og:title"]', newTitle);
        updateMeta('meta[property="og:description"]', newDescription);
    }
  }, [currentQuote, selectedLanguage]);
  
  // Audio Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleShuffle = useCallback(async () => {
    setIsShuffling(true);

    const shuffleToExistingQuote = () => {
      const otherQuoteIndices = quotes.map((_, i) => i).filter(i => i !== currentQuoteIndex);
      if (otherQuoteIndices.length > 0) {
        const randomIndex = otherQuoteIndices[Math.floor(Math.random() * otherQuoteIndices.length)];
        setCurrentQuoteIndex(randomIndex);
      }
    };

    try {
      const newQuoteData = await api.generateQuote(quotes);
      const isDuplicate = quotes.some(
        q => q.latin.trim().toLowerCase() === newQuoteData.latin.trim().toLowerCase()
      );
      
      if (isDuplicate) {
        shuffleToExistingQuote();
      } else {
        const newQuote: Quote = { 
          ...newQuoteData, 
          id: Date.now() // Use a timestamp as a simple unique ID
        };
        setQuotes(prev => [...prev, newQuote]);
        setCurrentQuoteIndex(quotes.length);
      }
    } catch (error) {
      // L'oggetto 'error' ora contiene il messaggio user-friendly dalla nostra API
      console.error('Errore durante la generazione:', (error as any).details || error.message);
      
      // Mostra il messaggio di errore specifico dal backend. Se non c'è, usa quello di default.
      showToast(error.message || t.newQuoteError, 'error'); 
      
      shuffleToExistingQuote();
    } finally {
      setIsShuffling(false);
    }
  }, [quotes, currentQuoteIndex, t.newQuoteError, showToast]);

  const toggleFavorite = useCallback(() => {
    if (!currentQuote) return;
    if (!isFavorite) setIsPulsing(true);
    setFavorites(prev => isFavorite ? prev.filter(id => id !== currentQuote.id) : [...prev, currentQuote.id]);
  }, [isFavorite, currentQuote, setFavorites]);

  const playPronunciation = useCallback(() => {
    if (isPlaying || !currentQuote) return;
    if (audioRef.current) audioRef.current.pause();
    
    const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(currentQuote.latin)}&tl=la&client=tw-ob`);
    audioRef.current = audio;
    setIsPlaying(true);

    const onEnd = () => {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current = null;
    };
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onEnd);
    audio.play().catch(onEnd);
  }, [currentQuote, isPlaying]);

  const handleShare = useCallback(async () => {
    if (!currentQuote) return;
    const author = currentQuote.author[selectedLanguage] || currentQuote.author.it;
    const shareData = {
      title: document.title,
      text: `"${currentQuote.latin}" - ${author}\nScopri di più su Verba Latina!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Couldn't share or copy", err);
    }
  }, [currentQuote, selectedLanguage]);

  if (isLoading || !currentQuote) {
    return (
       <main className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--color-main-bg)] font-sans transition-colors duration-300">
         <div className="text-center"><p className="text-2xl font-serif text-[var(--color-accent)] animate-pulse">{uiTranslations.it.loading}</p></div>
       </main>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--color-main-bg)] font-sans transition-colors duration-300">
        <div className="w-full max-w-2xl bg-[var(--color-card)] text-[var(--color-text-primary)] rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6 transition-colors duration-300">
          <QuoteDisplay
            quote={currentQuote}
            author={currentQuote.author[selectedLanguage] || currentQuote.author.it}
            source={currentQuote.source[selectedLanguage] || currentQuote.source.it}
            onPlay={playPronunciation}
            isPlaying={isPlaying}
            t={t}
          />
          <DetailsTabs
            quote={currentQuote}
            t={t}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ActionBar
            t={t}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onAnimationEnd={() => setIsPulsing(false)}
            isPulsing={isPulsing}
            onShuffle={handleShuffle}
            isShuffling={isShuffling}
            onShowFavorites={() => setIsFavoritesOpen(true)}
            favoriteCount={favorites.length}
            onShare={handleShare}
            copied={copied}
          />
        </div>
      </main>
      <FavoritesPanel
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteQuotes={favoriteQuotes}
        onRemove={(id) => setFavorites(favs => favs.filter(favId => favId !== id))}
        onView={(quote) => {
            const index = quotes.findIndex(q => q.id === quote.id);
            if (index > -1) setCurrentQuoteIndex(index);
            setIsFavoritesOpen(false);
        }}
        t={t}
        selectedLanguage={selectedLanguage}
      />
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onDismiss={dismissToast} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
