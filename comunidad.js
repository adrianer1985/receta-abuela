// JavaScript Logic for Community Corner (comunidad.html)
// Handles recipe submissions and LocalStorage voting persistence.

const currentLang = window.location.pathname.includes("/en/") ? "en" :
                    window.location.pathname.includes("/fr/") ? "fr" :
                    window.location.pathname.includes("/pt/") ? "pt" : "es";

const UI_LABELS = {
  es: {
    hogar: "Hogar Ecológico",
    cuerpo: "Cuidado Personal",
    alimentos: "Alimentos Naturales",
    plantas: "Plantas y Huerto",
    otros: "Otros",
    sharedSuffix: "propuestas compartidas",
    by: "Por:",
    ingredients: "Ingredientes y Materiales",
    steps: "Preparación y Uso"
  },
  en: {
    hogar: "Ecological Home",
    cuerpo: "Personal Care",
    alimentos: "Natural Foods",
    plantas: "Plants & Garden",
    otros: "Others",
    sharedSuffix: "proposals shared",
    by: "By:",
    ingredients: "Ingredients and Materials",
    steps: "Preparation and Use"
  },
  fr: {
    hogar: "Maison Écologique",
    cuerpo: "Soin Personnel",
    alimentos: "Aliments Naturels",
    plantas: "Plantes & Potager",
    otros: "Autres",
    sharedSuffix: "propositions partagées",
    by: "Par :",
    ingredients: "Ingrédients et Matériaux",
    steps: "Préparation et Utilisation"
  },
  pt: {
    hogar: "Lar Ecológico",
    cuerpo: "Cuidados Pessoais",
    alimentos: "Alimentos Naturais",
    plantas: "Plantas & Horta",
    otros: "Outros",
    sharedSuffix: "propostas partilhadas",
    by: "Por:",
    ingredients: "Ingredientes e Materiais",
    steps: "Preparação e Uso"
  }
};

