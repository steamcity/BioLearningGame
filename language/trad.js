// Définition des textes dans un objet
const texts = {
  "title": {
    "fr": "Jeux BioLearning",
    "en": "BioLearning Game",
    "es": "Juego de BioLearning"
  },
  "home": {
    "fr": "Accueil",
    "en": "Home",
    "es": "Inicio"
  },
  "game_part": {
    "fr": "Partie Jeux",
    "en": "Game Part",
    "es": "Parte del Juego"
  },
  "ai_part": {
    "fr": "Partie IA",
    "en": "AI Part",
    "es": "Parte de la IA"
  },
  "design_part": {
    "fr": "Partie Design",
    "en": "Design Part",
    "es": "Parte de Diseño"
  },
  "heading_ai_part": {
    "fr": "Partie IA",
    "en": "AI Part",
    "es": "Parte de la IA"
  },
  "heading_game_part": {
    "fr": "Partie Jeu",
    "en": "Game Part",
    "es": "Parte del Juego"
  },
  "heading_design_part": {
    "fr": "Partie Conception",
    "en": "Design Part",
    "es": "Parte de Diseño"
  },
  "speed_label": {
    "fr": "Vitesse",
    "en": "Speed",
    "es": "Velocidad"
  },
  "start_button": {
    "fr": "Démarrer",
    "en": "Start",
    "es": "Comenzar"
  },
  "reveal_button": {
    "fr": "Révéler",
    "en": "Reveal",
    "es": "Revelar"
  },
  "edit_button": {
    "fr": "Éditer",
    "en": "Edit",
    "es": "Editar"
  },
  "generation_label": {
    "fr": "Génération :",
    "en": "Generation:",
    "es": "Generación:"
  },
  "step_label": {
    "fr": "Étape :",
    "en": "Step:",
    "es": "Paso:"
  },
  "epsilon_label": {
    "fr": "Epsilon :",
    "en": "Epsilon:",
    "es": "Epsilon:"
  },
  "q_table_heading": {
    "fr": "Table Q [HAUT, BAS, GAUCHE, DROITE]",
    "en": "Q Table [UP, DOWN, LEFT, RIGHT]",
    "es": "Tabla Q [ARRIBA, ABAJO, IZQUIERDA, DERECHA]"
  },
  "history_table_headers": {
    "generation": {
      "fr": "Génération",
      "en": "Generation",
      "es": "Generación"
    },
    "win_lose": {
      "fr": "Gagner/Perdre",
      "en": "Win/Lose",
      "es": "Ganar/Perder"
    },
    "steps": {
      "fr": "Étapes",
      "en": "Steps",
      "es": "Pasos"
    }
  },
  "case_labels": {
    "damsel": {
      "fr": "Hôpital",
      "en": "Hospital",
      "es": "Hospital"
    },
    "villain": {
      "fr": "Bâtiment",
      "en": "Building",
      "es": "Edificio"
    },
    "hero": {
      "fr": "Ambulance",
      "en": "Ambulance",
      "es": "Ambulancia"
    },
    "empty": {
      "fr": "Vide",
      "en": "Empty",
      "es": "Vacío"
    }
  },
  "language_button": {
    "fr": "Langue",
    "en": "Language",
    "es": "Idioma"
  },
  "french": {
    "fr": "Français",
    "en": "French",
    "es": "Francés"
  },
  "english": {
    "fr": "English",
    "en": "English",
    "es": "Inglés"
  },
  "spanish": {
    "fr": "Español",
    "en": "Spanish",
    "es": "Español"
  },
  "footer": {
    "fr": "Financé par l'Union Européenne. Les opinions et points de vue exprimés sont toutefois ceux de l'auteur(s) uniquement et ne reflètent pas nécessairement ceux de l'Union Européenne ou de l'Agence exécutive européenne pour l'éducation et la culture (EACEA). Ni l'Union Européenne ni l'EACEA ne peuvent être tenues responsables.",
    "en": "Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.",
    "es": "Financiado por la Unión Europea. Las opiniones y puntos de vista expresados son, sin embargo, únicamente los del autor(es) y no reflejan necesariamente los de la Unión Europea o la Agencia Ejecutiva Europea de Educación y Cultura (EACEA). Ni la Unión Europea ni la EACEA pueden ser responsables de ellos."
  }
};

// Fonction pour récupérer la langue depuis l'URL
function getLanguageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'en'; // par défaut en anglais si lang non spécifié
}

// Fonction pour charger les textes en fonction de la langue
function loadTexts(lang) {
  const loadedTexts = {};
  for (const key in texts) {
    if (texts.hasOwnProperty(key)) {
      loadedTexts[key] = texts[key][lang];
    }
  }
  return loadedTexts;
}

// Fonction pour remplir les éléments HTML avec les textes chargés
function fillHTMLWithTexts(texts) {
  for (const key in texts) {
    if (texts.hasOwnProperty(key)) {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = texts[key];
      }
    }
  }
}

// Exécution du chargement des textes au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  const lang = getLanguageFromUrl();
  const loadedTexts = loadTexts(lang);
  fillHTMLWithTexts(loadedTexts);
});
