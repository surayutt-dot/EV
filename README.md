# ⚡ MG S5 EV Tracker (Public DC & Home TOU)

แอพพลิเคชันบันทึกค่าใช้จ่ายและคำนวณต้นทุนการชาร์จรถยนต์ไฟฟ้า ออกแบบเฉพาะสำหรับ **MG S5 EV (รุ่น D+)** และรองรับทั้งคนที่ **ชาร์จนอกบ้าน 100% (Public DC/AC)** หรือ **ชาร์จบ้าน (Home TOU)** เพื่อให้แชร์กับเพื่อนๆ ได้ทุกคน

![MG S5 EV Tracker](https://img.shields.io/badge/Platform-Web%20%7C%20PWA-06b6d4?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)

---

## ✨ ฟังก์ชันเด่น (Key Features)

1. **จดเร็วใน 10 วินาที (Quick Charge Log):**
   * ปุ่มกดด่วนค่ายชาร์จในไทย: **PEA Volta, Rêver Sharger, EleX by EGAT, EA Anywhere, EVme / PTT EV Station, Shell Recharge, Caltex / EVolt, Altervim (Lotus's/CP), Tesla Supercharger, อื่นๆ**
   * กรอกแค่ **ยอดเงิน (บาท)** และ **เลขไมล์ (กม.)** ระบบจะคำนวณต้นทุนต่อกิโลเมตรให้อัตโนมัติทันที
2. **รองรับชาร์จบ้าน (Home TOU):**
   * สลับโหมดชาร์จบ้าน คำนวณตามอัตรา TOU Off-Peak / On-Peak / อัตราปกติได้ทันที
   * แถบวิเคราะห์สัดส่วนการชาร์จ **บ้าน vs นอกบ้าน (%)**
3. **โฟกัสตัวเลขจริงของรถ EV:**
   * สรุปต้นทุนเฉลี่ยจริง (บาท/กิโลเมตร)
   * ค่าชาร์จประจำเดือน และยอดรวมสะสม
   * กราฟ Donut สัดส่วนค่ายชาร์จที่ใช้บริการ (Provider Breakdown)
   * กราฟแท่งแนวโน้มค่าชาร์จรายเดือน
4. **เตือนสลับยางสำหรับรถขับหลัง (RWD Care):**
   * เนื่องจาก MG S5 เป็นรถขับเคลื่อนล้อหลัง (RWD) และมีแรงบิดสูง ยางหลังจะสึกเร็วกว่าล้อหน้า
   * มี Progress Bar นับถอยหลังเตือนสลับยางทุก 10,000 กม. พร้อมเตือนประกันภัยชั้น 1 และ พ.ร.บ.
5. **ความปลอดภัยและการสำรองข้อมูล:**
   * บันทึกข้อมูลลงเครื่องผู้ใช้ (LocalStorage) ทำงานแบบ Offline ได้ 100%
   * มีปุ่ม Export / Import JSON เพื่อสำรองหรือย้ายเครื่องได้ตลอดเวลา
   * มีปุ่มโหลดข้อมูลตัวอย่างสำหรับทดลองระบบ

---

## 🚀 วิธีติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้นรันเซิร์ฟเวอร์
npm run dev

# หรือรันเพื่อเปิดบนมือถือในวง Wi-Fi เดียวกัน
npm run dev -- --host
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:5173/`

---

## 🌐 วิธีนำขึ้นโฮสต์ฟรี (Deploy to Vercel / Netlify)

1. อัปโหลดโปรเจกต์นี้ขึ้น GitHub Repository ของคุณ
2. ไปที่ [Vercel.com](https://vercel.com) แล้วล็อกอินด้วย GitHub
3. กดปุ่ม **"Add New Project"** แล้วเลือก Repository นี้
4. กด **Deploy** ได้ทันที (Vercel จะตรวจจับ Vite + React และสร้างเว็บให้อัตโนมัติใน 1 นาที)

