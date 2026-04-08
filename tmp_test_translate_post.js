async function testPost(text, source, target) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ q: text })
    });
    if (!res.ok) console.log("HTTP Error:", res.status);
    const data = await res.json();
    console.log("Success:", data[0].map(x => x[0]).join(''));
  } catch (error) {
    console.error('Translation error:', error);
  }
}

testPost('cable kneeling crunch | cable seated crunch', 'en', 'es');
