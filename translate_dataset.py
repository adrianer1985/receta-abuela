import os
import re
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

# Load cache
CACHE_FILE = "translation_cache.json"
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache = json.load(f)
else:
    cache = {}

def save_cache():
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def cleanup_html_links(text):
    if not isinstance(text, str):
        return text
    # Fix spaces around equals in href
    text = re.sub(r'href\s*=\s*["\']\s*', 'href="', text)
    # Fix spaces inside href URL before .html
    text = re.sub(r'href="([^"]*?)\s*\.html', r'href="\1.html', text)
    # Fix closing quote in href
    text = re.sub(r'href="([^"]*?)\.html\s*"', r'href="\1.html"', text)
    # Fix any spaces in closing tags
    text = re.sub(r'<\s*/\s*a\s*>', '</a>', text)
    return text

def translate_single_string(text, target_lang):
    try:
        # Avoid zero sleep entirely, but parallel requests can be made
        translated = GoogleTranslator(source='auto', target=target_lang).translate(text)
        translated = cleanup_html_links(translated)
        return text, target_lang, translated
    except Exception as e:
        return text, target_lang, None

def main():
    # Read app.js
    with open("app.js", "r", encoding="utf-8") as f:
        js_content = f.read()
        
    match = re.search(r"const recipes = (\[[\s\S]*?\]);\s*\n\s*// App State", js_content)
    if not match:
        print("Error: Could not locate recipes array in app.js!")
        return
        
    recipes = json.loads(match.group(1))
    languages = ['en', 'fr', 'pt']
    
    # 1. Gather all unique strings to translate
    unique_strings_to_translate = {lang: set() for lang in languages}
    
    for recipe in recipes:
        for lang in languages:
            unique_strings_to_translate[lang].add(recipe["title"])
            unique_strings_to_translate[lang].add(recipe["summary"])
            unique_strings_to_translate[lang].add(recipe["intro"])
            unique_strings_to_translate[lang].add(recipe["healthBenefit"])
            unique_strings_to_translate[lang].add(recipe["time"])
            unique_strings_to_translate[lang].add(recipe["rawDuration"])
            unique_strings_to_translate[lang].add(recipe["finalDuration"])
            unique_strings_to_translate[lang].add(recipe["tag"])
            if "extraInfo" in recipe:
                unique_strings_to_translate[lang].add(recipe["extraInfo"])
                
            for item in recipe.get("shoppingList", []):
                unique_strings_to_translate[lang].add(item["name"])
                
            for step in recipe.get("steps", []):
                unique_strings_to_translate[lang].add(step)
                
            for use in recipe.get("altUses", []):
                unique_strings_to_translate[lang].add(use)
                
            for row in recipe.get("comparisonTable", []):
                unique_strings_to_translate[lang].add(row["concepto"])
                unique_strings_to_translate[lang].add(row["casero"])
                unique_strings_to_translate[lang].add(row["comercial"])
                unique_strings_to_translate[lang].add(row["diferencia"])

    # 2. Filter out already cached strings
    strings_missing = []
    for lang in languages:
        for text in unique_strings_to_translate[lang]:
            if not text or not isinstance(text, str):
                continue
            text = text.strip()
            if not text:
                continue
            cache_key = f"{text}|||{lang}"
            if cache_key not in cache:
                strings_missing.append((text, lang))
                
    print(f"Total unique strings to translate: {len(strings_missing)}")
    
    # 3. Translate in parallel using ThreadPoolExecutor
    if strings_missing:
        print("Starting parallel translations...")
        # Use a max of 12 workers to prevent rate limiting while keeping it fast
        max_workers = 12
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(translate_single_string, text, lang) for text, lang in strings_missing]
            
            completed_count = 0
            for future in as_completed(futures):
                text, lang, translated = future.result()
                completed_count += 1
                if translated:
                    cache_key = f"{text}|||{lang}"
                    cache[cache_key] = translated
                if completed_count % 50 == 0:
                    print(f"Translated {completed_count}/{len(strings_missing)} strings...")
                    save_cache()
        save_cache()
        print("All missing strings translated and cached!")
    else:
        print("All strings are already cached!")

    # 4. Construct the final datasets from cache
    def get_cached_translation(text, lang):
        if not text or not isinstance(text, str):
            return text
        text = text.strip()
        if not text:
            return text
        cache_key = f"{text}|||{lang}"
        return cache.get(cache_key, text)

    for lang in languages:
        translated_recipes = []
        for recipe in recipes:
            r = json.loads(json.dumps(recipe))
            
            r["title"] = get_cached_translation(r["title"], lang)
            r["summary"] = get_cached_translation(r["summary"], lang)
            r["intro"] = get_cached_translation(r["intro"], lang)
            r["healthBenefit"] = get_cached_translation(r["healthBenefit"], lang)
            r["time"] = get_cached_translation(r["time"], lang)
            r["rawDuration"] = get_cached_translation(r["rawDuration"], lang)
            r["finalDuration"] = get_cached_translation(r["finalDuration"], lang)
            r["tag"] = get_cached_translation(r["tag"], lang)
            if "extraInfo" in r:
                r["extraInfo"] = get_cached_translation(r["extraInfo"], lang)
                
            for item in r.get("shoppingList", []):
                item["name"] = get_cached_translation(item["name"], lang)
                
            r["steps"] = [get_cached_translation(step, lang) for step in r.get("steps", [])]
            r["altUses"] = [get_cached_translation(use, lang) for use in r.get("altUses", [])]
            
            for row in r.get("comparisonTable", []):
                row["concepto"] = get_cached_translation(row["concepto"], lang)
                row["casero"] = get_cached_translation(row["casero"], lang)
                row["comercial"] = get_cached_translation(row["comercial"], lang)
                row["diferencia"] = get_cached_translation(row["diferencia"], lang)
                
            translated_recipes.append(r)
            
        out_filename = f"recipes_{lang}.json"
        with open(out_filename, "w", encoding="utf-8") as f_out:
            json.dump(translated_recipes, f_out, ensure_ascii=False, indent=2)
        print(f"Saved {out_filename} successfully.")

if __name__ == "__main__":
    main()
