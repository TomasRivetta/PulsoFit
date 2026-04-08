async function testLocalApi() {
  try {
    const res = await fetch('http://localhost:3000/api/exercises?query=squat');
    const data = await res.json();
    console.log("Local API first result keys:", Object.keys(data.results?.[0] || {}));
    console.log("Local API first result data:", JSON.stringify(data.results?.[0], null, 2));
  } catch (err) {
    console.error("Local API test failed:", err.message);
  }
}

testLocalApi();
