/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_ENABLE_SENTIMENT_ANALYSIS?: string
  readonly VITE_ENABLE_KNOWLEDGE_SEARCH?: string
  readonly VITE_ENABLE_RESPONSE_SCORING?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  // Add other VITE_ prefixed env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}