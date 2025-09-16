import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model = 'stable-diffusion-xl' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Model configurations
  const modelConfigs = {
    'stable-diffusion-xl': {
      url: 'https://router.huggingface.co/nscale/v1/images/generations',
      modelName: 'stabilityai/stable-diffusion-xl-base-1.0'
    },
    'qwen-image': {
      url: 'https://router.huggingface.co/fal-ai/fal-ai/qwen-image',
      modelName: 'fal-ai/qwen-image'
    }
  };

  const selectedModel = modelConfigs[model as keyof typeof modelConfigs];
  if (!selectedModel) {
    return res.status(400).json({ error: 'Invalid model selected' });
  }

  if (!process.env.HF_TOKEN) {
    return res.status(500).json({ error: 'Hugging Face token not configured' });
  }

  try {
    // Different API formats for different models
    let requestBody;
    let apiUrl = selectedModel.url;

    if (model === 'qwen-image') {
      // Qwen model uses a different format
      requestBody = {
        prompt: prompt,
        image_size: "square_hd",
        num_inference_steps: 25,
        guidance_scale: 3.5
      };
    } else if (model.startsWith('flux')) {
      // Flux models use a different format
      requestBody = {
        prompt: prompt,
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5
      };
    } else {
      // Stable Diffusion XL format
      requestBody = {
        response_format: "b64_json",
        prompt: prompt,
        model: selectedModel.modelName,
      };
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Handle different response formats for different models
    let imageData;

    if (model === 'qwen-image' || model.startsWith('flux')) {
      // Qwen and Flux models return image URL or different format
      imageData = result.images?.[0]?.url || result.image?.url || result.data?.[0]?.url;
      if (imageData) {
        // If it's a URL, we need to fetch and convert to base64
        const imageResponse = await fetch(imageData);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString('base64');
        imageData = `data:image/png;base64,${base64}`;
      }
    } else {
      // Stable Diffusion XL format
      imageData = result.data?.[0]?.b64_json;
      if (imageData) {
        imageData = `data:image/png;base64,${imageData}`;
      }
    }

    if (!imageData) {
      console.error('API Response:', result);
      throw new Error('Invalid response format from Hugging Face API');
    }

    res.status(200).json({
      imageData: imageData
    });
  } catch (error: any) {
    console.error('Hugging Face API error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      details: error.message
    });
  }
}
