
const API_URL = "http://localhost:3000/api/decision";
const API_KEY = "bm_441de19bddce4a8295eaeb0f1c40e0eb";

const decisions = [
  // Biased Batch: High Male Selection, Low Female Selection
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "rejected" },
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "rejected" },
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "selected" },
  { gender: "male", decision: "rejected" },
  
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "selected" },
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "selected" },
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "rejected" },
  { gender: "female", decision: "rejected" },
];

async function runSimulation() {
  console.log("🚀 Starting AI Bias Simulation for Key: " + API_KEY);
  
  for (const data of decisions) {
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify(data)
      });
      
      const result = await resp.json();
      console.log(`✅ [${data.gender}] -> ${data.decision}: ${resp.status}`);
      
      // Artificial delay to simulate real-time processing
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error("❌ Failed to send decision:", err.message);
    }
  }
  
  console.log("\n✨ Simulation Complete! Check your Dashboard.");
}

runSimulation();
