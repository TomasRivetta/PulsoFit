const apiKey = '0e8aa31d3dmsh783c8ac9c933900p16a3cajsn980bc7f781bb';

async function testExerciseDB() {
  const url = `https://exercisedb.p.rapidapi.com/exercises/name/squat?limit=1`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("RapidAPI Direct response keys:", Object.keys(result[0] || {}));
    console.log("RapidAPI Direct response data sample:", JSON.stringify(result[0], null, 2));
  } catch (error) {
    console.error(error);
  }
}

testExerciseDB();
