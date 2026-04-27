import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: '' + process.env.GROQ_API_KEY,
});

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'llama3-8b-8192',
    });
    console.log(completion.choices[0].message.content);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
