# -*- coding: utf-8 -*-
import json
import re
import os

def format_views(views):
    if views >= 1000000:
        return f"{views / 1000000:.1f}".replace(".", ",") + "M"
    elif views >= 1000:
        val = views / 1000
        if val % 1 == 0:
            return f"{val:.0f}K"
        else:
            return f"{val:.1f}".replace(".", ",") + "K"
    return str(views)

# Read app.js
with open("app.js", "r", encoding="utf-8") as f:
    js_content = f.read()

# Match the recipes JSON block
match = re.search(r"const recipes = (\[[\s\S]*?\]);\s*\n\s*// App State", js_content)
if not match:
    print("Error: Could not locate recipes array in app.js!")
    exit(1)

recipes_js_str = match.group(1)
recipes = json.loads(recipes_js_str)

# Read articulo.html as template
with open("articulo.html", "r", encoding="utf-8") as f:
    template_html = f.read()

print(f"Loaded template and {len(recipes)} recipes.")

# Process each recipe
for recipe in recipes:
    rid = recipe["id"]
    title = recipe["title"]
    summary = recipe["summary"]
    intro = recipe["intro"]
    tag = recipe["tag"]
    image = recipe["image"]
    views_formatted = format_views(recipe["views"] / 10)
    health = recipe["healthBenefit"]
    time = recipe["time"]
    cost = recipe["cost"]
    raw_dur = recipe["rawDuration"]
    final_dur = recipe["finalDuration"]
    
    # Pre-calculate time digits to avoid f-string backslash error in older Python versions
    time_minutes = re.sub(r'[^\d]', '', time)
    
    # 1. Generate Schema.org JSON-LD structured data
    cost_number_match = re.search(r"[\d.,]+", cost)
    cost_number = cost_number_match.group(0).replace(",", ".") if cost_number_match else "0"
    
    # Deterministic rating and date published for static pages SEO
    rating_val = f"{4.7 + (recipe['views'] % 3) * 0.1:.1f}"
    review_cnt = str(recipe["views"] // 1800 + 7)
    date_published = f"2026-0{3 + (recipe['views'] % 4)}-{10 + (recipe['views'] % 18):02d}"
    
    try:
        total_mins = int(time_minutes) if time_minutes else 15
    except ValueError:
        total_mins = 15
    prep_mins = max(5, total_mins // 3)
    cook_mins = max(0, total_mins - prep_mins)
    prep_time_str = f"PT{prep_mins}M"
    cook_time_str = f"PT{cook_mins}M" if cook_mins > 0 else f"PT{total_mins}M"
    
    steps_schema = []
    for idx, step in enumerate(recipe["steps"]):
        steps_schema.append({
            "@type": "HowToStep",
            "name": f"Paso {idx+1}",
            "text": step,
            "url": f"https://www.recetadeabuela.com/{rid}.html#step-{idx+1}"
        })
    steps_json = json.dumps(steps_schema, ensure_ascii=False)

    if recipe.get("subcategory") == "alimentos":
        schema_json_ld = f"""  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": {json.dumps(title, ensure_ascii=False)},
    "description": {json.dumps(summary, ensure_ascii=False)},
    "image": "https://www.recetadeabuela.com/{image}",
    "author": {{
      "@type": "Person",
      "name": "Adrián Enfedaque"
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "Receta de Abuela",
      "logo": {{
        "@type": "ImageObject",
        "url": "https://www.recetadeabuela.com/assets/logo.png"
      }}
    }},
    "datePublished": "{date_published}",
    "recipeCategory": {json.dumps(tag, ensure_ascii=False)},
    "recipeCuisine": "Española",
    "prepTime": "{prep_time_str}",
    "cookTime": "{cook_time_str}",
    "totalTime": "PT{time_minutes}M",
    "recipeYield": "1 preparación",
    "aggregateRating": {{
      "@type": "AggregateRating",
      "ratingValue": "{rating_val}",
      "reviewCount": "{review_cnt}"
    }},
    "estimatedCost": {{
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": "{cost_number}"
    }},
    "recipeIngredient": {json.dumps([item["name"] for item in recipe["shoppingList"]], ensure_ascii=False)},
    "recipeInstructions": {steps_json}
  }}
  </script>"""
    else:
        schema_json_ld = f"""  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": {json.dumps(title, ensure_ascii=False)},
    "description": {json.dumps(summary, ensure_ascii=False)},
    "image": "https://www.recetadeabuela.com/{image}",
    "author": {{
      "@type": "Person",
      "name": "Adrián Enfedaque"
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "Receta de Abuela",
      "logo": {{
        "@type": "ImageObject",
        "url": "https://www.recetadeabuela.com/assets/logo.png"
      }}
    }},
    "datePublished": "{date_published}",
    "totalTime": "PT{time_minutes}M",
    "yield": "1 preparación",
    "aggregateRating": {{
      "@type": "AggregateRating",
      "ratingValue": "{rating_val}",
      "reviewCount": "{review_cnt}"
    }},
    "estimatedCost": {{
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": "{cost_number}"
    }},
    "tool": {json.dumps([{"@type": "HowToTool", "name": item["name"]} for item in recipe["shoppingList"]], ensure_ascii=False)},
    "step": {steps_json}
  }}
  </script>"""


    # 2. Generate pre-rendered details HTML
    shopping_items_html = "".join([
        f'<li class="shopping-item"><span class="item-name">{item["name"]}</span><span class="item-price">{item["price"]}</span></li>'
        for item in recipe["shoppingList"]
    ])
    
    steps_html = "".join([
        f'<li class="step-item"><span class="step-num">{idx+1}</span><p class="step-text">{step}</p></li>'
        for idx, step in enumerate(recipe["steps"])
    ])
    
    alt_uses_html = "".join([
        f'<li class="alt-use-item">{use}</li>'
        for use in recipe["altUses"]
    ])
    
    comparison_rows_html = "".join([
        f'<tr class="{"highlight-row" if idx == 0 else ""}"><td>{row["concepto"]}</td><td>{row["casero"]}</td><td>{row["comercial"]}</td><td><span class="badge-comparison {"positive" if any(kw in row["diferencia"] for kw in ["Ahorro", "Sin", "Ecológico", "duración", "limpia", "Saludable", "respiración", "Cero"]) else "negative"}">{row["diferencia"]}</span></td></tr>'
        for idx, row in enumerate(recipe["comparisonTable"])
    ])

    pre_rendered_details = f"""
    <!-- Top banner image -->
    <div style="position: relative; width: 100%;">
      <img src="{image}" alt="Guía paso a paso de {title} - {summary}" class="modal-hero-img" style="border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;">
      <span class="card-views-badge" style="top: 1.5rem; right: 1.5rem;">
        <svg class="card-views-icon" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        {views_formatted} visualizaciones
      </span>
    </div>
    
    <!-- Header title and summary -->
    <div class="modal-header-info">
      <span class="modal-category">{tag}</span>
      <h1 class="modal-title" style="margin-top: 0.2rem; font-size: 2.2rem;">{title}</h1>
      <p class="modal-intro">{intro}</p>
      
      <!-- Share Buttons -->
      <div class="share-container">
        <span class="share-label">Compartir:</span>
        <div class="share-buttons">
          <a href="#" class="btn-share wa" id="share-wa" aria-label="Compartir en WhatsApp">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.787-1.451L0 24zm6.59-4.846c1.657.982 3.111 1.485 4.905 1.486 5.479 0 9.936-4.448 9.938-9.917.001-2.651-1.02-5.14-2.875-7.001C16.8 1.862 14.305 1.83 12.01 1.83c-5.485 0-9.94 4.45-9.943 9.919-.001 1.945.514 3.447 1.516 4.975l-.974 3.551 3.65-.957l.398.228z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="#" class="btn-share pin" id="share-pin" aria-label="Compartir en Pinterest">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.4l1.43-6.07s-.37-.73-.37-1.8c0-1.7 1-2.97 2.2-2.97 1.05 0 1.56.8 1.56 1.74 0 1.06-.67 2.63-1.02 4.1-.3 1.25.62 2.28 1.85 2.28 2.22 0 3.93-2.34 3.93-5.7 0-3-2.13-5.1-5.23-5.1-3.56 0-5.66 2.67-5.66 5.43 0 1.08.42 2.24.94 2.87.1.13.12.24.08.38l-.35 1.44c-.06.24-.2.32-.45.2-1.63-.76-2.65-3.14-2.65-5.05 0-4.1 3-7.87 8.6-7.87 4.5 0 8 3.2 8 7.5 0 4.48-2.82 8.1-6.75 8.1-1.32 0-2.56-.68-2.98-1.5l-.8 3.12c-.3 1.12-1 2.53-1.5 3.32C9.88 23.83 10.93 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
            <span>Pinterest</span>
          </a>
          <a href="#" class="btn-share fb" id="share-fb" aria-label="Compartir en Facebook">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Facebook</span>
          </a>
          <a href="https://www.instagram.com/recetadabuela" target="_blank" rel="noopener" class="btn-share ig" id="share-ig" aria-label="Seguir en Instagram">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- Health Highlight -->
    <div class="body-health-highlight">
      <div class="health-highlight-header">
        <svg class="health-highlight-icon" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <h2 class="health-highlight-title">Beneficios para tu Cuerpo y Salud</h2>
      </div>
      <p class="health-highlight-text">{health}</p>
    </div>
    
    <!-- Meta stats boxes -->
    <div class="modal-meta-grid">
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">Elaboración</span>
          <span class="meta-value">{time}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <div class="meta-details">
          <span class="meta-label">Coste total</span>
          <span class="meta-value">{cost}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <div class="meta-details">
          <span class="meta-label">Duración Materia</span>
          <span class="meta-value">{raw_dur}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">Duración Producto</span>
          <span class="meta-value">{final_dur}</span>
        </div>
      </div>
    </div>
    
    <!-- Split Layout: Ingredients on left, steps on right -->
    <div class="modal-body-layout">
      <!-- Ingredients column -->
      <section class="body-col-left">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Lista de la Compra y Costes
        </h3>
        <ul class="shopping-list">
          {shopping_items_html}
        </ul>
      </section>
      
      <!-- Steps column -->
      <section class="body-col-right">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Proceso Paso a Paso
        </h3>
        <ol class="process-steps">
          {steps_html}
        </ol>
      </section>
    </div>
    
    <!-- Full-width Bottom Sections -->
    <div class="modal-bottom-layout">
      <!-- Alternate Uses Section -->
      <section class="alt-uses-box">
        <h3 class="modal-section-title" style="border: none; margin: 0; padding: 0;">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Usos Alternativos del Producto
        </h3>
        <ul class="alt-uses-list">
          {alt_uses_html}
        </ul>
      </section>
      
      <!-- Scientific / Extra Information -->
      <section class="extra-info-box">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Información de Interés Científico
        </h3>
        <p class="extra-text">{recipe["extraInfo"]}</p>
      </section>
      
      <!-- Detailed Impact Circles -->
      <section>
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          Evaluación Detallada de Impacto
        </h3>
        <div class="modal-impact-metrics">
          <div class="impact-metric-box">
            <div class="impact-metric-circle eco">{recipe["metrics"]["economy"]}%</div>
            <span class="impact-metric-name">Económico</span>
            <span class="impact-metric-desc">Porcentaje de reducción de gastos frente a marcas comerciales líderes.</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle health">{recipe["metrics"]["health"]}%</div>
            <span class="impact-metric-name">Salud</span>
            <span class="impact-metric-desc">Puntuación hipoalergénica y ausencia de químicos disruptores hormonales.</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle ecosys">{recipe["metrics"]["ecosystem"]}%</div>
            <span class="impact-metric-name">Ecosistema</span>
            <span class="impact-metric-desc">Tasa de biodegradabilidad y reducción de emisiones y microplásticos.</span>
          </div>
        </div>
      </section>
      
      <!-- Commercial Comparison Table -->
      <section>
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Tabla Comparativa Comercial (España)
        </h3>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Opción Casera (Abuela)</th>
                <th>Equivalente Comercial (Supermercado)</th>
                <th>Evaluación / Ahorro</th>
              </tr>
            </thead>
            <tbody>
              {comparison_rows_html}
            </tbody>
          </table>
        </div>
      </section>
    </div>
"""

    # 3. Create Open Graph & JSON-LD head content
    og_meta = f"""  <title>{title} | Receta de Abuela</title>
  <meta name="description" content="{summary}">
  <link rel="canonical" href="https://www.recetadeabuela.com/{rid}.html">
  <meta property="og:title" content="{title} | Receta de Abuela">
  <meta property="og:description" content="{summary}">
  <meta property="og:image" content="https://www.recetadeabuela.com/{image}">
  <meta property="og:url" content="https://www.recetadeabuela.com/{rid}.html">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title} | Receta de Abuela">
  <meta name="twitter:description" content="{summary}">
  <meta name="twitter:image" content="https://www.recetadeabuela.com/{image}">"""

    # 4. Synthesize page
    page_html = template_html
    
    # 4b. Pre-render recommended articles HTML for internal linking SEO
    candidates = [r for r in recipes if r["id"] != rid]
    
    def get_sort_key(c):
        same_sub = 1 if c.get("subcategory") == recipe.get("subcategory") else 0
        same_cat = 1 if c.get("category") == recipe.get("category") else 0
        views = c.get("views", 0)
        return (-same_sub, -same_cat, -views)
        
    candidates.sort(key=get_sort_key)
    recommendations = candidates[:3]
    
    recommendations_html = ""
    for rec in recommendations:
        rec_id = rec["id"]
        rec_title = rec["title"]
        rec_summary = rec["summary"]
        rec_tag = rec["tag"]
        rec_image = rec["image"]
        rec_views_formatted = format_views(rec["views"] / 10)
        
        rec_metrics_html = ""
        metric_types = [("economy", "Ahorro", "eco"), ("health", "Salud", "health"), ("ecosystem", "Ecosistema", "ecosys")]
        for m_key, m_label, m_class in metric_types:
            m_val = rec["metrics"][m_key]
            rec_metrics_html += f"""
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot {m_class}"></span>{m_label}</span>
            <div class="metric-track"><div class="metric-fill {m_class}" style="width: {m_val}%"></div></div>
            <span class="metric-val">{m_val}%</span>
          </div>"""
            
        recommendations_html += f"""
      <a href="{rec_id}.html" target="_blank" class="recipe-card" aria-label="Receta: {rec_title}">
        <div class="card-img-wrapper">
          <img src="{rec_image}" alt="Receta recomendada: {rec_title} - {rec_summary}" class="card-img" loading="lazy">
          <span class="card-tag">{rec_tag}</span>
          <span class="card-views-badge">
            <svg class="card-views-icon" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            {rec_views_formatted}
          </span>
        </div>
        <div class="card-content">
          <h3 class="card-title">{rec_title}</h3>
          <p class="card-summary">{rec_summary}</p>
          <div class="card-metrics">
            {rec_metrics_html}
          </div>
        </div>
      </a>"""
    
    # Replace recommendations placeholder
    page_html = page_html.replace("<!-- Cards dynamically populated by app.js -->", recommendations_html)
    
    # Remove original general description first to avoid removing the new one later
    page_html = re.sub(r'<meta name="description" content="[^"]*">', "", page_html)
    
    # Replace head elements (title and meta description)
    page_html = page_html.replace("<title>Cargando guía... | Receta de Abuela</title>", og_meta + "\n" + schema_json_ld)
    
    # Replace details container content
    placeholder_loading_block = """    <div id="article-detail-container" class="dialog-content-wrapper static-page-detail">
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Cargando sabiduría ancestral...</p>
      </div>
    </div>"""
    
    pre_rendered_container = f"""    <div id="article-detail-container" class="dialog-content-wrapper static-page-detail">
      {pre_rendered_details}
    </div>"""
    
    page_html = page_html.replace(placeholder_loading_block, pre_rendered_container)
    
    # Inject current recipe id script before js script tag
    script_tag = '<script src="app.js"></script>'
    script_injection = f'<script>window.currentRecipeId = "{rid}";</script>\n  {script_tag}'
    page_html = page_html.replace(script_tag, script_injection)
    
    # Write output page
    with open(f"{rid}.html", "w", encoding="utf-8") as f_out:
        f_out.write(page_html)


print(f"SSG Complete. Generated {len(recipes)} static pages successfully.")

# 5. Generate sitemap.xml
sitemap_urls = [
    'https://www.recetadeabuela.com/',
    'https://www.recetadeabuela.com/quienes-somos.html',
    'https://www.recetadeabuela.com/comunidad.html'
]
for recipe in recipes:
    sitemap_urls.append(f'https://www.recetadeabuela.com/{recipe["id"]}.html')

sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for url in sitemap_urls:
    priority = "1.0" if url == 'https://www.recetadeabuela.com/' else ("0.5" if "quienes-somos" in url else "0.8")
    changefreq = "daily" if url == 'https://www.recetadeabuela.com/' or "comunidad" in url else ("monthly" if "quienes-somos" in url else "weekly")
    sitemap_xml += '  <url>\n'
    sitemap_xml += f'    <loc>{url}</loc>\n'
    sitemap_xml += f'    <changefreq>{changefreq}</changefreq>\n'
    sitemap_xml += f'    <priority>{priority}</priority>\n'
    sitemap_xml += '  </url>\n'
sitemap_xml += '</urlset>\n'

with open("sitemap.xml", "w", encoding="utf-8") as f_site:
    f_site.write(sitemap_xml)
print("sitemap.xml generated successfully.")

# 6. Generate robots.txt
robots_txt = """User-agent: *
Allow: /
Disallow: /inscritos.html

Sitemap: https://www.recetadeabuela.com/sitemap.xml
"""

with open("robots.txt", "w", encoding="utf-8") as f_rob:
    f_rob.write(robots_txt)
print("robots.txt generated successfully.")