// Initial default proposals to seed the page
const defaultProposals = {
  es: [
    {
      id: "prop-1",
      author: "María Gómez (Sevilla)",
      title: "Tinte Capilar Natural de Piel de Cebolla",
      category: "cuerpo",
      ingredients: "Pieles secas de cebolla dorada (4 puñados), agua (1/2 litro), vinagre de manzana (1 cucharada).",
      steps: "1. Hierve las pieles de cebolla en el agua a fuego lento durante 30 minutos hasta obtener un caldo castaño oscuro.\n2. Cuela el líquido y, una vez tibio, añade el vinagre de manzana (sirve para fijar el color).\n3. Aplícalo tras el lavado habitual como último enjuague, dando un suave masaje. No lo aclares. Aporta reflejos dorados naturales y fortalece el cuero cabelludo.",
      upvotes: 24,
      downvotes: 2
    },
    {
      id: "prop-2",
      author: "Carlos Ruiz (Zaragoza)",
      title: "Ahuyentador de Hormigas con Limón y Vinagre",
      category: "hogar",
      ingredients: "Cáscaras de 3 limones, vinagre blanco (250 ml), agua destilada (250 ml), unas ramas de menta fresca.",
      steps: "1. Introduce las cáscaras de limón y la menta en un frasco de vidrio y cúbrelas con el vinagre.\n2. Deja macerar en un lugar oscuro durante 10 días.\n3. Cuela el líquido, mézclalo al 50% con agua destilada en un pulverizador y aplícalo en las zonas de paso de las hormigas. El aroma cítrico y ácido destruye sus rastros de feromonas sin matarlas.",
      upvotes: 18,
      downvotes: 1
    },
    {
      id: "prop-3",
      author: "Elena S. (Murcia)",
      title: "Insecticida de Ajo y Pimienta para Pulgones",
      category: "plantas",
      ingredients: "Cabeza de ajo (1 ud), pimienta cayena molida (1 cucharadita), agua de lluvia (1 litro), jabón neutro rallado (1 cucharada).",
      steps: "1. Tritura el ajo entero con un vaso de agua y déjalo reposar 24 horas.\n2. Añade la cayena y el resto del agua, y lleva a ebullición. Apaga al hervir.\n3. Cuela muy bien el líquido con un paño fino, disuelve el jabón neutro (actúa como fijador en las hojas) y pulveriza al atardecer sobre las plantas afectadas.",
      upvotes: 31,
      downvotes: 3
    }
  ],
  en: [
    {
      id: "prop-1",
      author: "Mary Gomez (Seville)",
      title: "Natural Onion Skin Hair Dye",
      category: "cuerpo",
      ingredients: "Dry golden onion skins (4 handfuls), water (1/2 liter), apple cider vinegar (1 tablespoon).",
      steps: "1. Boil the onion skins in water over low heat for 30 minutes until a dark brown broth is obtained.\n2. Strain the liquid and, once warm, add the apple cider vinegar (helps fix the color).\n3. Apply it after the usual wash as a final rinse, giving a gentle massage. Do not rinse. It provides natural golden highlights and strengthens the scalp.",
      upvotes: 24,
      downvotes: 2
    },
    {
      id: "prop-2",
      author: "Charles Ruiz (Zaragoza)",
      title: "Ant Repellent with Lemon and Vinegar",
      category: "hogar",
      ingredients: "Peels of 3 lemons, white vinegar (250 ml), distilled water (250 ml), a few sprigs of fresh mint.",
      steps: "1. Put the lemon peels and mint in a glass jar and cover them with the vinegar.\n2. Let macerate in a dark place for 10 days.\n3. Strain the liquid, mix it at 50% with distilled water in a spray bottle and apply it in the paths of the ants. The citrusy and acidic scent destroys their pheromone tracks without killing them.",
      upvotes: 18,
      downvotes: 1
    },
    {
      id: "prop-3",
      author: "Helen S. (Murcia)",
      title: "Garlic and Pepper Insecticide for Aphids",
      category: "plantas",
      ingredients: "Head of garlic (1 unit), ground cayenne pepper (1 teaspoon), rain water (1 liter), grated neutral soap (1 tablespoon).",
      steps: "1. Blend the whole garlic with a glass of water and let it sit for 24 hours.\n2. Add the cayenne and the rest of the water, and bring to a boil. Turn off once it boils.\n3. Strain the liquid very well with a fine cloth, dissolve the neutral soap (acts as a binder on the leaves) and spray at dusk on the affected plants.",
      upvotes: 31,
      downvotes: 3
    }
  ],
  fr: [
    {
      id: "prop-1",
      author: "Marie Gomez (Séville)",
      title: "Teinture Capillaire Naturelle en Pelure d'Oignon",
      category: "cuerpo",
      ingredients: "Pelures sèches d'oignon jaune (4 poignées), eau (1/2 litre), vinaigre de cidre (1 cuillère à soupe).",
      steps: "1. Faites bouillir les pelures d'oignon dans l'eau à feu doux pendant 30 minutes jusqu'à l'obtention d'un bouillon marron foncé.\n2. Filtrez le liquide et, une fois tiède, ajoutez le vinaigre de cidre (sert à fixer la couleur).\n3. Appliquez après le lavage habituel comme dernier rinçage, en massant doucement. Ne rincez pas. Apporte des reflets dorés naturels et fortifie le cuir chevelu.",
      upvotes: 24,
      downvotes: 2
    },
    {
      id: "prop-2",
      author: "Charles Ruiz (Saragosse)",
      title: "Répulsif Anti-fourmis au Citron et Vinaigre",
      category: "hogar",
      ingredients: "Écorces de 3 citrons, vinaigre blanc (250 ml), eau distillée (250 ml), quelques branches de menthe fraîche.",
      steps: "1. Introduisez les écorces de citron et la menthe dans un bocal en verre et couvrez-les de vinaigre.\n2. Laissez macérer dans un endroit sombre pendant 10 jours.\n3. Filtrez le liquide, mélangez-le à 50% avec de l'eau distillée dans un vaporisateur et appliquez sur les passages des fourmis. L'odeur d'acide citrique détruit leurs pistes de phéromones sans les tuer.",
      upvotes: 18,
      downvotes: 1
    },
    {
      id: "prop-3",
      author: "Hélène S. (Murcie)",
      title: "Insecticide à l'Ail et au Piment pour Pucerons",
      category: "plantas",
      ingredients: "Tête d'ail (1 unité), piment de Cayenne moulu (1 cuillère à café), eau de pluie (1 litre), savon neutre râpé (1 cuillère à soupe).",
      steps: "1. Mixez l'ail entier avec un verre d'eau et laissez reposer 24 heures.\n2. Ajoutez le Cayenne et le reste de l'eau, puis portez à ébullition. Éteignez dès que ça bout.\n3. Filtrez très bien le liquide avec un chiffon fin, dissolvez le savon neutre (sert de fixateur sur les feuilles) et vaporisez au crépuscule sur les plantes affectées.",
      upvotes: 31,
      downvotes: 3
    }
  ],
  pt: [
    {
      id: "prop-1",
      author: "Maria Gómez (Sevilha)",
      title: "Tintura Capilar Natural de Casca de Cebola",
      category: "cuerpo",
      ingredients: "Cascas secas de cebola dourada (4 punhados), água (1/2 litro), vinagre de maçã (1 colher de sopa).",
      steps: "1. Ferva as cascas de cebola na água em lume brando durante 30 minutos até obter um caldo castanho escuro.\n2. Coe o líquido e, uma vez morno, adicione o vinagre de maçã (serve para fixar a cor).\n3. Aplique após a lavagem habitual como último enxaguamento, massajando suavemente. Não enxague. Proporciona reflexos dourados naturais e fortalece o couro cabeludo.",
      upvotes: 24,
      downvotes: 2
    },
    {
      id: "prop-2",
      author: "Carlos Ruiz (Saragoça)",
      title: "Repelente de Formigas com Limão e Vinagre",
      category: "hogar",
      ingredients: "Cascas de 3 limões, vinagre branco (250 ml), água destilada (250 ml), alguns ramos de hortelã fresca.",
      steps: "1. Introduza as cascas de limão e a hortelã num frasco de vidro e cubra-as com o vinagre.\n2. Deixe macerar num local escuro durante 10 dias.\n3. Coe o líquido, misture-o a 50% com água destilada num pulverizador e aplique nas zonas de passagem das formigas. O aroma cítrico e ácido destrói os vestígios de feromonas sem as matar.",
      upvotes: 18,
      downvotes: 1
    },
    {
      id: "prop-3",
      author: "Helena S. (Múrcia)",
      title: "Inseticida de Alho e Pimenta para Pulgões",
      category: "plantas",
      ingredients: "Cabeça de alho (1 ud), pimenta caiena moída (1 colher de chá), água da chuva (1 livro), sabão neutro ralado (1 colher de sopa).",
      steps: "1. Triture o alho inteiro com um copo de água e deixe repousar 24 horas.\n2. Adicione a caiena e o resto da água, e leve à fervura. Desligue ao ferver.\n3. Coe muito bem o líquido com um pano fino, dissolva o sabão neutro (actua como fixador nas folhas) e pulverize ao entardecer sobre as plantas afetadas.",
      upvotes: 31,
      downvotes: 3
    }
  ]
};

