import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!process.env.NEBIUS_API_KEY) {
    return res.status(500).json({ error: 'Nebius API key not configured' });
  }

  try {
    const response = await client.images.generate({
      model: "black-forest-labs/flux-schnell",
      prompt: prompt,
      response_format: "b64_json",
      width: 1024,
      height: 1024,
      num_inference_steps: 4,
      negative_prompt: "",
      seed: -1,
    } as any);

    const imageData = response.data?.[0]?.b64_json;

    if (!imageData) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    // Return the base64 image data
    res.status(200).json({ imageData: `data:image/png;base64,${imageData}` });
  } catch (error: any) {
    console.error('Nebius API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate image', 
      details: error.message 
    });
  }
}
