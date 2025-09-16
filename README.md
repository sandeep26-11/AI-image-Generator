# AI Studio: Generate & Analyze

A modern Next.js application with dual AI capabilities - generate images from text using Nebius AI and analyze existing images using Hugging Face.

## Features

### Text-to-Image (Nebius AI)
- 🎨 Generate high-quality images from text descriptions using Flux-Schnell
- ⚡ Fast generation with 4 inference steps
- 📥 Download generated images directly

### Image Analysis (Hugging Face) 
- 🔍 Analyze existing images with detailed descriptions
- 🤖 Powered by Qwen2-VL-7B-Instruct model
- 🌐 Support for any publicly accessible image URL

### Technical Features
- 🚀 Built with Next.js and TypeScript
- 💫 Beautiful, responsive split-screen UI with Tailwind CSS
- 🔒 Secure API key handling
- 📱 Mobile-responsive design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Keys:**
   - Copy `.env.example` to `.env.local` and add your API keys:
   ```
   NEBIUS_API_KEY=your_actual_nebius_api_key_here
   HF_TOKEN=your_actual_hugging_face_token_here
   ```
   - Get Nebius API key from: https://api.studio.nebius.com/
   - Get Hugging Face token from: https://huggingface.co/settings/tokens

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Text-to-Image (Left Side)
1. Enter a detailed description of the image you want to generate
2. Click "Generate Image" or press Enter
3. Wait for the AI to create your image (using Flux-Schnell model)
4. View and download the generated image

### Image Analysis (Right Side)
1. Enter a publicly accessible image URL
2. Click "Analyze Image" or press Enter
3. Wait for the AI to analyze the image
4. View the detailed description and analysis

## Tech Stack

- **Framework:** Next.js 13.5.6
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI APIs:** Nebius AI Flux-Schnell + Hugging Face Qwen2-VL
- **Deployment:** Ready for Vercel, Netlify, or any Node.js hosting

## API Routes

- `POST /api/generate-image` - Generates an image from a text prompt using Flux-Schnell
- `POST /api/analyze-image` - Analyzes an image from URL using Qwen2-VL

## Environment Variables

- `NEBIUS_API_KEY` - Your Nebius API key (required)
- `HF_TOKEN` - Your Hugging Face token (required)

## Model Details

### Nebius AI (Text-to-Image)
- **Model:** black-forest-labs/flux-schnell
- **Output Format:** Base64 encoded PNG
- **Resolution:** 1024x1024
- **Inference Steps:** 4 (optimized for speed)

### Hugging Face (Image Analysis)
- **Model:** Qwen/Qwen2-VL-7B-Instruct:hyperbolic
- **Input:** Image URL
- **Output:** Detailed text description

## License

MIT License
