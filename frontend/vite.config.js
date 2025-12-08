import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':{
       // target:'https://slrtech-chatapp.onrender.com/',
         target: "https://divyansh-chat-app-tkuh.onrender.com", 
        
        secure:false
      }
    }
  },
})