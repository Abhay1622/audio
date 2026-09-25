# VoiceCraft — Free AI Text to Speech (Hindi, Bhojpuri, Hinglish & English)

VoiceCraft is a modern, responsive, and completely **free** AI Text-to-Speech (TTS) web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**.

It features a **single, unified editor input area** with instant tab switching across **Hindi (हिन्दी)**, **Bhojpuri (भोजपुरी)**, **Hinglish (Roman Hindi)**, and **English**, coupled with **real-time live auto-translation**, **natural human breath pauses**, **emotion profiles**, and **instant audio playback with zero paid API keys**.

---

## 🌟 Key Features

1. **4 Language & Voice Tabs in One Single Editor**:
   - **Hindi (हिन्दी)**: Neural Devanagari models (`Swara`, `Madhur`).
   - **Bhojpuri (भोजपुरी)**: Authentic regional pronunciation (`Swara`, `Madhur`).
   - **Hinglish (Roman Hindi)**: Natural Indian cadence reading Romanized Hindi (`Neerja Expressive`, `Prabhat`).
   - **English**: Indian English (`Neerja`, `Prabhat`), US English (`Jenny`, `Guy`), and UK English (`Sonia`, `Ryan`).

2. **Clean Single Editor UX**:
   - One focused, modern editor area instead of cluttered stacked boxes.
   - Switch between **Hindi**, **Bhojpuri**, **Hinglish**, and **English** tabs seamlessly to inspect or adjust text.
   - Real-time **Live Auto-Translate** automatically keeps all language tabs in sync as you type.

3. **Natural Human Pauses & Cadence**:
   - **`⏸️ Short (,)`**: Inserts a natural conversational comma pause (~0.3s).
   - **`💭 Breath (...)`**: Inserts a thoughtful breathing pause (~0.5s).
   - **`🎭 Dramatic (—)`**: Inserts a dramatic suspension pause (~0.8s).
   - **`✨ Auto-Humanize`**: Automatically adds breath rhythm and punctuation to prevent robotic delivery.

4. **6 Speaking Emotion & Expression Profiles**:
   - 🌟 **Natural Human**: Balanced, warm conversational tone.
   - 🎉 **Cheerful & Excited**: Bright pitch (+8Hz), lively tempo (1.06x), and enthusiastic intonation.
   - 📖 **Storyteller & Dramatic**: Deep vocal resonance (-10Hz) and suspenseful pacing (0.88x).
   - 🧘 **Calm & Empathetic**: Soothing tempo (0.84x) and gentle, warm pitch.
   - 🎙️ **News & Professional**: Crisp, articulate broadcast delivery (1.04x).
   - 🤫 **Soft & Intimate**: Quiet, close-mic vocal presence (0.82x).

5. **Instant "Generate & Play"**:
   - Click the prominent CTA to immediately synthesize speech for the active tab and play it in the sleek custom audio player with waveform animations.

6. **Direct MP3 Audio Download**:
   - Download audio files with clean names (e.g., `voicecraft-hinglish-neerja.mp3`, `voicecraft-hindi-swara.mp3`).

7. **100% Free & Open (Zero Paid API Keys)**:
   - Uses Microsoft Edge Neural TTS service, Google Translate Speech fallback, and Browser Web Speech API.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📡 API Endpoints

- `POST /api/tts/generate`: Synthesizes speech (`hi`, `bho`, `hinglish`, `en`).
- `GET /api/tts/audio/:id`: Streams cached MP3 audio bytes.
- `POST /api/translate`: Real-time translation and Hinglish transliteration.
- `GET /api/tts/voices?language=...`: List voices by language.
- `GET /api/tts/status`: Provider health check.

---

## 📄 License
MIT License. Built for the open-source community.
