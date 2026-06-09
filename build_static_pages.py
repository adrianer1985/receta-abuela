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

def fix_translated_links(text):
    if not text:
        return text
    replacements = {
        "rocket-stove.html": "estufa-rocket.html",
        "softener-vinegar.html": "suavizante-vinagre.html",
        "mouthwash-clavo.html": "colutorio-clavo.html",
        "detergent-ivy.html": "detergente-hiedra.html",
        "candle-stove.html": "estufa-velas.html"
    }
    for translated, original in replacements.items():
        text = text.replace(translated, original)
    return text

# Load Spanish recipes JSON
with open("recipes_es.json", "r", encoding="utf-8") as f:
    recipes_es = json.load(f)

# Load other languages JSON
with open("recipes_en.json", "r", encoding="utf-8") as f:
    recipes_en = json.load(f)

with open("recipes_fr.json", "r", encoding="utf-8") as f:
    recipes_fr = json.load(f)

with open("recipes_pt.json", "r", encoding="utf-8") as f:
    recipes_pt = json.load(f)

# Write recipes_{lang}.js
with open("recipes_es.js", "w", encoding="utf-8") as f:
    f.write(f"window.recipes = {json.dumps(recipes_es, ensure_ascii=False)};")
with open("recipes_en.js", "w", encoding="utf-8") as f:
    f.write(f"window.recipes = {json.dumps(recipes_en, ensure_ascii=False)};")
with open("recipes_fr.js", "w", encoding="utf-8") as f:
    f.write(f"window.recipes = {json.dumps(recipes_fr, ensure_ascii=False)};")
with open("recipes_pt.js", "w", encoding="utf-8") as f:
    f.write(f"window.recipes = {json.dumps(recipes_pt, ensure_ascii=False)};")

print("Generated recipes_*.js datasets successfully.")

# Read templates
with open("articulo.html", "r", encoding="utf-8") as f:
    template_html = f.read()

# Locale dictionaries for template rendering
LOCALES = {
    'es': {
        'views_suffix': 'visualizaciones',
        'share_label': 'Compartir:',
        'wa_aria': 'Compartir en WhatsApp',
        'pin_aria': 'Compartir en Pinterest',
        'fb_aria': 'Compartir en Facebook',
        'ig_aria': 'Seguir en Instagram',
        'health_title': 'Beneficios para tu Cuerpo y Salud',
        'time_label': 'Elaboración',
        'cost_label': 'Coste total',
        'raw_dur_label': 'Duración Materia',
        'final_dur_label': 'Duración Producto',
        'shopping_title': 'Lista de la Compra y Costes',
        'steps_title': 'Proceso Paso a Paso',
        'alt_uses_title': 'Usos Alternativos del Producto',
        'scientific_title': 'Información de Interés Científico',
        'impact_title': 'Evaluación Detallada de Impacto',
        'impact_eco': 'Económico',
        'impact_eco_desc': 'Porcentaje de reducción de gastos frente a marcas comerciales líderes.',
        'impact_health': 'Salud',
        'impact_health_desc': 'Puntuación hipoalergénica y ausencia de químicos disruptores hormonales.',
        'impact_ecosys': 'Ecosistema',
        'impact_ecosys_desc': 'Tasa de biodegradabilidad y reducción de emisiones y microplásticos.',
        'table_title': 'Tabla Comparativa Comercial (España)',
        'table_header_concept': 'Característica',
        'table_header_home': 'Opción Casera (Abuela)',
        'table_header_comm': 'Equivalente Comercial (Supermercado)',
        'table_header_diff': 'Evaluación / Ahorro',
        'metric_eco': 'Ahorro',
        'metric_health': 'Salud',
        'metric_ecosys': 'Ecosistema',
        'meta_title_suffix': 'Receta de Abuela',
        'rec_aria_label': 'Receta:',
        'rec_title': 'Recetas recomendadas'
    },
    'en': {
        'views_suffix': 'views',
        'share_label': 'Share:',
        'wa_aria': 'Share on WhatsApp',
        'pin_aria': 'Share on Pinterest',
        'fb_aria': 'Share on Facebook',
        'ig_aria': 'Follow on Instagram',
        'health_title': 'Benefits for Your Body and Health',
        'time_label': 'Preparation',
        'cost_label': 'Total cost',
        'raw_dur_label': 'Material Duration',
        'final_dur_label': 'Product Duration',
        'shopping_title': 'Shopping List and Costs',
        'steps_title': 'Step-by-Step Process',
        'alt_uses_title': 'Alternative Product Uses',
        'scientific_title': 'Scientific Information',
        'impact_title': 'Detailed Impact Assessment',
        'impact_eco': 'Economic',
        'impact_eco_desc': 'Percentage of expense reduction compared to leading commercial brands.',
        'impact_health': 'Health',
        'impact_health_desc': 'Hypoallergenic score and absence of hormone-disrupting chemicals.',
        'impact_ecosys': 'Ecosystem',
        'impact_ecosys_desc': 'Biodegradability rate and reduction of emissions and microplastics.',
        'table_title': 'Commercial Comparison Table',
        'table_header_concept': 'Feature',
        'table_header_home': 'Homemade Option (Grandmother)',
        'table_header_comm': 'Commercial Equivalent (Supermarket)',
        'table_header_diff': 'Evaluation / Savings',
        'metric_eco': 'Savings',
        'metric_health': 'Health',
        'metric_ecosys': 'Ecosystem',
        'meta_title_suffix': "Grandmother's Recipe",
        'rec_aria_label': 'Recipe:',
        'rec_title': 'Recommended recipes'
    },
    'fr': {
        'views_suffix': 'vues',
        'share_label': 'Partager :',
        'wa_aria': 'Partager sur WhatsApp',
        'pin_aria': 'Partager sur Pinterest',
        'fb_aria': 'Partager sur Facebook',
        'ig_aria': 'Suivre sur Instagram',
        'health_title': 'Bénéfices pour votre Corps et votre Santé',
        'time_label': 'Préparation',
        'cost_label': 'Coût total',
        'raw_dur_label': 'Durée Matière',
        'final_dur_label': 'Durée Produit',
        'shopping_title': 'Liste de Courses et Coûts',
        'steps_title': 'Processus Étape par Étape',
        'alt_uses_title': 'Usages Alternatifs du Produit',
        'scientific_title': "Informations d'Intérêt Scientifique",
        'impact_title': "Évaluation Détaillée de l'Impact",
        'impact_eco': 'Économique',
        'impact_eco_desc': 'Pourcentage de réduction des dépenses par rapport aux principales marques.',
        'impact_health': 'Santé',
        'impact_health_desc': 'Score hypoallergénique et absence de produits chimiques perturbateurs endocriniens.',
        'impact_ecosys': 'Écosystème',
        'impact_ecosys_desc': 'Taux de biodégradabilité et réduction des émissions et microplastiques.',
        'table_title': 'Tableau Comparatif Commercial',
        'table_header_concept': 'Caractéristique',
        'table_header_home': 'Option Maison (Grand-mère)',
        'table_header_comm': 'Équivalent Commercial (Supermarché)',
        'table_header_diff': 'Évaluation / Économie',
        'metric_eco': 'Économie',
        'metric_health': 'Santé',
        'metric_ecosys': 'Écosystème',
        'meta_title_suffix': 'Recette de Grand-mère',
        'rec_aria_label': 'Recette :',
        'rec_title': 'Recettes recommandées'
    },
    'pt': {
        'views_suffix': 'visualizações',
        'share_label': 'Partilhar:',
        'wa_aria': 'Partilhar no WhatsApp',
        'pin_aria': 'Partilhar no Pinterest',
        'fb_aria': 'Partilhar no Facebook',
        'ig_aria': 'Seguir no Instagram',
        'health_title': 'Benefícios para o seu Corpo e Saúde',
        'time_label': 'Preparação',
        'cost_label': 'Custo total',
        'raw_dur_label': 'Duração Matéria',
        'final_dur_label': 'Duração Produto',
        'shopping_title': 'Lista de Compras e Custos',
        'steps_title': 'Processo Passo a Passo',
        'alt_uses_title': 'Usos Alternativos do Produto',
        'scientific_title': 'Informações de Interesse Científico',
        'impact_title': 'Avaliação Detalhada de Impacto',
        'impact_eco': 'Económico',
        'impact_eco_desc': 'Porcentagem de redução de despesas em comparação com marcas líderes.',
        'impact_health': 'Saúde',
        'impact_health_desc': 'Pontuação hipoalergênica e ausência de desreguladores hormonais.',
        'impact_ecosys': 'Ecossistema',
        'impact_ecosys_desc': 'Taxa de biodegradabilidade e redução de emissões e microplásticos.',
        'table_title': 'Tabela Comparativa Comercial',
        'table_header_concept': 'Característica',
        'table_header_home': 'Opção Caseira (Avó)',
        'table_header_comm': 'Equivalente Comercial (Supermercado)',
        'table_header_diff': 'Avaliação / Economia',
        'metric_eco': 'Economia',
        'metric_health': 'Saúde',
        'metric_ecosys': 'Ecossistema',
        'meta_title_suffix': 'Receita de Avó',
        'rec_aria_label': 'Receita:',
        'rec_title': 'Receitas recomendadas'
    }
}

