# Quespapgen – AI-Powered Question Paper Generator

Quespapgen is a modern web application for generating question papers using both cloud-based and local AI models. It supports a wide range of input formats, advanced configuration, and beautiful export options, making it ideal for educators, examiners, and institutions.

---

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [AI Models & Extraction](#ai-models--extraction)
- [Configuration & Customization](#configuration--customization)
- [Export & Sharing](#export--sharing)
- [Tech Stack](#tech-stack)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **AI-Powered Question Generation:** Generate high-quality questions from syllabus content using both Google Gemini (Cloud API) and fast, private Local AI (including Ollama support).
- **Multiple Input Formats:** Upload PDF, Word, text, or image files. Automatic extraction and processing.
- **Section-wise & Custom Configuration:** Define sections, question types, difficulty levels, marks, and more.
- **Instant Local AI:** Works offline, unlimited usage, and complete privacy. Supports running local LLMs (Ollama, MLC, etc.).
- **Cloud LLM Integration:** Use Google Gemini for advanced, context-aware question generation.
- **Beautiful UI:** Responsive, dark mode, onboarding, analytics, and more.
- **Export & Share:** Download as PDF, DOCX, or copy/share directly.
- **Subscription & Usage Tracking:** Free and premium plans, with usage indicators and subscription management.

---

## Demo
> _Add a link or screenshots here if available._

---

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/quespapgen.git
cd quespapgen
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Install Additional AI/NLP Libraries
For local extraction and LLM support:
```bash
npm install compromise
```

If you want to use Ollama (local LLM):
- [Install Ollama](https://ollama.com/download) on your system (Windows, Mac, or Linux)
- Start Ollama server:
```bash
ollama serve
```
- Pull a model (e.g., Mistral, Llama2, Phi3):
```bash
ollama pull mistral
ollama pull llama2
ollama pull phi3
```

### 4. Start the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
 
if some errorsshows up like compromise an dsome install these too  
 npm install compromise tesseract.js
---

## Usage
1. **Upload Syllabus:** Drag and drop or select a PDF, Word, text, or image file (max 10MB).
2. **Configure Paper:**
   - Choose question types, difficulty, marks, and sections.
   - Use templates or manual configuration.
3. **Select AI Mode:**
   - **Cloud API:** Requires a valid Google Gemini API key (set in the UI).
   - **Local AI:** Works instantly, no key required. Uses compromise for extraction and can use Ollama/MLC for local LLMs if configured.
4. **Generate Questions:** Click "Generate" to create your question paper.
5. **Review & Export:** View analytics, edit questions, and export as PDF/DOCX or copy/share.

---

## AI Models & Extraction

### Cloud API (Gemini)
- Uses Google Gemini LLM for advanced, context-aware question generation.
- Requires a valid API key (set in the app).
- Handles complex extraction and produces highly varied, professional questions.

### Local AI
- Uses the [compromise](https://github.com/spencermountain/compromise) NLP library for fast, in-browser extraction of topics, concepts, and key points.
- Supports running local LLMs via [Ollama](https://ollama.com/) (Mistral, Llama2, Phi3, etc.) or [MLC](https://mlc.ai/).
- Generates questions using a large set of shuffled templates for variety.
- Ensures the requested number of questions, maximizing uniqueness and minimizing repetition.
- Works offline and never sends your data to the cloud.

#### Using Ollama with Quespapgen
- Install and start Ollama as described above.
- Pull your desired model (e.g., `ollama pull mistral`).
- The app will connect to your local Ollama server for question generation if configured.
- You can switch between models in the UI if multiple are available.

---

## How the AI Models Work (In-Depth)

### 1. Cloud API (Google Gemini)

- **What it is:**  
  Google Gemini is a state-of-the-art large language model (LLM) provided by Google. It is accessed via API using your API key.
- **How it works in Quespapgen:**  
  - When you select "Cloud API" mode, your syllabus content and configuration are sent to the Gemini API.
  - The app builds a detailed prompt, including your section structure, question types, marks, and difficulty.
  - Gemini processes the prompt and syllabus, then generates a set of questions that are context-aware, varied, and professional.
  - The questions are parsed and displayed in the app.
- **Strengths:**  
  - Handles complex, unstructured input.
  - Produces highly varied, creative, and contextually relevant questions.
  - Supports image-based extraction (if enabled).
- **Limitations:**  
  - Requires internet and a valid API key.
  - Subject to API quotas and costs.

---

### 2. Local AI (compromise + Ollama/MLC)

#### a. compromise (NLP Extraction)

- **What it is:**  
  [compromise](https://github.com/spencermountain/compromise) is a lightweight JavaScript NLP library that runs entirely in your browser or Node.js.
- **How it works in Quespapgen:**  
  - When you select "Local AI" mode, the app uses compromise to analyze your syllabus text.
  - It extracts noun phrases, verbs, and key points (topics, concepts, skills, etc.).
  - These extracted items are used as the basis for question generation.
- **Strengths:**  
  - Fast, private, and works offline.
  - No data ever leaves your device.
- **Limitations:**  
  - Extraction is simpler than a full LLM; may miss subtle context or relationships.
  - Best results with well-structured, clear input.

#### b. Local LLMs via Ollama/MLC

- **What it is:**  
  [Ollama](https://ollama.com/) and [MLC](https://mlc.ai/) allow you to run real LLMs (like Mistral, Llama2, Phi3) on your own computer, without sending data to the cloud.
- **How it works in Quespapgen:**  
  - If Ollama is installed and running (`ollama serve`), the app can connect to your local Ollama server.
  - You can pull and use different models (e.g., `ollama pull mistral`).
  - The app sends your prompt and syllabus to the local LLM, which generates questions similar to a cloud LLM, but entirely on your device.
- **Strengths:**  
  - True LLM-level quality, but fully private and offline.
  - Supports multiple models; you can experiment with different LLMs.
- **Limitations:**  
  - Requires a powerful computer for best performance.
  - Initial model downloads can be large (several GB).
  - May require additional configuration for advanced use.

---

### 3. Question Generation Logic

- **Extraction:**  
  - For Local AI, compromise extracts a list of unique topics, concepts, and key points from your syllabus.
  - For Cloud/Ollama, the LLM itself does the extraction as part of its prompt processing.
- **Template-Based Generation (Local AI):**  
  - The app uses a large set of shuffled question templates for each type and difficulty.
  - It pairs each template with an extracted topic/concept to generate a question.
  - Ensures maximum uniqueness and variety, but will repeat if you request more questions than unique topics.
- **LLM-Based Generation (Cloud/Ollama):**  
  - The LLM receives a detailed prompt and generates questions in natural language, often with more creativity and context-awareness.

---

### 4. How to Choose a Model

- **Use Cloud API (Gemini) if:**
  - You want the highest quality, most creative questions.
  - You have a valid API key and internet access.
- **Use Local AI (compromise) if:**
  - You want instant, private, offline generation.
  - Your syllabus is well-structured and you want fast results.
- **Use Local LLM (Ollama/MLC) if:**
  - You want LLM-level quality but need privacy or offline capability.
  - You have Ollama/MLC installed and a suitable model pulled.

---

### 5. Example Workflow

1. **Upload your syllabus (PDF, DOCX, TXT, or image).**
2. **Configure your paper (sections, types, marks, etc.).**
3. **Select your preferred AI mode:**
   - Cloud API (Gemini)
   - Local AI (compromise)
   - Local LLM (Ollama/MLC)
4. **Click Generate.**
5. **Review, edit, and export your question paper.**

---

## Configuration & Customization
- **Section-wise Paper:** Add multiple sections, each with its own question types, marks, and difficulty.
- **Templates:** Use built-in templates for quick setup, or configure everything manually.
- **Theme:** Toggle between light and dark mode.
- **Subscription:** Track usage and manage your plan from within the app.

---

## Export & Sharing
- **PDF & DOCX Export:** Download your question paper in professional formats.
- **Copy to Clipboard:** Instantly copy the paper for pasting elsewhere.
- **Share:** Built-in sharing options for easy distribution.

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS (customized, dark mode support)
- **AI/NLP:** Google Gemini API, compromise (local NLP), Ollama/MLC (local LLM)
- **PDF/DOCX:** jsPDF, docx
- **Other:** Framer Motion, Lucide Icons, Radix UI, and more

---

## Troubleshooting
- **Cloud API Errors:** Ensure your Gemini API key is valid and you have not exceeded your quota.
- **Local AI Extraction Issues:** Make sure `compromise` is installed. For best results, provide well-structured input.
- **Ollama Not Detected:** Ensure Ollama is running (`ollama serve`) and the desired model is pulled.
- **File Upload Issues:** Only PDF, Word, text, and common image formats are supported (max 10MB).

---

## Contributing
Contributions are welcome! Please open issues or pull requests for features, bug fixes, or documentation improvements.

---

## License
MIT License. See [LICENSE](LICENSE) for details.

---

**_Quespapgen – The fastest, smartest way to generate question papers with AI!_** 
