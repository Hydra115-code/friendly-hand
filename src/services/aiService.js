import axios from 'axios';

// 👇 TU LLAVE (Mantenla igual)
const API_KEY = 'AIzaSyCHWdmqbsvJszEOnE3sdh2XpUDsDe7urkQ'; 
const ENABLE_AI = true; 

const extractJSON = (text) => {
  try {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) throw new Error("No JSON found");
    const jsonString = text.substring(startIndex, endIndex + 1);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("JSON Error:", text);
    throw e;
  }
};

// 1. GENERATE PLAN (English Prompt)
export const generateDailyPlan = async (userProfile, goal) => {
  if (!ENABLE_AI) return { tasks: [{ id: 1, title: 'Test Task', time: '5 min' }], tip: "Design mode." };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  // 🔥 PROMPT IN ENGLISH
  // Le decimos explícitamente que traduzca el input del usuario si es necesario
  const prompt = `
    You are Friendly Hand, an expert ADHD and productivity assistant.
    User Profile: Name: ${userProfile.name}, Struggle: "${userProfile.struggle}".
    Current Goal: "${goal}".
    
    INSTRUCTION: Generate a detailed action plan. Even if the user input is in Spanish, YOU MUST OUTPUT IN ENGLISH.
    Generate between 5 to 7 small, actionable tasks.
    
    Response format (Strict JSON, no markdown):
    { 
      "tasks": [ 
        {"id": 1, "title": "Task title in English", "time": "5 min"},
        {"id": 2, "title": "Another task...", "time": "10 min"}
      ], 
      "tip": "A short, motivating tip in English" 
    }
  `;

  try {
    const response = await axios.post(endpoint, { contents: [{ parts: [{ text: prompt }] }] }, { headers: { 'Content-Type': 'application/json' } });
    return extractJSON(response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    return { tasks: [], tip: "AI is taking a nap. Try adding tasks manually." };
  }
};

// 2. CHAT (English Context)
export const sendChatMessage = async (history, userProfile) => {
  if (!ENABLE_AI) return "AI Offline.";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  
  const systemContext = `You are Friendly Hand. Talking to ${userProfile.name}. Struggle: "${userProfile.struggle}". Be brief, warm, and helpful. ALWAYS speak in English.`;
  
  const contents = [
    { role: "user", parts: [{ text: systemContext }] },
    ...history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }))
  ];

  try {
    const res = await axios.post(endpoint, { contents }, { headers: { 'Content-Type': 'application/json' } });
    return res.data.candidates[0].content.parts[0].text.trim();
  } catch (error) { return "Connection error."; }
};

// 3. VERIFY TASK (English Feedback)
export const verifyTaskWithVision = async (base64Image, taskTitle) => {
    if (!ENABLE_AI) return { approved: true, feedback: "Demo Mode: Approved." };
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const prompt = `
      Kind Verifier. Task: "${taskTitle}". Analyze the image. Is the task done?
      Response JSON: { "approved": true/false, "feedback": "Short feedback phrase in English" }
    `;
  
    try {
      const res = await axios.post(endpoint, { contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64Image } }] }] }, { headers: { 'Content-Type': 'application/json' } });
      return extractJSON(res.data.candidates[0].content.parts[0].text);
    } catch (error) { return { approved: true, feedback: "Couldn't see clearly, but I trust you!" }; }
};

// 4. UNBLOCK ME (English)
export const unblockMeWithVision = async (base64Image) => {
    if (!ENABLE_AI) return { tasks: [], tip: "Demo Mode." };
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const prompt = `
      ADHD Expert. Analyze this messy room/situation. Break it down into 3 simple steps in English.
      Response JSON: { "tasks": [{"id": 1, "title": "Step 1 in English", "time": "..."}], "tip": "Short tip in English" }
    `;
  
    try {
      const res = await axios.post(endpoint, { contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64Image } }] }] }, { headers: { 'Content-Type': 'application/json' } });
      return extractJSON(res.data.candidates[0].content.parts[0].text);
    } catch (error) { return { tasks: [{id:Date.now(), title:'Breathe', time:'1 min'}], tip: "AI Error." }; }
};