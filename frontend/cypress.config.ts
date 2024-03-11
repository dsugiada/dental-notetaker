import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://localhost:3000',
    "video": false,
    "env": {
      "EMAIL_API_URL": "http://api.example.com/emails",
      "EMAIL_API_TOKEN": "your_api_token_here"
    }
  },
})