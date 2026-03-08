# Universe Diffusion

*(The official AI Image Generation Studio by Psychedelic Universe)*

A high-end generative art platform powered by **Nano Banana 2** (`gemini-3.1-flash-image-preview`) and **Gemini Pro** (`gemini-3-pro-image-preview`) for creating and editing breathtaking, hyper-detailed masterpieces across diverse artistic styles.

## 🌟 Features

*   **High-End Artistic Styles**: Generate images using curated, expert-level aesthetic overrides:
    *   *Bioluminescent Macro*
    *   *Cyber-Renaissance*
    *   *Ethereal Dreamscape*
    *   *Dark Matter*
    *   *Liquid Chrome*
    *   *Retro-Futurism*
*   **Expert Prompt Engineering**: Powered by Gemini Pro, the "Enhance Prompt" feature intelligently rewrites your prompt to focus on lighting, camera angles, textures, and atmosphere to generate a true masterpiece.
*   **Resolution Control**: Choose between `1K (Fast)`, `2K (Detailed)`, and `4K (Masterpiece)` for your generations.
*   **Cinematic Aspect Ratios**: Support for `1:1`, `16:9`, `9:16`, `4:1` (Cinematic), and `8:1` (Ultrawide).
*   **Image Transmutation (Editing)**: Upload an existing image and use text prompts to seamlessly edit, alter, or remove elements from it.
*   **Image Replication (Analysis)**: Upload a source image for the neural core to analyze its essence and attempt to replicate its mood, style, and composition.
*   **Local Gallery**: Automatically saves your generated masterpieces to your browser's local storage.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS
*   **Build Tool**: Vite
*   **AI Integration**: `@google/genai` SDK
*   **Models Used**:
    *   `gemini-3.1-flash-image-preview` (Nano Banana 2) - Fast, high-quality image generation.
    *   `gemini-3-pro-image-preview` (Gemini Pro Image) - Advanced image generation and editing.
    *   `gemini-3.1-pro-preview` - Expert prompt enhancement.
    *   `gemini-3-flash-preview` - Image analysis and prompt extraction.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   A Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd universe-diffusion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Usage

*   **Generator**: Enter a prompt, select your desired aspect ratio, resolution, and style, then click "Generate Image".
*   **Transmutation**: Click on an image in your gallery to set it as the source, then enter a prompt describing what should change (e.g., "Remove the text and seamlessly fill in the background").
*   **Replicator**: Upload an image to the Analyzer. The AI will extract a highly detailed prompt and attempt to recreate the image's essence.
