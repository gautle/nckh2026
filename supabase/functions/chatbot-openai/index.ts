import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') || 'gpt-4.1-mini';
const SHARED_TOKEN = Deno.env.get('CHATBOT_SHARED_TOKEN') || '';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-chatbot-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const SITE_CONTEXT = [
  'Website: Chạm vào Di sản Hmông (NCKH + Du lịch số + Cộng đồng Pà Cò).',
  'Các trang chính:',
  '- index.html: trang chủ',
  '- map.html: bản đồ trải nghiệm',
  '- place.html: hồ sơ điểm và tư liệu số',
  '- booking.html: đặt trải nghiệm',
  '- huong-dan.html: hướng dẫn',
  '- admin-bookings.html: quản trị đơn',
  'Yêu cầu trả lời: ngắn gọn, dễ hiểu, ưu tiên điều hướng đúng trang và bước thao tác cụ thể.',
  'Nếu thiếu dữ liệu, nói rõ đang ở chế độ demo và đề xuất bước tiếp theo.'
].join('\n');

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS
    }
  });
}

function sanitizeText(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function mapHistory(history: unknown): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(history)) return [];

  return history
    .map((item) => {
      const roleRaw = sanitizeText((item as { role?: string })?.role).toLowerCase();
      const text = sanitizeText((item as { text?: string })?.text);
      if (!text) return null;
      const role = roleRaw === 'assistant' ? 'assistant' : 'user';
      return { role, content: text };
    })
    .filter((item): item is { role: 'user' | 'assistant'; content: string } => Boolean(item))
    .slice(-10);
}

function extractOutputText(payload: any): string {
  if (payload?.output_text && typeof payload.output_text === 'string') {
    return payload.output_text.trim();
  }

  if (Array.isArray(payload?.output)) {
    const texts: string[] = [];
    payload.output.forEach((entry: any) => {
      if (!Array.isArray(entry?.content)) return;
      entry.content.forEach((part: any) => {
        if (part?.type === 'output_text' && typeof part?.text === 'string') {
          texts.push(part.text.trim());
        }
      });
    });
    return texts.join('\n').trim();
  }

  return '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!OPENAI_API_KEY) {
    return jsonResponse({ error: 'OPENAI_API_KEY is not configured' }, 500);
  }

  if (SHARED_TOKEN) {
    const token = req.headers.get('x-chatbot-token') || '';
    if (token !== SHARED_TOKEN) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
  }

  let body: any;
  try {
    body = await req.json();
  } catch (_err) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const message = sanitizeText(body?.message);
  const page = sanitizeText(body?.page);
  const history = mapHistory(body?.history);

  if (!message) {
    return jsonResponse({ error: 'Message is required' }, 400);
  }

  const systemPrompt = [
    SITE_CONTEXT,
    page ? `Người dùng đang ở trang: ${page}` : ''
  ].filter(Boolean).join('\n');

  const inputMessages = [
    {
      role: 'system',
      content: [{ type: 'input_text', text: systemPrompt }]
    },
    ...history.map((item) => ({
      role: item.role,
      content: [{ type: 'input_text', text: item.content }]
    })),
    {
      role: 'user',
      content: [{ type: 'input_text', text: message }]
    }
  ];

  const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: inputMessages,
      temperature: 0.3,
      max_output_tokens: 350
    })
  });

  if (!openaiResponse.ok) {
    const errText = await openaiResponse.text();
    return jsonResponse({ error: 'OpenAI request failed', detail: errText }, 502);
  }

  const result = await openaiResponse.json();
  const answer = extractOutputText(result);

  if (!answer) {
    return jsonResponse({ error: 'No answer returned from model' }, 502);
  }

  return jsonResponse({
    answer,
    model: OPENAI_MODEL
  });
});