UI_TRANSLATIONS = {
    'en': {
        '<html lang="es">': '<html lang="en">',
        'Todos los Artículos': 'All Articles',
        'Hogar Ecológico': 'Ecological Home',
        'Cuidado Personal': 'Personal Care',
        'Tecnología Ancestral': 'Ancestral Tech',
        'Comunidad': 'Community',
        'Quiénes Somos': 'About Us',
        'La sabiduría del bienestar': 'The wisdom of well-being',
        'Sostenibilidad, salud y economía para tu día a día': 'Sustainability, health and savings for your day to day',
        'Rescatamos la sabiduría tradicional a través de recetas caseras evaluadas científicamente\n        y adaptadas a la vida moderna. 100% natural, medido y analizado.': 'We rescue traditional wisdom through scientifically evaluated homemade recipes adapted to modern life. 100% natural, measured and analyzed.',
        'Rescatamos la sabiduría tradicional a través de recetas caseras evaluadas científicamente y adaptadas a la vida moderna. 100% natural, medido y analizado.': 'We rescue traditional wisdom through scientifically evaluated homemade recipes adapted to modern life. 100% natural, measured and analyzed.',
        'Únete al boletín semanal': 'Join the weekly newsletter',
        '¡Gracias por suscribirte! Pronto recibirás contenido nuevo.': 'Thank you for subscribing! You will receive new content soon.',
        'Buscar recetas (ej. lavanda, champú, cítricos...)': 'Search recipes (e.g. lavender, shampoo, citrus...)',
        'Ordenar:': 'Sort by:',
        'Más Popular': 'Most Popular',
        'Mayor Ahorro (€)': 'Highest Savings (€)',
        'Mejor para la Salud': 'Best for Health',
        'Menor Impacto Ambiental': 'Lowest Environmental Impact',
        'Cargando sabiduría ancestral...': 'Loading ancestral wisdom...',
        'El Cuaderno de la Abuela': "Grandmother's Notebook",
        'Únete a nuestra comunidad de vida consciente. Recibe un truco tradicional de ahorro, salud y ecología cada domingo directamente en tu correo.': 'Join our conscious living community. Receive a traditional savings, health and ecology tip every Sunday directly in your inbox.',
        'Suscribirse': 'Subscribe',
        'Temas Populares:': 'Popular Topics:',
        '#AhorroDoméstico': '#HomeSavings',
        '#CosméticaNatural': '#NaturalCosmetics',
        '#LimpiezaEcológica': '#EcoFriendlyCleaning',
        '#RemediosCaseros': '#HomeRemedies',
        '#CalefacciónEcológica': '#EcoHeating',
        '#EnergíaSolar': '#SolarEnergy',
        '#HuertoUrbano': '#UrbanGarden',
        '&copy; 2026 Receta de Abuela. Todos los derechos reservados.': "&copy; 2026 Grandmother's Recipe. All rights reserved.",
        'Autor: Adrián Enfedaque | Contacto:': 'Author: Adrián Enfedaque | Contact:',
        'Diseño Premium, Sostenible y Moderno para un estilo de vida consciente.': 'Premium, Sustainable and Modern Design for a conscious lifestyle.',
        'Administrar Suscriptores': 'Manage Subscribers',
        '<title>Receta de Abuela | La sabiduría del bienestar</title>': "<title>Grandmother's Recipe | The wisdom of well-being</title>",
        '<meta name="description"\n    content="Descubre recetas ancestrales y ecológicas para el cuidado personal y del hogar. La sabiduría del bienestar en formato moderno, sostenible y económico.">': '<meta name="description" content="Discover ancestral and ecological recipes for personal and home care. The wisdom of well-being in a modern, sustainable and affordable format.">',
        'content="Descubre recetas ancestrales y ecológicas para el cuidado personal y del hogar. La sabiduría del bienestar en formato moderno, sostenible y económico."': 'content="Discover ancestral and ecological recipes for personal and home care. The wisdom of well-being in a modern, sustainable and affordable format."',
        '<title>Quiénes Somos | Receta de Abuela</title>': "<title>About Us | Grandmother's Recipe</title>",
        'Conoce la historia detrás de Receta de Abuela. Un puente entre la sabiduría ancestral de mi abuela y el bienestar corporal, la salud y la sostenibilidad en el mundo moderno.': "Learn the story behind Grandmother's Recipe. A bridge between my grandmother's ancestral wisdom and body well-being, health and sustainability in the modern world.",
        'Nuestra Filosofía': 'Our Philosophy',
        'El Retorno a lo Esencial': 'The Return to the Essential',
        'Una reflexión sobre cómo la comodidad inmediata ha sustituido a la salud de nuestro cuerpo y al equilibrio con el planeta.': 'A reflection on how immediate convenience has replaced the health of our bodies and the balance with our planet.',
        'El legado de mi abuela': "My grandmother's legacy",
        'El proyecto <strong>Receta de Abuela</strong> nació en el patio trasero de mi infancia, observando a mi abuela recolectar hojas de hiedra para lavar la ropa y flores de caléndula para curar nuestras heridas. En su mundo, nada se desperdiciaba y todo tenía un propósito dictado por los ritmos de la naturaleza. Sus manos curtidas por la tierra no solo elaboraban soluciones prácticas, sino que guardaban un respeto sagrado por el equilibrio de la vida.': "The <strong>Grandmother's Recipe</strong> project was born in the backyard of my childhood, watching my grandmother collect ivy leaves to wash clothes and calendula flowers to heal our wounds. In her world, nothing was wasted and everything had a purpose dictated by the rhythms of nature. Her hands weathered by the earth not only crafted practical solutions, but held a sacred respect for the balance of life.",
        '"Nos dijeron que avanzábamos hacia una vida mejor, pero a menudo la comodidad del envase de plástico nos hizo olvidar la pureza de lo que introducimos en nuestro cuerpo."': '"They told us we were moving towards a better life, but often the convenience of the plastic container made us forget the purity of what we put in our bodies."',
        'El dilema moderno: Comodidad vs. Bienestar': 'The modern dilemma: Convenience vs. Well-being',
        'Al adentrarme en la vida urbana moderna, me di cuenta de una desconcertante paradoja: la llamada "evolución" nos ha llevado a un punto donde <strong>la comodidad superficial ha suplantado al verdadero bienestar</strong>. Hemos cambiado la salud física a largo plazo y la sostenibilidad de nuestro ecosistema por el alivio instantáneo de soluciones químicas prefabricadas.': 'Entering modern urban life, I realized a baffling paradox: so-called "evolution" has brought us to a point where <strong>superficial convenience has supplanted true well-being</strong>. We have traded long-term physical health and the sustainability of our ecosystem for the instant relief of prefabricated chemical solutions.',
        'Nos hemos acostumbrado a comprar detergentes repletos de fragancias artificiales y disruptores endocrinos sintéticos que quedan impregnados en las fibras de nuestra ropa y son absorbidos diariamente por nuestra piel. Utilizamos pastas dentales comerciales cargadas de flúor sintético y tensoactivos industriales (como el lauril sulfato de sodio) que dañan las encías y alteran nuestro microbioma bucal. Incluso para limpiar las encimeras de nuestras cocinas, rociamos vapores de amoníaco o cloro que irritan directamente nuestros pulmones y ojos.': 'We have become accustomed to buying detergents full of artificial fragrances and synthetic endocrine disruptors that remain impregnated in the fibers of our clothes and are absorbed daily by our skin. We use commercial toothpastes loaded with synthetic fluoride and industrial surfactants (such as sodium lauryl sulfate) that damage gums and alter our oral microbiome. Even to clean our kitchen countertops, we spray ammonia or chlorine fumes that directly irritate our lungs and eyes.',
        'Un puente entre la ciencia y la tradición': 'A bridge between science and tradition',
        'Esta página web no es un manifiesto de rechazo a la tecnología ni una llamada a volver al pasado de forma radical. Es una invitación consciente a <strong>reflexionar sobre el coste real de nuestra comodidad diaria</strong>.': 'This website is not a manifesto rejecting technology or a radical call to return to the past. It is a conscious invitation to <strong>reflect on the real cost of our daily convenience</strong>.',
        'Cada receta compartida aquí ha sido seleccionada de la sabiduría popular, pero evaluada y adaptada a la vida moderna bajo un análisis riguroso de impacto. Queremos demostrar con números, ingredientes limpios y explicaciones claras que es perfectamente viable cuidar de tu cuerpo, reducir drásticamente los tóxicos a los que te expones y vivir en armonía ecológica sin sacrificar tu economía. Es el momento de recuperar el control de nuestro bienestar, volviendo a lo esencial de la mano de la ciencia.': 'Each recipe shared here has been selected from popular wisdom, but evaluated and adapted to modern life under a rigorous impact analysis. We want to prove with numbers, clean ingredients and clear explanations that it is perfectly viable to care for your body, reduce drastically the toxins you are exposed to and live in ecological harmony without sacrificing your finances. It is time to regain control of our well-being, returning to the essentials hand in hand with science.',
        'Sobre el autor': 'About the author',
        'El autor y creador de este espacio es <strong>Adrián Enfedaque</strong>, nieto de la abuela cuya sabiduría inspiró este proyecto. A través de este portal, Adrián busca rescatar las recetas de su infancia y combinarlas con análisis de impacto contemporáneos para facilitar el acceso a un bienestar consciente, práctico y ecológico.': "The author and creator of this space is <strong>Adrián Enfedaque</strong>, grandson of the grandmother whose wisdom inspired this project. Through this portal, Adrián seeks to rescue the recipes of his childhood and combine them with contemporary impact analysis to facilitate access to a conscious, practical and ecological well-being.",
        'Si deseas ponerte en contacto para compartir sugerencias, aportar alguna receta tradicional de tu familia o resolver dudas, puedes escribir directamente a: <strong><a href="mailto:info@recetadeabuela.com" style="color: var(--color-primary); text-decoration: underline;">info@recetadeabuela.com</a></strong>.': 'If you wish to get in touch to share suggestions, contribute a traditional recipe from your family or resolve doubts, you can write directly to: <strong><a href="mailto:info@recetadeabuela.com" style="color: var(--color-primary); text-decoration: underline;">info@recetadeabuela.com</a></strong>.',
        'Explorar Recetas Ancestrales': 'Explore Ancestral Recipes',
        '<title>Comunidad | Receta de Abuela</title>': "<title>Community | Grandmother's Recipe</title>",
        'Propón y comparte tus propias recetas tradicionales de la abuela. Vota las mejores ideas ecológicas, cosmética natural, huerto y ahorro doméstico.': "Propose and share your own traditional grandmother's recipes. Vote for the best ecological ideas, natural cosmetics, garden and home savings.",
        'El Rincón de la Comunidad': 'The Community Corner',
        '¿Tienes alguna receta tradicional que usas en tu día a día o recuerdas de tus abuelos? Compártela con nosotros. También puedes votar las propuestas existentes para ayudarnos a decidir qué guías detalladas publicar a continuación.': 'Do you have a traditional recipe that you use in your daily life or remember from your grandparents? Share it with us. You can also vote on existing proposals to help us decide which detailed guides to publish next.',
        'Un espacio para colaborar y compartir sabiduría': 'A space to collaborate and share wisdom',
        'Este es nuestro punto de encuentro. Queremos rescatar y mantener viva la sabiduría del bienestar tradicional, y para ello <strong>necesitamos tu ayuda</strong>. Este espacio está diseñado para que todos colaboremos en hacer este recetario ancestral cada vez más grande y completo.': 'This is our meeting point. We want to rescue and keep alive the wisdom of traditional well-being, and for that <strong>we need your help</strong>. This space is designed for all of us to collaborate in making this ancestral recipe book bigger and more complete.',
        '<strong>Comparte tus propias recetas:</strong> Sube esos remedios, fórmulas de limpieza o recetas de cocina natural que has heredado de tu familia o que aplicas en tu hogar.': '<strong>Share your own recipes:</strong> Upload those remedies, cleaning formulas or natural cooking recipes that you have inherited from your family or that you apply in your home.',
        '<strong>Propón variantes y mejoras:</strong> ¿Haces alguna de nuestras recetas de forma diferente? ¿Usas otro ingrediente o truco para mejorarla? Comparte tu versión aquí.': '<strong>Propose variations and improvements:</strong> Do you make any of our recipes differently? Do you use another ingredient or trick to improve it? Share your version here.',
        '<strong>Vota por las mejores ideas:</strong> Si ves una propuesta interesante de otro miembro de la comunidad, dale tu voto positivo (👍). Esto nos ayudará a saber cuáles son las favoritas para desarrollarlas y publicarlas como guías detalladas en la web principal.': '<strong>Vote for the best ideas:</strong> If you see an interesting proposal from another community member, give it your positive vote (👍). This will help us know which ones are favorites to develop and publish them as detailed guides on the main site.',
        'Propón tu Receta': 'Propose your Recipe',
        'Comparte ese truco tradicional que cuida de la salud, el bolsillo o el planeta.': 'Share that traditional trick that cares for health, wallet or the planet.',
        'Tu Nombre y Ciudad': 'Your Name and City',
        'Título de la Propuesta': 'Proposal Title',
        'Categoría principal': 'Main category',
        'Selecciona una opción': 'Select an option',
        'Plantas y Huerto': 'Plants and Garden',
        'Alimentos Naturales': 'Natural Foods',
        'Ingredientes y Materiales': 'Ingredients and Materials',
        'Paso a paso / Preparación': 'Step by step / Preparation',
        'Explica cómo se elabora y se utiliza este remedio...': 'Explain how this remedy is prepared and used...',
        'Enviar Propuesta': 'Submit Proposal',
        '¡Propuesta enviada con éxito! Ya se muestra en el listado de la comunidad.': 'Proposal submitted successfully! It is now shown in the community list.',
        'Propuestas de la Comunidad': 'Community Proposals',
        'Cargando sabiduría de la comunidad...': 'Loading community wisdom...'
    },
    'fr': {
        '<html lang="es">': '<html lang="fr">',
        'Todos los Artículos': 'Tous les Articles',
        'Hogar Ecológico': 'Maison Écologique',
        'Cuidado Personal': 'Soin Personnel',
        'Tecnología Ancestral': 'Technologie Ancestrale',
        'Comunidad': 'Communauté',
        'Quiénes Somos': 'Qui Sommes-Nous',
        'La sabiduría del bienestar': 'La sagesse du bien-être',
        'Sostenibilidad, salud y economía para tu día a día': 'Durabilité, santé et économie au quotidien',
        'Rescatamos la sabiduría tradicional a través de recetas caseras evaluadas científicamente\n        y adaptadas a la vida moderna. 100% natural, medido y analizado.': 'Nous sauvons la sagesse traditionnelle à travers des recettes maison scientifiquement évaluées et adaptées à la vie moderne. 100% naturel, mesuré et analysé.',
        'Rescatamos la sabiduría tradicional a través de recetas caseras evaluadas científicamente y adaptadas a la vida moderna. 100% natural, medido y analizado.': 'Nous sauvons la sagesse traditionnelle à travers des recettes maison scientifiquement évaluées et adaptées à la vie moderne. 100% naturel, mesuré et analysé.',
        'Únete al boletín semanal': 'Rejoindre la newsletter',
        '¡Gracias por suscribirte! Pronto recibirás contenido nuevo.': 'Merci pour votre abonnement ! Vous recevrez bientôt du nouveau contenu.',
        'Buscar recetas (ej. lavanda, champú, cítricos...)': 'Rechercher des recettes (ex. lavande, shampooing, agrumes...)',
        'Ordenar:': 'Trier par :',
        'Más Popular': 'Plus Populaire',
        'Mayor Ahorro (€)': 'Plus d\'Économies (€)',
        'Mejor para la Salud': 'Meilleur pour la Santé',
        'Menor Impacto Ambiental': 'Moindre Impact Environnemental',
        'Cargando sabiduría ancestral...': 'Chargement de la sagesse ancestrale...',
        'El Cuaderno de la Abuela': 'Le Carnet de la Grand-mère',
        'Únete a nuestra comunidad de vida consciente. Recibe un truco tradicional de ahorro, salud y ecología cada domingo directamente en tu correo.': 'Rejoignez notre communauté de vie consciente. Recevez chaque dimanche un conseil traditionnel d\'économie, de santé et d\'écologie directement dans votre boîte de réception.',
        'Suscribirse': 'S\'abonner',
        'Temas Populares:': 'Sujets Populaires :',
        '#AhorroDoméstico': '#ÉconomiesMénagères',
        '#CosméticaNatural': '#CosmétiqueNaturelle',
        '#LimpiezaEcológica': '#NettoyageÉcologique',
        '#RemediosCaseros': '#RemèdesMaison',
        '#CalefacciónEcológica': '#ChauffageÉcologique',
        '#EnergíaSolar': '#ÉnergieSolaire',
        '#HuertoUrbano': '#PotagerUrbain',
        '&copy; 2026 Receta de Abuela. Todos los derechos reservados.': '&copy; 2026 Recette de Grand-mère. Tous droits réservés.',
        'Autor: Adrián Enfedaque | Contacto:': 'Auteur : Adrián Enfedaque | Contact :',
        'Diseño Premium, Sostenible y Moderno para un estilo de vida consciente.': 'Design Premium, Durable et Moderne pour un style de vie conscient.',
        'Administrar Suscriptores': 'Gérer les abonnés',
        '<title>Receta de Abuela | La sabiduría del bienestar</title>': '<title>Recette de Grand-mère | La sagesse du bien-être</title>',
        '<meta name="description"\n    content="Descubre recetas ancestrales y ecológicas para el cuidado personal y del hogar. La sabiduría del bienestar en formato moderno, sostenible y económico.">': '<meta name="description" content="Découvrez des recettes ancestrales et écologiques pour le soin personnel et de la maison. La sagesse du bien-être sous un format moderne, durable et économique.">',
        'content="Descubre recetas ancestrales y ecológicas para el cuidado personal y del hogar. La sabiduría del bienestar en formato moderno, sostenible y económico."': 'content="Découvrez des recettes ancestrales et écologiques pour le soin personnel et de la maison. La sagesse du bien-être sous un format moderne, durable et économique."',
        '<title>Quiénes Somos | Receta de Abuela</title>': '<title>Qui Sommes-Nous | Recette de Grand-mère</title>',
        'Conoce la historia detrás de Receta de Abuela. Un puente entre la sabiduría ancestral de mi abuela y el bienestar corporal, la salud y la sostenibilidad en el mundo moderno.': 'Découvrez l\'histoire de la Recette de Grand-mère. Un pont entre la sagesse ancestrale de ma grand-mère et le bien-être corporel, la santé et la durabilité dans le monde moderne.',
        'Nuestra Filosofía': 'Notre Philosophie',
        'El Retorno a lo Esencial': 'Le Retour à l\'Essentiel',
        'Una reflexión sobre cómo la comodidad inmediata ha sustituido a la salud de nuestro cuerpo y al equilibrio con el planeta.': 'Une réflexion sur la façon dont le confort immédiat a remplacé la santé de notre corps et l\'équilibre avec la planète.',
        'El legado de mi abuela': 'Le legs de ma grand-mère',
        'El proyecto <strong>Receta de Abuela</strong> nació en el patio trasero de mi infancia, observando a mi abuela recolectar hojas de hiedra para lavar la ropa y flores de caléndula para curar nuestras heridas. En su mundo, nada se desperdiciaba y todo tenía un propósito dictado por los ritmos de la naturaleza. Sus manos curtidas por la tierra no solo elaboraban soluciones prácticas, sino que guardaban un respeto sagrado por el equilibrio de la vida.': 'Le projet <strong>Recette de Grand-mère</strong> est né dans la cour de mon enfance, en regardant ma grand-mère ramasser des feuilles de lierre pour laver les vêtements et des fleurs de souci pour soigner nos blessures. Dans son monde, rien n\'était perdu et tout avait un but dicté par les rythmes de la nature. Ses mains façonnées par la terre ne concevaient pas seulement des solutions pratiques, elles gardaient un respect sacré pour l\'équilibre de la vie.',
        '"Nos dijeron que avanzábamos hacia una vida mejor, pero a menudo la comodidad del envase de plástico nos hizo olvidar la pureza de lo que introducimos en nuestro cuerpo."': '"On nous a dit que nous progressions vers une vie meilleure, mais souvent la commodité de l\'emballage plastique nous a fait oublier la pureté de ce que nous introduisons dans notre corps."',
        'El dilema moderno: Comodidad vs. Bienestar': 'Le dilemme moderne : Confort vs Bien-être',
        'Al adentrarme en la vida urbana moderna, me di cuenta de una desconcertante paradoja: la llamada "evolución" nos ha llevado a un punto donde <strong>la comodidad superficial ha suplantado al verdadero bienestar</strong>. Hemos cambiado la salud física a largo plazo y la sostenibilidad de nuestro ecosistema por el alivio instantáneo de soluciones químicas prefabricadas.': 'En entrant dans la vie urbaine moderne, j\'ai réalisé un paradoxe déconcertant : la soi-disant « évolution » nous a conduits à un point où <strong>le confort superficiel a supplanté le véritable bien-être</strong>. Nous avons échangé la santé physique à long terme et la durabilité de notre écosystème contre le soulagement instantané des solutions chimiques préfabriquées.',
        'Nos hemos acostumbrado a comprar detergentes repletos de fragancias artificiales y disruptores endocrinos sintéticos que quedan impregnados en las fibras de nuestra ropa y son absorbidos diariamente por nuestra piel. Utilizamos pastas dentales comerciales cargadas de flúor sintético y tensoactivos industriales (como el lauril sulfato de sodio) que dañan las encías y alteran nuestro microbioma bucal. Incluso para limpiar las encimeras de nuestras cocinas, rociamos vapores de amoníaco o cloro que irritan directamente nuestros pulmones y ojos.': 'Nous nous sommes habitués à acheter des détergents remplis de parfums artificiels et de perturbateurs endocriniens synthétiques qui restent imprégnés dans les fibres de nos vêtements et sont absorbés quotidiennement par notre peau. Nous utilisons des dentifrices commerciaux chargés de fluor synthétique et de tensioactifs industriels (tels que le lauril sulfate de sodium) qui endommagent les gencives et altèrent notre microbiome buccal. Même pour nettoyer nos plans de travail de cuisine, nous pulvérisons des vapeurs d\'ammoniac ou de chlore qui irritent directement nos poumons et nos yeux.',
        'Un puente entre la ciencia y la tradición': 'Un pont entre la science et la tradition',
        'Esta página web no es un manifiesto de rechazo a la tecnología ni una llamada a volver al pasado de forma radical. Es una invitación consciente a <strong>reflexionar sobre el coste real de nuestra comodidad diaria</strong>.': 'Ce site internet n\'est pas un manifeste rejetant la technologie ni un appel radical à revenir au passé. C\'est une invitation consciente à <strong>réfléchir sur le coût réel de notre confort quotidien</strong>.',
        'Cada receta compartida aquí ha sido seleccionada de la sabiduría popular, pero evaluada y adaptada a la vida moderna bajo un análisis riguroso de impacto. Queremos demostrar con números, ingredientes limpios y explicaciones claras que es perfectamente viable cuidar de tu cuerpo, reducir drásticamente los tóxicos a los que te expones y vivir en armonía ecológica sin sacrificar tu economía. Es el momento de recuperar el control de nuestro bienestar, volviendo a lo esencial de la mano de la ciencia.': 'Chaque recette partagée ici a été sélectionnée à partir de la sagesse populaire, mais évaluée et adaptée à la vie moderne grâce à une analyse d\'impact rigoureuse. Nous voulons prouver avec des chiffres, des ingrédients propres et des explications claires qu\'il est parfaitement viable de prendre soin de son corps, de réduire drastiquement les toxines auxquelles on est exposé et de vivre en harmonie écologique sans sacrifier ses finances. Il est temps de reprendre le contrôle de notre bien-être, en revenant à l\'essentiel main dans la main avec la science.',
        'Sobre el autor': 'À propos de l\'auteur',
        'El autor y creador de este espacio es <strong>Adrián Enfedaque</strong>, nieto de la abuela cuya sabiduría inspiró este proyecto. A través de este portal, Adrián busca rescatar las recetas de su infancia y combinarlas con análisis de impacto contemporáneos para facilitar el acceso a un bienestar consciente, pratique et écologique.': 'L\'auteur et créateur de cet espace est <strong>Adrián Enfedaque</strong>, petit-fils de la grand-mère dont la sagesse a inspiré ce projet. À travers ce portail, Adrián cherche à sauver les recettes de son enfance et à les combiner avec des analyses d\'impact contemporaines pour faciliter l\'accès à un bien-être conscient, pratique et écologique.',
        'Si deseas ponerte en contacto para compartir sugerencias, aportar alguna receta tradicional de tu familia o resolver dudas, puedes escribir directamente a: <strong><a href="mailto:info@recetadeabuela.com" style="color: var(--color-primary); text-decoration: underline;">info@recetadeabuela.com</a></strong>.': 'Si vous souhaitez entrer en contact pour partager des suggestions, apporter une recette traditionnelle de votre famille ou résoudre des doutes, pouvez écrire directement à : <strong><a href="mailto:info@recetadeabuela.com" style="color: var(--color-primary); text-decoration: underline;">info@recetadeabuela.com</a></strong>.',
        'Explorar Recetas Ancestrales': 'Explorer les recettes ancestrales',
        '<title>Comunidad | Receta de Abuela</title>': '<title>Communauté | Recette de Grand-mère</title>',
        'Propón y comparte tus propias recetas tradicionales de la abuela. Vota las mejores ideas ecológicas, cosmética natural, huerto y ahorro doméstico.': 'Proposez et partagez vos propres recettes traditionnelles de grand-mère. Votez pour les meilleures idées écologiques, cosmétique naturelle, potager et économies ménagères.',
        'El Rincón de la Comunidad': 'Le Coin de la Communauté',
        '¿Tienes alguna receta tradicional que usas en tu día a día o recuerdas de tus abuelos? Compártela con nosotros. También puedes votar las propuestas existentes para ayudarnos a decidir qué guías detalladas publicar a continuación.': 'Avez-vous une recette traditionnelle que vous utilisez dans votre vie quotidienne ou dont vous vous souvenez de vos grands-parents ? Partagez-la avec nous. Vous pouvez également voter sur les propositions existantes pour nous aider à décider quels guides détaillés publier ensuite.',
        'Un espacio para colaborar y compartir sabiduría': 'Un espace pour collaborer et partager la sagesse',
        'Este es nuestro punto de encuentro. Queremos rescatar y mantener viva la sabiduría del bienestar tradicional, y para ello <strong>necesitamos tu ayuda</strong>. Este espacio está diseñado para que todos colaboremos en hacer este recetario ancestral cada vez más grande y completo.': 'C\'est notre point de rencontre. Nous voulons sauver et maintenir vivante la sagesse du bien-être traditionnel, et pour cela <strong>nous avons besoin de votre aide</strong>. Cet espace est conçu pour que nous collaborions tous afin de rendre ce livre de recettes ancestrales de plus en plus grand et complet.',
        '<strong>Comparte tus propias recetas:</strong> Sube esos remedios, fórmulas de limpieza o recetas de cocina natural que has heredado de tu familia o que aplicas en tu hogar.': '<strong>Partagez vos propres recettes :</strong> Téléchargez ces remèdes, formules de nettoyage ou recettes de cuisine naturelle dont vous avez hérité de votre famille ou que vous appliquez chez vous.',
        '<strong>Propón variantes y mejoras:</strong> ¿Haces alguna de nuestras recetas de forma diferente? ¿Usas otro ingrediente o truco para mejorarla? Comparte tu versión aquí.': '<strong>Proposez des variantes et des améliorations :</strong> Faites-vous l\'une de nos recettes différemment ? Utilisez-vous un autre ingrédient ou astuce pour l\'améliorer ? Partagez votre version ici.',
        '<strong>Vota por las mejores ideas:</strong> Si ves una propuesta interesante de otro miembro de la comunidad, dale tu voto positivo (👍). Esto nos ayudará a saber cuáles son las favoritas para desarrollarlas y publicarlas como guías detalladas en la web principal.': '<strong>Votez pour les meilleures idées :</strong> Si vous voyez une proposition intéressante d\'un autre membre de la communauté, donnez-lui votre vote positif (👍). Cela nous aidera à savoir quelles sont les préférées pour les développer et les publier sous forme de guides détaillés sur le site principal.',
        'Propón tu Receta': 'Proposez votre Recette',
        'Comparte ese truco tradicional que cuida de la salud, el bolsillo o el planeta.': 'Partagez cette astuce traditionnelle qui prend soin de la santé, du portefeuille ou de la planète.',
        'Tu Nombre y Ciudad': 'Votre Nom et Ville',
        'Título de la Propuesta': 'Titre de la Proposition',
        'Categoría principal': 'Catégorie principale',
        'Selecciona una opción': 'Sélectionnez une option',
        'Plantas y Huerto': 'Plantes et Potager',
        'Alimentos Naturales': 'Aliments Naturels',
        'Ingredientes y Materiales': 'Ingrédients et Matériaux',
        'Paso a paso / Preparación': 'Étape par étape / Préparation',
        'Explica cómo se elabora y se utiliza este remedio...': 'Expliquez comment ce remède est préparé et utilisé...',
        'Enviar Propuesta': 'Envoyer la Proposition',
        '¡Propuesta enviada con éxito! Ya se muestra en el listado de la comunidad.': 'Proposition envoyée avec succès ! Elle s\'affiche désormais dans la liste de la communauté.',
        'Propuestas de la Comunidad': 'Propositions de la Communauté',
        'Cargando sabiduría de la comunidad...': 'Chargement de la sagesse de la communauté...'
    },
    'pt': {
        '<html lang="es">': '<html lang="pt">',
        'Todos los Artículos': 'Todos os Artigos',
        'Hogar Ecológico': 'Lar Ecológico',
        'Cuidado Personal': 'Cuidados Pessoais',
        'Tecnología Ancestral': 'Tecnologia Ancestral',
        'Comunidad': 'Comunidade',
        'Quiénes Somos': 'Quem Somos',
        'La sabiduría del bienestar': 'A sabedoria do bem-estar',
        'Sostenibilidad, salud y economía para tu día a día': 'Sustentabilidade, saúde e economia no seu dia a dia',
        'Rescatamos la sabiduría tradicional a través de recetas caseras evaluadas científicamente\n        y adaptadas a la vida moderna. 100% natural, medido y analizado.': 'Resgatamos a sabedoria tradicional através de receitas caseiras cientificamente avaliadas e adaptadas à vida moderna. 100% natural, medido e analisado.',
        'Rescatamos la sabiduría tradicional a través de recetas caseras evaluadas científicamente y adaptadas a la vida moderna. 100% natural, medido y analizado.': 'Resgatamos a sabedoria tradicional através de receitas caseiras cientificamente avaliadas e adaptadas à vida moderna. 100% natural, medido e analisado.',
        'Únete al boletín semanal': 'Junte-se ao boletim semanal',
        '¡Gracias por suscribirte! Pronto recibirás contenido nuevo.': 'Obrigado por se inscrever! Em breve receberá novos conteúdos.',
        'Buscar recetas (ej. lavanda, champú, cítricos...)': 'Buscar receitas (ex. lavanda, champô, cítricos...)',
        'Ordenar:': 'Ordenar por:',
        'Más Popular': 'Mais Popular',
        'Mayor Ahorro (€)': 'Maior Economia (€)',
        'Mejor para la Salud': 'Melhor para a Saúde',
        'Menor Impacto Ambiental': 'Menor Impacto Ambiental',
        'Cargando sabiduría ancestral...': 'Carregando sabedoria ancestral...',
        'El Cuaderno de la Abuela': 'O Caderno da Avó',
        'Únete a nuestra comunidad de vida consciente. Recibe un truco tradicional de ahorro, salud y ecología cada domingo directamente en tu correo.': 'Junte-se à nossa comunidade de vida consciente. Receba uma dica tradicional de economia, saúde e ecologia todos os domingos diretamente na sua caixa de entrada.',
        'Suscribirse': 'Inscrever-se',
        'Temas Populares:': 'Temas Populares:',
        '#AhorroDoméstico': '#EconomiaDoméstica',
        '#CosméticaNatural': '#CosméticaNatural',
        '#LimpiezaEcológica': '#LimpezaEcológica',
        '#RemediosCaseros': '#RemédiosCaseiros',
        '#CalefacciónEcológica': '#AquecimentoEcológico',
        '#EnergíaSolar': '#EnergiaSolar',
        '#HuertoUrbano': '#HortaUrbana',
        '&copy; 2026 Receta de Abuela. Todos los derechos reservados.': '&copy; 2026 Receita de Avó. Todos os direitos reservados.',
        'Autor: Adrián Enfedaque | Contacto:': 'Autor: Adrián Enfedaque | Contacto:',
        'Diseño Premium, Sostenible y Moderno para un estilo de vida consciente.': 'Design Premium, Sustentável e Moderno para um estilo de vida consciente.',
        'Administrar Suscriptores': 'Administrar Inscritos',
        '<title>Receta de Abuela | La sabiduría del bienestar</title>': '<title>Receita de Avó | A sabedoria do bem-estar</title>',
        '<meta name="description"\n    content="Descubre recetas ancestrales y ecológicas para el cuidado personal y del hogar. La sabiduría del bienestar en formato moderno, sostenible y económico.">': '<meta name="description" content="Descubra receitas ancestrais e ecológicas para cuidados pessoais e domésticos. A sabedoria do bem-estar num formato moderno, sustentável e económico.">',
        'content="Descubre recetas ancestrales y ecológicas para el cuidado personal y del hogar. La sabiduría del bienestar en formato moderno, sostenible y económico."': 'content="Descubra receitas ancestrais e ecológicas para cuidados pessoais e domésticos. A sabedoria do bem-estar num formato moderno, sustentável e económico."',
        '<title>Quiénes Somos | Receta de Abuela</title>': '<title>Quem Somos | Receita de Avó</title>',
        'Conoce la historia detrás de Receta de Abuela. Un puente entre la sabiduría ancestral de mi abuela y el bienestar corporal, la salud y la sostenibilidad en el mundo moderno.': 'Conheça a história por trás de Receita de Avó. Uma ponte entre a sabedoria ancestral da minha avó e o bem-estar corporal, a saúde e a sustentabilidade no mundo moderno.',
        'Nuestra Filosofía': 'Nossa Filosofia',
        'El Retorno a lo Esencial': 'O Retorno ao Essencial',
        'Una reflexión sobre cómo la comodidad inmediata ha sustituido a la salud de nuestro cuerpo y al equilibrio con el planeta.': 'Uma reflexão sobre como o conforto imediato substituiu a saúde do nosso corpo e o equilíbrio com o planeta.',
        'El legado de mi abuela': 'O legado da minha avó',
        'El proyecto <strong>Receta de Abuela</strong> nació en el patio trasero de mi infancia, observando a mi abuela recolectar hojas de hiedra para lavar la ropa y flores de caléndula para curar nuestras heridas. En su mundo, nada se desperdiciaba y todo tenía un propósito dictado por los ritmos de la naturaleza. Sus manos curtidas por la tierra no solo elaboraban soluciones prácticas, sino que guardaban un respeto sagrado por el equilibrio de la vida.': 'O projeto <strong>Receita de Avó</strong> nasceu no quintal da minha infância, vendo minha avó colher folhas de hera para lavar roupas e flores de calêndula para curar nossas feridas. No mundo dela, nada era desperdiçado e tudo tinha um propósito ditado pelos ritmos da natureza. Suas mãos calejadas pela terra não apenas elaboravam soluções práticas, mas guardavam um respeito sagrado pelo equilíbrio da vida.',
        '"Nos dijeron que avanzábamos hacia una vida mejor, pero a menudo la comodidad del envase de plástico nos hizo olvidar la pureza de lo que introducimos en nuestro cuerpo."': '"Disseram-nos que caminhávamos para uma vida melhor, mas muitas vezes a conveniência da embalagem de plástico fez-nos esquecer a pureza do que colocamos no nosso corpo."',
        'El dilema moderno: Comodidad vs. Bienestar': 'O dilema moderno: Conforto vs. Bem-estar',
        'Al adentrarme en la vida urbana moderna, me di cuenta de una desconcertante paradoja: la llamada "evolución" nos ha llevado a un point donde <strong>la comodidad superficial ha suplantado al verdadero bienestar</strong>. Hemos cambiado la salud física a largo plazo y la sostenibilidad de nuestro ecosistema por el alivio instantáneo de soluciones químicas prefabricadas.': 'Ao entrar na vida urbana moderna, percebi um paradoxo desconcertante: a chamada "evolução" nos levou a um ponto em que o <strong>conforto superficial suplantou o verdadeiro bem-estar</strong>. Trocamos a saúde física a longo prazo e a sustentabilidade do nosso ecossistema pelo alívio instantâneo de soluções químicas pré-fabricadas.',
        'Nos hemos acostumbrado a comprar detergentes repletos de fragancias artificiales y disruptores endocrinos sintéticos que quedan impregnados en las fibras de nuestra ropa y son absorbidos diariamente por nuestra piel. Utilizamos pastas dentales comerciales cargadas de flúor sintético y tensoactivos industriales (como el lauril sulfato de sodio) que dañan las encías y alteran nuestro microbioma bucal. Incluso para limpiar las encimeras de nuestras cocinas, rociamos vapores de amoníaco o cloro que irritan directamente nuestros pulmones y ojos.': 'Acostumamo-nos a comprar detergentes cheios de fragrâncias artificiais e desreguladores endócrinos sintéticos que ficam impregnados nas fibras das nossas roupas e são absorvidos diariamente pela nossa pele. Utilizamos pastas de dentes comerciais carregadas de flúor sintético e tensoativos industriais (como o lauril sulfato de sódio) que danificam as gengivas e alteram o nosso microbioma oral. Mesmo para limpar as bancadas das nossas cozinhas, pulverizamos vapores de amoníaco ou cloro que irritam diretamente os nossos pulmões e olhos.',
        'Un puente entre la ciencia y la tradición': 'Uma ponte entre a ciência e a tradição',
        'Esta página web no es un manifiesto de rechazo a la tecnología ni una llamada a volver al pasado de forma radical. Es una invitación consciente a <strong>reflexionar sobre el coste real de nuestra comodidad diaria</strong>.': 'Esta página web não é um manifesto de rejeição da tecnologia ou um apelo radical para voltar ao passado. É um convite consciente a <strong>refletir sobre o custo real da nossa conveniência diária</strong>.',
        'Cada receta compartida aquí ha sido seleccionada de la sabiduría popular, pero evaluada y adaptada a la vida moderna bajo un análisis riguroso de impacto. Queremos demostrar con números, ingredientes limpios y explicaciones claras que es perfectamente viable cuidar de tu cuerpo, reducir drásticamente los tóxicos a los que te expones y vivir en armonía ecológica sin sacrificar tu economía. Es el momento de recuperar el control de nuestro bienestar, volviendo a lo esencial de la mano de la ciencia.': 'Cada receita aqui partilhada foi selecionada a partir da sabedoria popular, mas avaliada e adaptada à vida moderna sob uma rigorosa análise de impacto. Queremos demonstrar com números, ingredientes limpos e explicações claras que é perfeitamente viável cuidar do seu corpo, reduzir drasticamente as toxinas a que se expõe e viver em harmonia ecológica sem sacrificar as suas finanças. É o momento de recuperar o controlo do nosso bem-estar, voltando ao essencial de mãos dadas com a ciência.',
        'Sobre el autor': 'Sobre o autor',
        'El autor y creador de este espacio es <strong>Adrián Enfedaque</strong>, nieto de la abuela cuya sabiduría inspiró este proyecto. A través de este portal, Adrián busca rescatar las recetas de su infancia y combinarlas con análisis de impacto contemporáneos para facilitar el acceso a un bienestar consciente, práctico y ecológico.': 'O autor e criador deste espaço é <strong>Adrián Enfedaque</strong>, neto da avó cuja sabedoria inspirou este projeto. A através deste portal, Adrián procura resgatar as receitas da sua infância e combiná-las com análises de impacto contemporâneas para facilitar o acesso a um bem-estar consciente, prático e ecológico.',
        'Si deseas ponerte en contacto para compartir sugerencias, aportar alguna receta tradicional de tu familia o resolver dudas, puedes escribir directamente a: <strong><a href="mailto:info@recetadeabuela.com" style="color: var(--color-primary); text-decoration: underline;">info@recetadeabuela.com</a></strong>.': 'Se desejar entrar em contacto para partilhar sugestões, contribuir com alguma receita tradicional da sua família ou resolver dúvidas, pode escrever diretamente para: <strong><a href="mailto:info@recetadeabuela.com" style="color: var(--color-primary); text-decoration: underline;">info@recetadeabuela.com</a></strong>.',
        'Explorar Recetas Ancestrales': 'Explorar Receitas Ancestrais',
        '<title>Comunidad | Receta de Abuela</title>': '<title>Comunidade | Receita de Avó</title>',
        'Propón y comparte tus propias recetas tradicionales de la abuela. Vota las mejores ideas ecológicas, cosmética natural, huerto y ahorro doméstico.': 'Proponha e partilhe as suas próprias receitas tradicionais da avó. Vote nas melhores ideias ecológicas, cosmética natural, horta e economia doméstica.',
        'El Rincón de la Comunidad': 'O Canto da Comunidade',
        '¿Tienes alguna receta tradicional que usas en tu día a día o recuerdas de tus abuelos? Compártela con nosotros. También puedes votar las propuestas existentes para ayudarnos a decidir qué guías detalladas publicar a continuación.': 'Temas algum receita tradicional que usas no teu dia a dia ou te lembras dos teus avós? Partilha-a connosco. Também podes votar nas propostas existentes para nos ajudar a decidir quais os guias detalhados a publicar a seguir.',
        'Un espacio para colaborar y compartir sabiduría': 'Um espaço para colaborar e partilhar sabedoria',
        'Este es nuestro punto de encuentro. Queremos rescatar y mantener viva la sabiduría del bienestar tradicional, y para ello <strong>necesitamos tu ayuda</strong>. Este espacio está diseñado para que todos colaboremos en hacer este recetario ancestral cada vez más grande y completo.': 'Este é o nosso ponto de encontro. Queremos resgatar e manter viva a sabedoria do bem-estar tradicional e, para isso, precisamos da sua ajuda. Este espaço foi desenhado para que todos colaboremos para tornar este livro de receitas ancestral cada vez maior e mais completo.',
        '<strong>Comparte tus propias recetas:</strong> Sube esos remedios, fórmulas de limpieza o recetas de cocina natural que has heredado de tu familia o que aplicas en tu hogar.': '<strong>Partilhe as suas próprias receitas:</strong> Envie os remédios, fórmulas de limpeza ou receitas de cozinha natural que herdou da sua família ou que aplica no seu lar.',
        '<strong>Propón variantes y mejoras:</strong> ¿Haces alguna de nuestras recetas de forma diferente? ¿Usas otro ingrediente o truco para mejorarla? Comparte tu versión aquí.': '<strong>Proponha variantes e melhorias:</strong> Prepara alguma das nossas receitas de forma diferente? Utiliza outro ingrediente ou truque para melhorá-la? Partilhe a sua versão aqui.',
        '<strong>Vota por las mejores ideas:</strong> Si ves una propuesta interesante de otro miembro de la comunidad, dale tu voto positivo (👍). Esto nos ayudará a saber cuáles son las favoritas para desarrollarlas y publicarlas como guías detalladas en la web principal.': '<strong>Vote nas melhores ideias:</strong> Se vir uma proposta interessante de outro membro da comunidade, dê-lhe o seu voto positivo (👍). Isto ajudar-nos-á a saber quais são as favoritas para as desenvolver e publicar como guias detalhados no site principal.',
        'Propón tu Receta': 'Proponha a sua Receita',
        'Comparte ese truco tradicional que cuida de la salud, el bolsillo o el planeta.': 'Partilhe aquela dica tradicional que cuida da saúde, do bolso ou do planeta.',
        'Tu Nombre y Ciudad': 'Seu Nome e Cidade',
        'Título de la Propuesta': 'Título da Proposta',
        'Categoría principal': 'Categoria principal',
        'Selecciona una opción': 'Selecione uma opção',
        'Plantas y Huerto': 'Plantas e Horta',
        'Alimentos Naturales': 'Alimentos Naturais',
        'Ingredientes y Materiales': 'Ingredientes e Materiais',
        'Paso a paso / Preparación': 'Passo a passo / Preparação',
        'Explica cómo se elabora y se utiliza este remedio...': 'Explique como se elabora e se utiliza este remédio...',
        'Enviar Propuesta': 'Enviar Proposta',
        '¡Propuesta enviada con éxito! Ya se muestra en el listado de la comunidad.': 'Proposta enviada com sucesso! Já é exibida na lista da comunidade.',
        'Propuestas de la Comunidad': 'Propostas da Comunidade',
        'Cargando sabiduría de la comunidad...': 'Carregando sabedoria da comunidade...'
    }
}