// Helper to load proposals
function loadProposals() {
  const stored = localStorage.getItem("community_proposals_" + currentLang);
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem("community_proposals_" + currentLang, JSON.stringify(defaultProposals[currentLang]));
    return defaultProposals[currentLang];
  }
}

// Helper to save proposals
function saveProposals(proposals) {
  localStorage.setItem("community_proposals_" + currentLang, JSON.stringify(proposals));
}

// Helper to load voted proposal IDs
function loadVotedIds() {
  const stored = localStorage.getItem("community_voted_proposals_" + currentLang);
  return stored ? JSON.parse(stored) : {}; // returns { "prop-id": "up" | "down" }
}

// Helper to save voted proposal IDs
function saveVotedIds(votedMap) {
  localStorage.setItem("community_voted_proposals_" + currentLang, JSON.stringify(votedMap));
}

// Render proposals grid
function renderProposals() {
  const container = document.getElementById("proposals-list");
  const counterEl = document.getElementById("proposal-counter");
  if (!container) return;

  const proposals = loadProposals();
  const votedMap = loadVotedIds();

  // Update total counter
  if (counterEl) {
    counterEl.textContent = `${proposals.length} ${UI_LABELS[currentLang].sharedSuffix}`;
  }

  // Clear container
  container.innerHTML = "";

  // Sort proposals by net votes (upvotes - downvotes) descending
  const sortedProposals = [...proposals].sort((a, b) => {
    const netA = a.upvotes - a.downvotes;
    const netB = b.upvotes - b.downvotes;
    return netB - netA;
  });

  sortedProposals.forEach(prop => {
    const card = document.createElement("article");
    card.className = "proposal-card";
    
    // Category mapping label
    const catLabel = UI_LABELS[currentLang][prop.category] || UI_LABELS[currentLang].otros;
    const userVote = votedMap[prop.id]; // "up", "down", or undefined

    card.innerHTML = `
      <div class="proposal-header">
        <span class="proposal-badge ${prop.category}">${catLabel}</span>
        <span class="proposal-author">${UI_LABELS[currentLang].by} ${escapeHTML(prop.author)}</span>
      </div>
      <h3 class="proposal-title">${escapeHTML(prop.title)}</h3>
      
      <div class="proposal-content-section">
        <div class="proposal-section-label">${UI_LABELS[currentLang].ingredients}</div>
        <div class="proposal-ingredients">${escapeHTML(prop.ingredients)}</div>
        
        <div class="proposal-section-label">${UI_LABELS[currentLang].steps}</div>
        <div class="proposal-steps">${escapeHTML(prop.steps).replace(/\n/g, "<br>")}</div>
      </div>
      
      <div class="proposal-footer">
        <div class="vote-panel">
          <button class="btn-vote up ${userVote === 'up' ? 'voted-up' : ''}" data-id="${prop.id}" data-type="up" ${userVote ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
            <span>${prop.upvotes}</span>
          </button>
          
          <button class="btn-vote down ${userVote === 'down' ? 'voted-down' : ''}" data-id="${prop.id}" data-type="down" ${userVote ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" style="transform: rotate(180deg);">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
            <span>${prop.downvotes}</span>
          </button>
        </div>
      </div>
    `;

    // Setup voting event listeners
    const upBtn = card.querySelector(".btn-vote.up");
    const downBtn = card.querySelector(".btn-vote.down");

    if (upBtn && downBtn) {
      upBtn.addEventListener("click", () => handleVote(prop.id, "up"));
      downBtn.addEventListener("click", () => handleVote(prop.id, "down"));
    }

    container.appendChild(card);
  });
}

