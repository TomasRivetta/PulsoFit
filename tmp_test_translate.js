async function translateText(text, source, target) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) console.log("HTTP Error:", res.status);
    const data = await res.json();
    console.log("Success:", data[0].map(x => x[0]).join(''));
  } catch (error) {
    console.error('Translation error:', error);
  }
}

translateText('barbell pullover to press', 'en', 'es');
translateText('sentadilla', 'es', 'en');
