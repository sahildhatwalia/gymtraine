import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();
//working example of using the Groq SDK to call the chat completions endpoint with a specific model and response format. Make sure to set your GROQ_API_KEY in your environment variables before running this script.const groq = new Groq({
  apiKey:  process.env.GROQ_API_KEY || '',
});

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Act as an elite AI Fitness Coach. Return a JSON object with a "workoutPlan" array of 7 items. Return as valid JSON.' }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });
    console.log(JSON.stringify(JSON.parse(completion.choices[0].message.content), null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