// Handle voting click
function handleVote(proposalId, voteType) {
  const votedMap = loadVotedIds();
  
  // Guard check
  if (votedMap[proposalId]) return;

  const proposals = loadProposals();
  const index = proposals.findIndex(p => p.id === proposalId);
  
  if (index !== -1) {
    if (voteType === "up") {
      proposals[index].upvotes += 1;
    } else {
      proposals[index].downvotes += 1;
    }
    
    // Save state
    saveProposals(proposals);
    votedMap[proposalId] = voteType;
    saveVotedIds(votedMap);
    
    // Re-render
    renderProposals();
  }
}

// Escape HTML utility to prevent XSS
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Init Page
document.addEventListener("DOMContentLoaded", () => {
  renderProposals();

  // Handle proposal form submission
  const form = document.getElementById("proposal-form");
  const successMessage = document.getElementById("proposal-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const author = document.getElementById("prop-author").value.trim();
      const title = document.getElementById("prop-title").value.trim();
      const category = document.getElementById("prop-category").value;
      const ingredients = document.getElementById("prop-ingredients").value.trim();
      const steps = document.getElementById("prop-steps").value.trim();

      if (author && title && category && ingredients && steps) {
        const proposals = loadProposals();
        
        // Create new proposal object
        const newProp = {
          id: "prop-" + Date.now(),
          author: author,
          title: title,
          category: category,
          ingredients: ingredients,
          steps: steps,
          upvotes: 0,
          downvotes: 0
        };

        // Add to list, save and re-render
        proposals.push(newProp);
        saveProposals(proposals);
        renderProposals();

        // Reset form and show success message
        form.reset();
        if (successMessage) {
          successMessage.style.display = "block";
          setTimeout(() => {
            successMessage.style.display = "none";
          }, 5000);
        }
      }
    });
  }
});
