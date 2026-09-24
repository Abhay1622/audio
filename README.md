# VoiceCraft — Free AI Text to Speech (Hindi, Bhojpuri & English)

VoiceCraft is a modern, responsive, and completely **free** AI Text-to-Speech (TTS) web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**.

It supports natural-sounding neural speech synthesis for **Hindi (हिन्दी)**, **Bhojpuri (भोजपुरी)**, and **English**, along with **real-time multi-language live translation** and instant audio generation & playback with **zero paid API keys required**.

---

## 🌟 Key Features

1. **Multi-Language Support**:
   - **Hindi (हिन्दी)**: Natural neural voices (`Swara`, `Madhur`).
   - **Bhojpuri (भोजपुरी)**: Devanagari neural voices (`Swara`, `Madhur`) tuned for authentic pronunciation.
   - **English**: Indian English (`Neerja Expressive`, `Prabhat`), US English (`Jenny`, `Guy`), and British English (`Sonia`, `Ryan`).

2. **Real-time Live Auto-Translation**:
   - Type or paste text in **any** language (Hindi, Bhojpuri, or English).
   - VoiceCraft immediately translates the text across the other two languages in real-time.
   - Edit each language independently or leave Live Auto-Translate enabled.

3. **Instant "Generate & Play"**:
   - Click **Generate & Play** on any language card to synthesize and play speech immediately.
   - Sleek custom audio player with interactive scrubber, waveform visualizer, volume/mute, and playback speed controls.

4. **Audio Download**:
   - One-click direct **MP3 audio download** with clean file names (e.g., `voicecraft-hindi-swara.mp3`, `voicecraft-bhojpuri-swara.mp3`).

5. **Speech Customization**:
   - **Speed Control**: Fine slider (0.5x to 2.0x) with quick presets (`0.75x`, `1.0x`, `1.25x`, `1.5x`).
   - **Pitch Adjustment**: `-20Hz` to `+20Hz` voice pitch tuning.
   - **Engine Selector**: Edge Neural TTS (Default High-Definition), Google Translate Speech (Fallback), and Browser Web Speech API (Client-side offline).

6. **100% Free & Open**:
   - **Zero paid API keys** (no OpenAI, ElevenLabs, or GCP billing needed).
   - Runs completely locally.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm 9+

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

## 🏗️ Architecture & TTS Provider Abstraction

VoiceCraft is built around an extensible provider pattern (`ITTSProvider` interface):

```
                       ┌────────────────────────┐
                       │   Next.js API Handler  │
                       │   /api/tts/generate    │
                       └───────────┬────────────┘
                                   │
                           ┌───────▼──────┐
                           │  TTSManager  │
                           └───────┬──────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────▼─────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│  EdgeTTSProvider  │    │ GoogleTTSProvider │    │BrowserSpeechClient│
│  (Neural Engine)  │    │(Fallback Provider)│    │(Client-Side Audio)│
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

- **`EdgeTTSProvider`**: Primary engine connecting to Microsoft Edge's Read Aloud neural speech service over WebSocket. Delivers human-like cadence, pitch, and speed adjustments.
- **`GoogleTTSProvider`**: Automatic fallback engine over HTTPS providing reliable speech synthesis if WebSocket connections are firewalled.
- **`BrowserSpeechClient`**: In-browser speech synthesis using the Web Speech API (`window.speechSynthesis`) for zero-network playback.

---

## 📡 API Endpoints

### 1. Generate Speech
- **Endpoint**: `POST /api/tts/generate`
- **Body**:
  ```json
  {
    "text": "नमस्ते, आपका स्वागत है वॉइसक्राफ्ट में।",
    "language": "hi",
    "voice": "hi-IN-SwaraNeural",
    "speed": 1.0,
    "pitch": 0,
    "provider": "edge-tts"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "audioUrl": "/api/tts/audio/da4f31ac-af1f-4ea3-8db7-248cc1e3edea",
    "mimeType": "audio/mpeg",
    "format": "mp3",
    "language": "hi",
    "voice": "hi-IN-SwaraNeural",
    "duration": 3.8,
    "characterCount": 42
  }
  ```

### 2. Stream Audio
- **Endpoint**: `GET /api/tts/audio/:id`
- Streams cached MP3 audio with `Content-Type: audio/mpeg` and `Accept-Ranges: bytes`.

### 3. Real-Time Translation
- **Endpoint**: `POST /api/translate`
- **Body**:
  ```json
  {
    "text": "Hello, welcome to VoiceCraft.",
    "sourceLang": "en"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "translations": {
      "hi": "नमस्ते, वॉइसक्राफ्ट में आपका स्वागत है।",
      "bho": "प्रणाम, VoiceCraft में राउर स्वागत बा।"
    }
  }
  ```

### 4. Voices & Status
- `GET /api/tts/voices?language=hi|bho|en`
- `GET /api/tts/status`

---

## 🔒 Security & Privacy

- Character limit enforced server-side (max 5,000 characters).
- Temporary audio clips cached in memory with automatic 30-minute TTL cleanup to prevent unbounded resource consumption.
- Input validation sanitizes requests and prevents code injection.
- Zero credential exposure: no third-party API keys are stored or exposed.

---

## 📄 License
MIT License. Built for the open-source community.
