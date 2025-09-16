# AI Studio: Generate Images

A modern Next.js application with dual AI capabilities - generate images from text using Nebius AI and Hugging Face, and analyze images using Hugging Face vision models.

## Features

### Text-to-Image (Nebius AI)
- 🎨 Generate high-quality images from text descriptions using Flux-Schnell  
- ⚡ Fast generation with 4 inference steps  
- 📥 Download generated images directly  

### Multiple Models (Hugging Face)  
- 🖼 **Stable Diffusion XL** → Generate stunning images from text prompts  
- 🔍 **Qwen Image** → Perform text-to-image analysis and descriptions  
- 🌐 Support for publicly accessible image URLs and flexible model usage  

### Technical Features
- 🚀 Built with Next.js and TypeScript  
- 💫 Beautiful, responsive split-screen UI with Tailwind CSS  
- 🔒 Secure API key handling  
- 📱 Mobile-responsive design  

## Setup

1. **Install dependencies:**
   ```bash
   npm install


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

### Right Panel → Hugging Face Models
1. Stable Diffusion XL 
    Enter a text description
    Click "Generate Image"
    View your generated high-quality image
2. Qwen Image
## Tech Stack

- **Framework:** Next.js 13.5.6
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI APIs:** Nebius AI Flux-Schnell + Hugging Face Qwen


## API Routes

- `POST /api/generate-image` - Generates an image from a text prompt using Flux-Schnell
- `POST /api/analyze-image` - Analyzes an image from URL using Qwen2-VL

## Environment Variables

- `NEBIUS_API_KEY` - Your Nebius API key (required)
- `HF_TOKEN` - Your Hugging Face token (required)


