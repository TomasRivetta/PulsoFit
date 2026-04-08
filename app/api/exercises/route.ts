import { NextResponse, NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const translateText = async (text: string, source: string, target: string) => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ q: text })
    });
    
    if (!res.ok) {
      throw new Error(`Google Translate API error: ${res.status}`);
    }
    const data = await res.json();
    return data[0].map((x: any) => x[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text if translation fails
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Falta la API Key' }, { status: 500 });
  }

  try {
    // 1. Translate search query from ES to EN
    let englishQuery = query;
    try {
      const translated = await translateText(query, 'es', 'en');
      if (translated) englishQuery = translated.toLowerCase();
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from ExerciseDB
    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(englishQuery)}?limit=10`, {
      headers: {
        'X-RapidAPI-Key': apiKey.replace(/[\r\n]/g, ''), 
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.error("RapidAPI Error Text:", await response.text());
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) return NextResponse.json({ results: [] });

    // Debug raw response from RapidAPI provider
    try {
      const logPath = path.join(process.cwd(), 'api_debug_log.json');
      fs.writeFileSync(logPath, JSON.stringify(data[0], null, 2));
    } catch (e) {
      console.error("Failed to write debug log", e);
    }
    
    console.log(`Fetched ${data.length} exercises. First item keys:`, Object.keys(data[0] || {}));
    if (data[0]) {
       console.log("ITEM 0 RAW (logged to file):", Object.keys(data[0]));
    }

    // 3. Batch translate results EN to ES
    const translatableItems: string[] = [];
    data.forEach((ex: any) => {
      translatableItems.push(ex.name || "");
      translatableItems.push(ex.target || "");
      translatableItems.push(ex.equipment || "");
      translatableItems.push(ex.bodyPart || "");
      if (ex.instructions) {
        ex.instructions.forEach((inst: string) => translatableItems.push(inst || ""));
      }
    });

    const delimiter = ' ||| ';
    const blockToTranslate = translatableItems.join(delimiter);
    
    let translatedItems = translatableItems;
    try {
      const translatedBlock = await translateText(blockToTranslate, 'en', 'es');
      translatedItems = translatedBlock.split(/\s*\|\|\|\s*/).map((s: string) => s.trim());
      
      console.log(`Translation: Input ${translatableItems.length}, Output ${translatedItems.length}`);
    } catch (e) {
      console.error("Translation block split failed, falling back to original", e);
    }

    // Re-assign translated properties safely
    let cursor = 0;
    const translatedResults = data.map((ex: any) => {
      const translatedEx = { 
        ...ex,
        // Using local proxy for ExerciseDB images to bypass obsolete CDN domains
        // and keep the RapidAPI key secure on the server.
        gifUrl: `/api/exercises/image/${ex.id}`
      };
      
      try {
        // Use ?? to fallback to original if translation is missing for a specific field
        translatedEx.name = translatedItems[cursor++] || ex.name;
        translatedEx.target = translatedItems[cursor++] || ex.target;
        translatedEx.equipment = translatedItems[cursor++] || ex.equipment;
        translatedEx.bodyPart = translatedItems[cursor++] || ex.bodyPart;
        
        if (ex.instructions) {
          translatedEx.instructions = ex.instructions.map(() => translatedItems[cursor++] || "");
        }
      } catch (e) {
        console.error("Error mapping item at cursor", cursor, e);
      }
      return translatedEx;
    });

    if (translatedResults[0]) {
       console.log("Results finalized with local proxy GIFs:", translatedResults[0].name);
    }

    return NextResponse.json({ results: translatedResults });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