languages = [
    ('es', '', recipes_es),
    ('en', 'en/', recipes_en),
    ('fr', 'fr/', recipes_fr),
    ('pt', 'pt/', recipes_pt)
]

for lang, subdir, lang_recipes in languages:
    if subdir:
        os.makedirs(subdir, exist_ok=True)
    
    prefix = "../" if subdir else ""
    loc = LOCALES[lang]
    
    # Process each recipe in this language
    for recipe in lang_recipes:
        rid = recipe["id"]
        title = recipe["title"]
        summary = recipe["summary"]
        intro = fix_translated_links(recipe["intro"])
        tag = recipe["tag"]
        image = recipe["image"]
        views_formatted = format_views(recipe["views"] / 10)
        health = recipe["healthBenefit"]
        time = recipe["time"]
        cost = recipe["cost"]
        raw_dur = recipe["rawDuration"]
        final_dur = recipe["finalDuration"]
        
        time_minutes = re.sub(r'[^\d]', '', time)
        
        # 1. Generate Schema.org JSON-LD
        cost_number_match = re.search(r"[\d.,]+", cost)
        cost_number = cost_number_match.group(0).replace(",", ".") if cost_number_match else "0"
        
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
                "name": f"Paso {idx+1}" if lang == 'es' else f"Step {idx+1}" if lang == 'en' else f"Étape {idx+1}" if lang == 'fr' else f"Passo {idx+1}",
                "text": step,
                "url": f"https://www.recetadeabuela.com/{subdir}{rid}.html#step-{idx+1}"
            })
        steps_json = json.dumps(steps_schema, ensure_ascii=False)
        
        cuisine = "Española" if lang == 'es' else "Spanish" if lang == 'en' else "Espagnole" if lang == 'fr' else "Espanhola"
        yield_str = "1 preparación" if lang == 'es' else "1 preparation" if lang == 'en' else "1 préparation" if lang == 'fr' else "1 preparação"
        
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
    "recipeCuisine": "{cuisine}",
    "prepTime": "{prep_time_str}",
    "cookTime": "{cook_time_str}",
    "totalTime": "PT{time_minutes}M",
    "recipeYield": "{yield_str}",
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
    "yield": "{yield_str}",
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
            f'<tr class="{"highlight-row" if idx == 0 else ""}"><td>{row["concepto"]}</td><td>{row["casero"]}</td><td>{row["comercial"]}</td><td><span class="badge-comparison {"positive" if any(kw in row["diferencia"] for kw in ["Ahorro", "Sin", "Ecológico", "duración", "limpia", "Saludable", "respiración", "Cero", "Savings", "Eco", "Without", "Économie", "Sain", "Economia", "Saudável"]) else "negative"}">{row["diferencia"]}</span></td></tr>'
            for idx, row in enumerate(recipe["comparisonTable"])
        ])
        
        # Localized pre-rendered block
        pre_rendered_details = f"""
    <!-- Top banner image -->
    <div style="position: relative; width: 100%;">
      <img src="{prefix}{image}" alt="{title} - {summary}" class="modal-hero-img" style="border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;">
      <span class="card-views-badge" style="top: 1.5rem; right: 1.5rem;">
        <svg class="card-views-icon" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        {views_formatted} {loc['views_suffix']}
      </span>
    </div>
    
    <!-- Header title and summary -->
    <div class="modal-header-info">
      <span class="modal-category">{tag}</span>
      <h1 class="modal-title" style="margin-top: 0.2rem; font-size: 2.2rem;">{title}</h1>
      <p class="modal-intro">{intro}</p>
      
      <!-- Share Buttons -->
      <div class="share-container">
        <span class="share-label">{loc['share_label']}</span>
        <div class="share-buttons">
          <a href="#" class="btn-share wa" id="share-wa" aria-label="{loc['wa_aria']}">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.787-1.451L0 24zm6.59-4.846c1.657.982 3.111 1.485 4.905 1.486 5.479 0 9.936-4.448 9.938-9.917.001-2.651-1.02-5.14-2.875-7.001C16.8 1.862 14.305 1.83 12.01 1.83c-5.485 0-9.94 4.45-9.943 9.919-.001 1.945.514 3.447 1.516 4.975l-.974 3.551 3.65-.957l.398.228z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="#" class="btn-share pin" id="share-pin" aria-label="{loc['pin_aria']}">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.4l1.43-6.07s-.37-.73-.37-1.8c0-1.7 1-2.97 2.2-2.97 1.05 0 1.56.8 1.56 1.74 0 1.06-.67 2.63-1.02 4.1-.3 1.25.62 2.28 1.85 2.28 2.22 0 3.93-2.34 3.93-5.7 0-3-2.13-5.1-5.23-5.1-3.56 0-5.66 2.67-5.66 5.43 0 1.08.42 2.24.94 2.87.1.13.12.24.08.38l-.35 1.44c-.06.24-.2.32-.45.2-1.63-.76-2.65-3.14-2.65-5.05 0-4.1 3-7.87 8.6-7.87 4.5 0 8 3.2 8 7.5 0 4.48-2.82 8.1-6.75 8.1-1.32 0-2.56-.68-2.98-1.5l-.8 3.12c-.3 1.12-1 2.53-1.5 3.32C9.88 23.83 10.93 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
            <span>Pinterest</span>
          </a>
          <a href="#" class="btn-share fb" id="share-fb" aria-label="{loc['fb_aria']}">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Facebook</span>
          </a>
          <a href="https://www.instagram.com/recetadabuela" target="_blank" rel="noopener" class="btn-share ig" id="share-ig" aria-label="{loc['ig_aria']}">
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
        <h2 class="health-highlight-title">{loc['health_title']}</h2>
      </div>
      <p class="health-highlight-text">{health}</p>
    </div>
    
    <!-- Meta stats boxes -->
    <div class="modal-meta-grid">
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">{loc['time_label']}</span>
          <span class="meta-value">{time}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <div class="meta-details">
          <span class="meta-label">{loc['cost_label']}</span>
          <span class="meta-value">{cost}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <div class="meta-details">
          <span class="meta-label">{loc['raw_dur_label']}</span>
          <span class="meta-value">{raw_dur}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">{loc['final_dur_label']}</span>
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
          {loc['shopping_title']}
        </h3>
        <ul class="shopping-list">
          {shopping_items_html}
        </ul>
      </section>
      
      <!-- Steps column -->
      <section class="body-col-right">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          {loc['steps_title']}
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
          {loc['alt_uses_title']}
        </h3>
        <ul class="alt-uses-list">
          {alt_uses_html}
        </ul>
      </section>
      
      <!-- Scientific / Extra Information -->
      <section class="extra-info-box">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          {loc['scientific_title']}
        </h3>
        <p class="extra-text">{recipe["extraInfo"]}</p>
      </section>
      
      <!-- Detailed Impact Circles -->
      <section>
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          {loc['impact_title']}
        </h3>
        <div class="modal-impact-metrics">
          <div class="impact-metric-box">
            <div class="impact-metric-circle eco">{recipe["metrics"]["economy"]}%</div>
            <span class="impact-metric-name">{loc['impact_eco']}</span>
            <span class="impact-metric-desc">{loc['impact_eco_desc']}</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle health">{recipe["metrics"]["health"]}%</div>
            <span class="impact-metric-name">{loc['impact_health']}</span>
            <span class="impact-metric-desc">{loc['impact_health_desc']}</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle ecosys">{recipe["metrics"]["ecosystem"]}%</div>
            <span class="impact-metric-name">{loc['impact_ecosys']}</span>
            <span class="impact-metric-desc">{loc['impact_ecosys_desc']}</span>
          </div>
        </div>
      </section>
      
      <!-- Commercial Comparison Table -->
      <section>
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          {loc['table_title']}
        </h3>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>{loc['table_header_concept']}</th>
                <th>{loc['table_header_home']}</th>
                <th>{loc['table_header_comm']}</th>
                <th>{loc['table_header_diff']}</th>
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
        meta_title = f"{title} | {loc['meta_title_suffix']}"
        og_meta = f"""  <title>{meta_title}</title>
  <meta name="description" content="{summary}">
  <link rel="canonical" href="https://www.recetadeabuela.com/{subdir}{rid}.html">
  <meta property="og:title" content="{meta_title}">
  <meta property="og:description" content="{summary}">
  <meta property="og:image" content="https://www.recetadeabuela.com/{image}">
  <meta property="og:url" content="https://www.recetadeabuela.com/{subdir}{rid}.html">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{meta_title}">
  <meta name="twitter:description" content="{summary}">
  <meta name="twitter:image" content="https://www.recetadeabuela.com/{image}">"""

        # 4. Synthesize page
        # If building for localized subdirectory, we first translate articulation template elements
        page_html = template_html
        if lang != 'es' and lang in UI_TRANSLATIONS:
            for orig, trans in UI_TRANSLATIONS[lang].items():
                page_html = page_html.replace(orig, trans)
                
        # Replace relative paths in template if inside subdirectory
        if subdir:
            page_html = page_html.replace('href="style.css?v=6"', 'href="../style.css?v=6"')
            page_html = page_html.replace('href="assets/logo.png"', 'href="../assets/logo.png"')
            page_html = page_html.replace('src="assets/logo.png"', 'src="../assets/logo.png"')
            page_html = page_html.replace('src="assets/images/', 'src="../assets/images/')
            page_html = page_html.replace('href="index.html"', 'href="index.html"')
            page_html = page_html.replace('href="comunidad.html"', 'href="comunidad.html"')
            page_html = page_html.replace('href="quienes-somos.html"', 'href="quienes-somos.html"')
            page_html = page_html.replace('href="mailto:info@recetadeabuela.com"', 'href="mailto:info@recetadeabuela.com"')
            page_html = page_html.replace('href="https://www.instagram.com/recetadabuela"', 'href="https://www.instagram.com/recetadabuela"')
            page_html = page_html.replace('href="inscritos.html"', 'href="../inscritos.html"')
            page_html = page_html.replace('src="theme.js?v=6"', 'src="../theme.js?v=6"')
            page_html = page_html.replace('src="app.js?v=6"', 'src="../app.js?v=6"')
            
        # 4b. Pre-render recommended articles HTML for internal linking SEO
        candidates = [r for r in lang_recipes if r["id"] != rid]
        
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
            metric_types = [("economy", loc['metric_eco'], "eco"), ("health", loc['metric_health'], "health"), ("ecosystem", loc['metric_ecosys'], "ecosys")]
            for m_key, m_label, m_class in metric_types:
                m_val = rec["metrics"][m_key]
                rec_metrics_html += f"""
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot {m_class}"></span>{m_label}</span>
            <div class="metric-track"><div class="metric-fill {m_class}" style="width: {m_val}%"></div></div>
            <span class="metric-val">{m_val}%</span>
          </div>"""
                
            recommendations_html += f"""
      <a href="{rec_id}.html" class="recipe-card" aria-label="{loc['rec_aria_label']} {rec_title}">
        <div class="card-img-wrapper">
          <img src="{prefix}{rec_image}" alt="{loc['rec_aria_label']} {rec_title} - {rec_summary}" class="card-img" loading="lazy">
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
        
        # Replace recommendations placeholder and title
        page_html = page_html.replace("<h3>Artículos Recomendados</h3>", f"<h3>{loc['rec_title']}</h3>")
        page_html = page_html.replace("<h3>Recommended Articles</h3>", f"<h3>{loc['rec_title']}</h3>")
        page_html = page_html.replace("<h3>Articles Recommandés</h3>", f"<h3>{loc['rec_title']}</h3>")
        page_html = page_html.replace("<h3>Artigos Recomendados</h3>", f"<h3>{loc['rec_title']}</h3>")
        
        page_html = page_html.replace("<!-- Cards dynamically populated by app.js -->", recommendations_html)
        
        # Remove original general description first
        page_html = re.sub(r'<meta name="description" content="[^"]*">', "", page_html)
        
        # Replace head elements (title and meta description)
        page_html = page_html.replace("<title>Cargando guía... | Receta de Abuela</title>", og_meta + "\n" + schema_json_ld)
        page_html = page_html.replace("<title>Cargando guía... | Recette de Grand-mère</title>", og_meta + "\n" + schema_json_ld)
        
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
        if subdir:
            script_tag = '<script src="../app.js?v=6"></script>'
            script_injection = f'<script>window.currentRecipeId = "{rid}";</script>\n  <script src="../recipes_{lang}.js?v=6"></script>\n  {script_tag}'
        else:
            script_tag = '<script src="app.js?v=6"></script>'
            script_injection = f'<script>window.currentRecipeId = "{rid}";</script>\n  <script src="recipes_es.js?v=6"></script>\n  {script_tag}'
            
        page_html = page_html.replace(script_tag, script_injection)
        
        # Write output page
        out_path = f"{subdir}{rid}.html"
        with open(out_path, "w", encoding="utf-8") as f_out:
            f_out.write(page_html)

    print(f"Generated {len(lang_recipes)} static pages for language: {lang}")

