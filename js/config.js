// Global runtime switch for presentation.
// true  -> use demo data and localStorage booking
// false -> use real data source and Supabase booking
window.DEMO_MODE = true;

// Chatbot AI mode:
// false -> chatbot uses built-in keyword replies
// true  -> chatbot calls secure backend endpoint
window.CHATBOT_AI_ENABLED = false;

// Example for Supabase Edge Function:
// https://<project-ref>.supabase.co/functions/v1/chatbot-openai
window.CHATBOT_AI_ENDPOINT = 'https://ojqcwegtxzhoqdkmgzsa.supabase.co/functions/v1/chatbot-openai';

// Optional shared token between frontend and edge function.
// If you set CHATBOT_SHARED_TOKEN on backend, set same value here.
window.CHATBOT_AI_TOKEN = '';

// 360 virtual tourism links
window.VIRTUAL360_PORTAL_URL =
  'https://23000908-cell.github.io/tour_Paco_BanLat/index.html';
window.VIRTUAL360_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1eJflBBS3zaCUmGimnop2cQ9236IIT97P';
window.VIRTUAL360_DRIVE_EMBED_URL =
  'https://drive.google.com/embeddedfolderview?id=1eJflBBS3zaCUmGimnop2cQ9236IIT97P#grid';

// Fallback pano link for places that do not have pano360_url yet.
window.DEFAULT_PANO360_URL = window.VIRTUAL360_PORTAL_URL;
