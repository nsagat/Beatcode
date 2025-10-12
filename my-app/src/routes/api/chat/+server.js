import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { question, context } = await request.json();

  if (!OPENAI_API_KEY) {
    return json({ error: 'AI API key not configured on the server.' }, { status: 500 });
  }

  if (!question) {
    return json({ error: 'Question is required.' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful LeetCode assistant in a collaborative coding room. Be friendly, encouraging, and provide hints rather than direct solutions. ${context}`
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 150,
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get a response from the AI.');
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content;
    
    if (!reply) {
        throw new Error('The AI returned an empty response.');
    }

    return json({ reply });

  } catch (err) {
    console.error(err);
    return json({ error: err.message }, { status: 500 });
  }
}
