// Global runtime switch for presentation.
// true  -> use demo data and localStorage booking
// false -> use real data source and Supabase booking
window.DEMO_MODE = true;

// Public booking lookup should stay off in secure mode unless you add
// a dedicated protected lookup flow on Supabase/backend.
window.PUBLIC_BOOKING_LOOKUP_ENABLED = false;

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
  'https://23000908-cell.github.io/3Dvistar_premium/#scene=Mong%20space';

// Fallback pano link for places that do not have pano360_url yet.
window.DEFAULT_PANO360_URL = window.VIRTUAL360_PORTAL_URL;

// Optional 360 mapping by place id.
// You can map one place to one or many 360 scenes.
// Example:
// window.PANO360_PLACE_MAP = {
//   pc03: [
//     { id: 'tong-quan', name: 'Tổng quan homestay', url: 'https://...' },
//     { id: 'phong-nghi', name: 'Phòng nghỉ', url: 'https://...' }
//   ],
//   HLM: 'https://...'
// };
window.PANO360_PLACE_MAP = {
  "mc00": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=Ban%20Lat"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_03"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_04"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_05"
    },
    {
      "id": "scene-5",
      "name": "Góc nhìn 5",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_11"
    }
  ],
  "mc01": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_18"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_17"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_15"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_16"
    },
    {
      "id": "scene-5",
      "name": "Góc nhìn 5",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_13"
    },
    {
      "id": "scene-6",
      "name": "Góc nhìn 6",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_14"
    },
    {
      "id": "scene-7",
      "name": "Góc nhìn 7",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_01"
    }
  ],
  "mc02": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_16"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_15"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_17"
    }
  ],
  "mc03": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_4"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_5"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_6"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_8"
    },
    {
      "id": "scene-5",
      "name": "Góc nhìn 5",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_7"
    },
    {
      "id": "scene-6",
      "name": "Góc nhìn 6",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_9"
    }
  ],
  "MS": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=Mong%20space"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=MS_1"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=MS_3"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=MS_4"
    },
    {
      "id": "scene-5",
      "name": "Góc nhìn 5",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=MS_2"
    },
    {
      "id": "scene-6",
      "name": "Góc nhìn 6",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=MS_5"
    }
  ],
  "ML": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=Mong%20Lenh%20"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_1"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_2"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=MS_6"
    }
  ],
  "pc03": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_13"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=ML_14"
    }
  ],
  "HLM": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HLM_1"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=Highlandmong"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HLM_02"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HLM_03"
    }
  ],
  "pc05": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_1"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_1.2"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_1.3"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_1.1"
    }
  ],
  "pc06": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_2"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_2.1"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=HS_2.2"
    }
  ],
  "pc08": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_05"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_06"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_07"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_08"
    },
    {
      "id": "scene-5",
      "name": "Góc nhìn 5",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_09"
    },
    {
      "id": "scene-6",
      "name": "Góc nhìn 6",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_10"
    },
    {
      "id": "scene-7",
      "name": "Góc nhìn 7",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_12"
    }
  ],
  "pc09": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_26"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_27"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BL_25"
    }
  ],
  "BN": [
    {
      "id": "scene-1",
      "name": "Không gian chính",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=Ban%20Nhot"
    },
    {
      "id": "scene-2",
      "name": "Góc nhìn 2",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_3"
    },
    {
      "id": "scene-3",
      "name": "Góc nhìn 3",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_1"
    },
    {
      "id": "scene-4",
      "name": "Góc nhìn 4",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_10"
    },
    {
      "id": "scene-5",
      "name": "Góc nhìn 5",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_11"
    },
    {
      "id": "scene-6",
      "name": "Góc nhìn 6",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_12"
    },
    {
      "id": "scene-7",
      "name": "Góc nhìn 7",
      "url": "https://23000908-cell.github.io/3Dvistar_premium/#scene=BN_13"
    }
  ]
};
