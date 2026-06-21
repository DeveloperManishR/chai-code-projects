
// test-keys.js

const fs = require("fs");

const keys = fs
  .readFileSync("keys.txt", "utf8")
  .split("\n")
  .map(k => k.trim())
  .filter(Boolean);

async function testKey(key) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${key}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log(`✅ VALID: ${key}`);
    } else if (response.status === 429) {
      console.log(`⚠️ VALID (Quota/Billing Issue): ${key}`);
    } else if (response.status === 401) {
      console.log(`❌ INVALID: ${key}`);
    } else {
      console.log(`❓ ${key} -> ${response.status}`);
      console.log(data);
    }
  } catch (err) {
    console.error(`Error testing ${key}:`, err.message);
  }
}

(async () => {
  for (const key of keys) {
    await testKey(key);
  }
})();

