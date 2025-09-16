import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
    // Nebius (Text-to-Image) state
    const [prompt, setPrompt] = useState('');
    const [imageData, setImageData] = useState('');
    const [nebiusLoading, setNebiusLoading] = useState(false);
    const [nebiusError, setNebiusError] = useState('');

    // Hugging Face (Image Generation) state
    const [hfPrompt, setHfPrompt] = useState('');
    const [hfImageData, setHfImageData] = useState('');
    const [hfLoading, setHfLoading] = useState(false);
    const [hfError, setHfError] = useState('');
    const [hfModel, setHfModel] = useState('stable-diffusion-xl');

    const generateImage = async () => {
        if (!prompt.trim()) {
            setNebiusError('Please enter a prompt');
            return;
        }

        setNebiusLoading(true);
        setNebiusError('');
        setImageData('');

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            setImageData(data.imageData);
        } catch (err: any) {
            setNebiusError(err.message);
        } finally {
            setNebiusLoading(false);
        }
    };

    const generateHfImage = async () => {
        if (!hfPrompt.trim()) {
            setHfError('Please enter a prompt');
            return;
        }

        setHfLoading(true);
        setHfError('');
        setHfImageData('');

        try {
            const response = await fetch('/api/generate-image-hf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: hfPrompt, model: hfModel }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            setHfImageData(data.imageData);
        } catch (err: any) {
            setHfError(err.message);
        } finally {
            setHfLoading(false);
        }
    };

    const handleNebiusKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateImage();
        }
    };

    const handleHfKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateHfImage();
        }
    };

    return (
        <>
            <Head>
                <title>AI Text-to-Image Generator</title>
                <meta name="description" content="Generate images from text using AI" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            AI Studio: Generate & Analyze
                        </h1>
                        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                            Create stunning images with Nebius AI or analyze existing images with Hugging Face
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Nebius Text-to-Image Side */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    🎨 Text to Image
                                </h2>
                                <p className="text-gray-300 text-sm">Powered by Nebius AI Flux-Schnell</p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="prompt" className="block text-lg font-medium text-white mb-3">
                                    Describe your image:
                                </label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyPress={handleNebiusKeyPress}
                                    placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the orange and pink sky..."
                                    className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                                    rows={4}
                                    disabled={nebiusLoading}
                                />
                            </div>

                            <button
                                onClick={generateImage}
                                disabled={nebiusLoading || !prompt.trim()}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                            >
                                {nebiusLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Generating Image...
                                    </div>
                                ) : (
                                    'Generate Image'
                                )}
                            </button>

                            {nebiusError && (
                                <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                                    <p className="text-red-200 text-center">{nebiusError}</p>
                                </div>
                            )}

                            {imageData && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 text-center">
                                        Generated Image:
                                    </h3>
                                    <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white/10 p-4">
                                        <img
                                            src={imageData}
                                            alt="Generated image"
                                            className="w-full h-auto rounded-lg max-w-full"
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <a
                                            href={imageData}
                                            download="generated-image.png"
                                            className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                                        >
                                            Download Image
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hugging Face Image Generation Side */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    🎨 AI Image Generation
                                </h2>
                                <p className="text-gray-300 text-sm">Multiple Models via Hugging Face</p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="hfModel" className="block text-lg font-medium text-white mb-3">
                                    Select Model:
                                </label>
                                <select
                                    id="hfModel"
                                    value={hfModel}
                                    onChange={(e) => setHfModel(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                    disabled={hfLoading}
                                >
                                    <option value="stable-diffusion-xl" className="bg-gray-800 text-white">Stable Diffusion XL</option>
                                    <option value="qwen-image" className="bg-gray-800 text-white">Qwen Image</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="hfPrompt" className="block text-lg font-medium text-white mb-3">
                                    Describe your image:
                                </label>
                                <textarea
                                    id="hfPrompt"
                                    value={hfPrompt}
                                    onChange={(e) => setHfPrompt(e.target.value)}
                                    onKeyPress={handleHfKeyPress}
                                    placeholder="Astronaut riding a horse on Mars, digital art, highly detailed..."
                                    className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                                    rows={4}
                                    disabled={hfLoading}
                                />
                            </div>

                            <button
                                onClick={generateHfImage}
                                disabled={hfLoading || !hfPrompt.trim()}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                            >
                                {hfLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Generating Image...
                                    </div>
                                ) : (
                                    'Generate Image'
                                )}
                            </button>

                            {hfError && (
                                <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                                    <p className="text-red-200 text-center">{hfError}</p>
                                </div>
                            )}

                            {hfImageData && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 text-center">
                                        Generated Image:
                                    </h3>
                                    <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white/10 p-4">
                                        <img
                                            src={hfImageData}
                                            alt="Generated image"
                                            className="w-full h-auto rounded-lg max-w-full"
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <a
                                            href={hfImageData}
                                            download="hf-generated-image.png"
                                            className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                                        >
                                            Download Image
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Built with Next.js • Nebius AI • Hugging Face
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