def generate_noscript_html(lang, lang_recipes):
    noscript_html = '\n    <noscript>\n      <div class="noscript-fallback" style="padding: 2rem; max-width: 1200px; margin: 0 auto; background: rgba(255,255,255,0.03); border-radius: var(--border-radius-md); border: 1px solid var(--color-border); margin-top: 2rem;">\n'
    title_text = {
        'es': 'Índice de Recetas',
        'en': 'Recipe Index',
        'fr': 'Index des Recettes',
        'pt': 'Índice de Receitas'
    }[lang]
    noscript_html += f'        <h2 style="font-family: var(--font-secondary); margin-bottom: 1.5rem; text-align: center; color: var(--color-primary-pale); font-size: 1.8rem;">{title_text}</h2>\n'
    noscript_html += '        <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.2rem; padding: 0;">\n'
    for recipe in lang_recipes:
        rid = recipe["id"]
        title = recipe["title"]
        noscript_html += f'          <li><a href="{rid}.html" style="color: var(--color-text-muted); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px; transition: all 0.2s; font-size: 0.95rem;" onmouseover="this.style.color=\'var(--color-primary-pale)\'; this.style.borderBottomColor=\'var(--color-primary-pale)\'" onmouseout="this.style.color=\'var(--color-text-muted)\'; this.style.borderBottomColor=\'rgba(255,255,255,0.1)\'">{title}</a></li>\n'
    noscript_html += '        </ul>\n      </div>\n    </noscript>\n  '
    return noscript_html

