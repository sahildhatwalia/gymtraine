import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
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
