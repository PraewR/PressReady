
# PressReady V4 (Clean Deploy)

- ✅ ไม่ใช้ alias @/… (ใช้ relative imports) → ลดปัญหา build บน Vercel
- ✅ Question library อยู่ที่ /data/question_library.json
- ✅ Country ต้องตรงกับชื่อชีต: Thailand, Singapore, Vietnam, Indonesia, Philippines

## Deploy
1) สร้าง GitHub repo ใหม่ (เช่น pressready-app)
2) Upload ไฟล์ทั้งหมดใน zip นี้เข้า repo (ให้เห็น app/lib/data ที่ root)
3) Vercel → New Project → Import repo → Deploy

## เปิด AI
Vercel → Project → Settings → Environment Variables
- OPENAI_API_KEY = ใส่คีย์
- (optional) OPENAI_MODEL = gpt-5.2