def replace_noscript_block(content, lang, lang_recipes):
    noscript_html = generate_noscript_html(lang, lang_recipes)
    pattern = r'<!-- START_RECIPES_NOSCRIPT -->.*?<!-- END_RECIPES_NOSCRIPT -->'
    replacement = f'<!-- START_RECIPES_NOSCRIPT -->{noscript_html}<!-- END_RECIPES_NOSCRIPT -->'
    return re.sub(pattern, replacement, content, flags=re.DOTALL)

# Process static HTML files (index.html, quienes-somos.html, comunidad.html) for localizations
static_files = ["index.html", "quienes-somos.html", "comunidad.html"]
for lang, subdir, lang_recipes in languages:
    if not subdir:
        # For Spanish, we also inject the recipes_es.js script before app.js in index.html
        with open("index.html", "r", encoding="utf-8") as f:
            content = f.read()
        if 'src="recipes_es.js"' not in content:
            content = content.replace('<script src="app.js"></script>', '<script src="recipes_es.js"></script>\n  <script src="app.js"></script>')
        
        # Inject noscript list of recipes for Spanish index.html
        content = replace_noscript_block(content, 'es', recipes_es)
        
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(content)
        continue
        
    for fname in static_files:
        with open(fname, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Apply UI translations
        if lang in UI_TRANSLATIONS:
            for orig, trans in UI_TRANSLATIONS[lang].items():
                content = content.replace(orig, trans)
                
        # Replace relative paths
        if subdir:
            content = content.replace('href="style.css?v=6"', 'href="../style.css?v=6"')
            content = content.replace('href="assets/logo.png"', 'href="../assets/logo.png"')
            content = content.replace('src="assets/logo.png"', 'src="../assets/logo.png"')
            content = content.replace('src="assets/images/', 'src="../assets/images/')
            content = content.replace('href="index.html"', 'href="index.html"')
            content = content.replace('href="comunidad.html"', 'href="comunidad.html"')
            content = content.replace('href="quienes-somos.html"', 'href="quienes-somos.html"')
            content = content.replace('href="mailto:info@recetadeabuela.com"', 'href="mailto:info@recetadeabuela.com"')
            content = content.replace('href="https://www.instagram.com/recetadabuela"', 'href="https://www.instagram.com/recetadabuela"')
            content = content.replace('href="inscritos.html"', 'href="../inscritos.html"')
            content = content.replace('src="theme.js?v=6"', 'src="../theme.js?v=6"')
            if fname == "index.html":
                content = content.replace('src="app.js?v=6"', f'src="../recipes_{lang}.js?v=6"></script>\n  <script src="../app.js?v=6"')
                content = replace_noscript_block(content, lang, lang_recipes)
            else:
                content = content.replace('src="app.js?v=6"', 'src="../app.js?v=6"')
            
        if fname == "comunidad.html":
            content = content.replace('src="comunidad.js"', 'src="../comunidad.js"') if subdir else content.replace('src="comunidad.js"', 'src="comunidad.js?v=6"')
            
        out_path = f"{subdir}{fname}"
        with open(out_path, "w", encoding="utf-8") as f_out:
            f_out.write(content)
            
    print(f"Generated static files for language: {lang}")

print("SSG Complete. Generated all localized static pages successfully.")

# Generate sitemap.xml
sitemap_urls = [
    'https://www.recetadeabuela.com/',
    'https://www.recetadeabuela.com/quienes-somos.html',
    'https://www.recetadeabuela.com/comunidad.html'
]
# Add ES recipe pages
for recipe in recipes_es:
    sitemap_urls.append(f'https://www.recetadeabuela.com/{recipe["id"]}.html')

# Add other languages
for lang, subdir, lang_recipes in languages:
    if not subdir:
        continue
    sitemap_urls.append(f'https://www.recetadeabuela.com/{subdir}')
    sitemap_urls.append(f'https://www.recetadeabuela.com/{subdir}quienes-somos.html')
    sitemap_urls.append(f'https://www.recetadeabuela.com/{subdir}comunidad.html')
    for recipe in lang_recipes:
        sitemap_urls.append(f'https://www.recetadeabuela.com/{subdir}{recipe["id"]}.html')

sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for url in sitemap_urls:
    priority = "1.0" if url == 'https://www.recetadeabuela.com/' or url == 'https://www.recetadeabuela.com/en/' or url == 'https://www.recetadeabuela.com/fr/' or url == 'https://www.recetadeabuela.com/pt/' else ("0.5" if "quienes-somos" in url else "0.8")
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

# Generate robots.txt
robots_txt = """User-agent: *
Allow: /
Disallow: /inscritos.html

Sitemap: https://www.recetadeabuela.com/sitemap.xml
"""

with open("robots.txt", "w", encoding="utf-8") as f_rob:
    f_rob.write(robots_txt)
print("robots.txt generated successfully.")
