# Setup Chatbot AI (Supabase + OpenAI)

Tài liệu này bật chatbot AI thật cho website mà không lộ OpenAI key ở frontend.

## 1) Deploy Edge Function

Yêu cầu: đã đăng nhập Supabase CLI và link đúng project.

```bash
supabase functions deploy chatbot-openai --no-verify-jwt
```

File function đã có sẵn tại:

- `supabase/functions/chatbot-openai/index.ts`

## 2) Set secrets cho function

```bash
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
supabase secrets set OPENAI_MODEL=gpt-4.1-mini
```

Tùy chọn bảo mật thêm bằng token chung (khuyến nghị):

```bash
supabase secrets set CHATBOT_SHARED_TOKEN=YOUR_LONG_RANDOM_TOKEN
```

## 3) Bật AI mode ở frontend

Sửa file `js/config.js`:

```js
window.CHATBOT_AI_ENABLED = true;
window.CHATBOT_AI_ENDPOINT = 'https://ojqcwegtxzhoqdkmgzsa.supabase.co/functions/v1/chatbot-openai';
window.CHATBOT_AI_TOKEN = 'YOUR_LONG_RANDOM_TOKEN'; // nếu bạn có dùng CHATBOT_SHARED_TOKEN
```

Nếu không dùng token chung, để `window.CHATBOT_AI_TOKEN = ''`.

## 4) Kiểm tra nhanh

1. Mở website bằng Live Server.
2. Mở chatbot (nút 💬 góc phải dưới).
3. Hỏi: `mở bản đồ`, `đặt trải nghiệm`, `xem hồ sơ điểm`.
4. Nếu endpoint lỗi, chatbot tự fallback về chế độ keyword để không làm hỏng demo.

## 5) Lưu ý vận hành

- OpenAI key chỉ tồn tại ở Supabase secrets, không đẩy vào HTML/JS frontend.
- Có thể giới hạn domain bằng WAF/CDN phía trước nếu cần.
- Khi thuyết trình, giữ câu trả lời ngắn và đúng luồng điều hướng để ổn định demo.
