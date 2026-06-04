// JavaScript Logic for Community Corner (comunidad.html)
// Handles recipe submissions and LocalStorage voting persistence.

// Initial default proposals to seed the page
const defaultProposals = [
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
];

// Helper to load proposals
function loadProposals() {
  const stored = localStorage.getItem("community_proposals");
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem("community_proposals", JSON.stringify(defaultProposals));
    return defaultProposals;
  }
}

// Helper to save proposals
function saveProposals(proposals) {
  localStorage.setItem("community_proposals", JSON.stringify(proposals));
}

// Helper to load voted proposal IDs
function loadVotedIds() {
  const stored = localStorage.getItem("community_voted_proposals");
  return stored ? JSON.parse(stored) : {}; // returns { "prop-id": "up" | "down" }
}

// Helper to save voted proposal IDs
function saveVotedIds(votedMap) {
  localStorage.setItem("community_voted_proposals", JSON.stringify(votedMap));
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
    counterEl.textContent = `${proposals.length} propuestas compartidas`;
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
    const categoryLabels = {
      hogar: "Hogar Ecológico",
      cuerpo: "Cuidado Personal",
      alimentos: "Alimentos Naturales",
      plantas: "Plantas y Huerto"
    };
    const catLabel = categoryLabels[prop.category] || "Otros";
    const userVote = votedMap[prop.id]; // "up", "down", or undefined

    card.innerHTML = `
      <div class="proposal-header">
        <span class="proposal-badge ${prop.category}">${catLabel}</span>
        <span class="proposal-author">Por: ${escapeHTML(prop.author)}</span>
      </div>
      <h3 class="proposal-title">${escapeHTML(prop.title)}</h3>
      
      <div class="proposal-content-section">
        <div class="proposal-section-label">Ingredientes y Materiales</div>
        <div class="proposal-ingredients">${escapeHTML(prop.ingredients)}</div>
        
        <div class="proposal-section-label">Preparación y Uso</div>
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
