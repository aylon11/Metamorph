import express from 'express';
import cors from 'cors';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()], // Assumes GOOGLE_GENAI_API_KEY is in env
  model: googleAI.model('gemini-3.1-flash-lite-preview'),
});

// Define the re-optimization flow
const reoptimizeFlow = ai.defineFlow(
  { name: 'reoptimizeFlow' },
  async (input) => {
    const { campaigns } = input;

    const prompt = `
      You are a Senior Google Ads Growth Specialist with deep expertise in Quality Score optimization, search intent alignment, and Responsive Search Ads (RSA) best practices.
      
      I am providing you with a list of Meta Ads campaigns, each with its name and associated creative assets (headlines). Meta assets tend to be more emotional, visually descriptive, and social-proof driven.
      
      Your task is to perform a "Campaign Metamorphosis": for EACH campaign, translate and re-optimize its assets into high-intent, performance-driven text assets for a Google Ads Search campaign.
      
      Meta Campaigns Data:
      ${campaigns.map(c => `
      - Campaign ID: ${c.id}
        Name: ${c.name}
        Source Headlines: ${c.assets.headlines.join(' | ')}
      `).join('\n')}
      
      Guidelines for Google Ads Assets (Produce these FOR EACH campaign):
      1. **Headlines**: Generate exactly 15 headlines. Max 30 characters each. Include a mix of high-intent keywords, value props, and CTAs.
      2. **Descriptions**: Generate exactly 4 descriptions. Max 90 characters each.
      3. **Keywords**: Generate a list of 10 highly relevant keywords.
         
      Strict Output Format:
      You MUST respond with a valid JSON object ONLY. Do not include any markdown formatting, backticks, or extra text. The JSON must have this exact structure, mapping campaign IDs to their generated assets:
      {
        "meta_1": {
          "headlines": ["Headline 1", "Headline 2", ...],
          "descriptions": ["Description 1", "Description 2", ...],
          "keywords": ["keyword 1", "keyword 2", ...]
        },
        "meta_2": {
          ...
        }
      }
      
      Ensure all string lengths are strictly within the limits (30 for headlines, 90 for descriptions).
    `;

    const response = await ai.generate(prompt, { config: { temperature: 0.8 } });

    try {
      // Attempt to parse JSON response
      return JSON.parse(response.text);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', response.text);
      // Fallback or error handling
      return {
        error: "Failed to parse AI response",
        raw: response.text
      };
    }
  }
);

app.post('/api/reoptimize', async (req, res) => {
  try {
    const result = await reoptimizeFlow(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error running Genkit flow:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
