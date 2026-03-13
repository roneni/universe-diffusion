# Universe Diffusion

*(The official AI Image Generation Studio by Psychedelic Universe)*

A high-end generative art platform powered by **Nano Banana 2** (`gemini-3.1-flash-image-preview`) and **Gemini Pro** (`gemini-3-pro-image-preview`) for creating and editing breathtaking, hyper-detailed masterpieces across diverse artistic styles.

## 🌟 State-of-the-Art & Unique Features

### 1. The Prompt Synthesizer (Reverse-Engineering)
**Why it's unique:** Most tools force you to guess the right words to get a specific style. Our Synthesizer does the opposite. You upload an image you love, and the AI's vision model analyzes its "soul"—the lighting, the brushstrokes, the color grading, and the composition. It then reverse-engineers a master-level, highly detailed text prompt that you can use to replicate or evolve that exact style.

### 2. Natural Language Transmutation (Smart Editing)
**Why it's unique:** Traditional AI editing requires you to manually paint masks over areas you want to change (inpainting). Here, you just use natural language. You can take an image and simply tell the AI: "Remove the text," "Change the sky to a starry nebula," or "Make the lighting neon pink." The AI understands the context of the whole image and makes seamless edits without manual masking.

### 3. The Blueprint System (Essence Blending)
**Why it's unique:** Instead of just a history tab, you have a "Blueprint." You can cherry-pick your favorite generated images (or uploaded ones) and pin them to your Blueprint board. It acts as a dynamic mood board where you can combine the "essences" of multiple images to inspire your next generation.

### 4. The Psy-Fi Engine (Audio-Visual Synergy)
**Why it's unique:** Built specifically for the electronic music scene, this engine bridges the gap between audio and visual art. You input a track name or vibe, and it generates a highly specific, rhythm-and-mood-aligned visual prompt. It translates soundscapes into visual instructions.

## 🚀 Advanced Workflow Route: "The Clean & Clone"

A perfect example of a route where you do much more than just generate a picture. This workflow chains our unique tools together to achieve something that would take hours in Photoshop.

**The Scenario:** You found an amazing vintage Psytrance festival flyer, but it's covered in old text, dates, and logos. You want to use that exact artistic style for your own new track cover.

### Step 1: The Seed (Upload)
Go to the Transmute tab and upload the old flyer.

### Step 2: The Cleanup (Transmutation)
Instead of using a clone stamp tool, you simply type: "Remove all text, logos, and typography. Fill in the background naturally to match the surrounding art." The AI processes the image and gives you a perfectly clean, text-free version of the artwork.

### Step 3: Extraction (The Prompt Synthesizer)
Now, take that clean image and drop it into the Prompt Synthesizer. The AI analyzes it and spits out a massive, detailed prompt (e.g., "Psychedelic visionary art, glowing fractal geometry, deep ultraviolet and cyan color palette, biomechanical organic shapes, highly detailed...").

### Step 4: The Evolution (Replicate & Expand)
You take that synthesized prompt over to the Generator. You paste it in, but you add your own twist at the end: "...featuring a glowing crystal skull in the center."

**The Result:** You have successfully stolen the "vibe" of an old, text-heavy image, cleaned it up, reverse-engineered its artistic DNA, and generated a brand new, original masterpiece in that exact same style.

This is what makes the app so powerful—it's not just an image generator; it's a complete visual alchemy lab! Ready to manifest some art?

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
