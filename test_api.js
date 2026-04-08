const RAPIDAPI_KEY = "1ad1b75d46mshb418b0fb4c81feap113adcjsn43576dcf0ec7";

async function test() {
  try {
    const url = `https://exercisedb.p.rapidapi.com/exercises/name/squat?limit=1`;
    const res = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    const data = await res.json();
    console.log("Full First Item:", JSON.stringify(data[0] || {}, null, 2));
  } catch (err) {
    console.error("Test Error:", err);
  }
}

test();
