# Huong Dan Su Dung Website Demo

## 1) Chay website tren may
- Mo thu muc du an bang VS Code.
- Dung Live Server hoac lenh sau:

```bash
cd "/Users/lethang/Documents/Playground 2"
python3 -m http.server 5500
```

- Mo trinh duyet:
  - Trang chu: `http://127.0.0.1:5500/index.html`
  - Ban do: `http://127.0.0.1:5500/map.html`

## 2) Luong demo 5 phut (de bao ve)
1. Mo `index.html` va gioi thieu muc tieu de tai.
2. Bam `Mo ban do` de vao `map.html`.
3. Kiem tra sidebar hien `20 diem`.
4. Bam 1 diem trong danh sach -> `Mo ho so`.
5. Sang `place.html?id=...` de trinh bay:
   - badge loai diem
   - quyen ghi hinh
   - muc nhay cam
   - quy tac ung xu
6. Bam `Dat trai nghiem` -> `booking.html?item=...`.
7. Dien form va gui -> hien thong bao thanh cong demo.

## 3) Cach dung tung trang

### 3.1 Trang chu (`index.html`)
- Co 4 menu chinh: Trang chu, Ban do trai nghiem, Ho so diem, Dat trai nghiem.
- Nut `Admin` chi hien khi them query:
  - `index.html?admin=1`

### 3.2 Ban do (`map.html`)
- Co bo loc: loai diem, quyen ghi hinh, muc nhay cam.
- Co o tim theo ten/mo ta diem.
- Khi co Google Maps API key: hien marker + popup.
- Khi chua co key: van hien list diem de demo.

### 3.3 Ho so diem (`place.html`)
- Neu vao khong co `id`, trang se hien danh sach goi y diem.
- Neu vao co `id` (vd: `place.html?id=pc-001`), trang hien day du ho so.
- Voi diem `sensitive`, co canh bao luoc gian thong tin.

### 3.4 Dat trai nghiem (`booking.html`)
- Website dang o `DEMO_MODE = true`.
- Gui form se luu vao `localStorage` (key: `demo_bookings`) va hien thong bao thanh cong demo.
- Neu URL co `?item=pc-001` thi tu dien diem dat.

### 3.5 Quan ly don (`admin-bookings.html`)
- Truy cap truc tiep:
  - `http://127.0.0.1:5500/admin-bookings.html`
- Dang nhap admin Supabase de xem don.
- Co chuc nang:
  - loc theo trang thai
  - cap nhat trang thai
  - xoa don

## 4) Cau hinh Google Maps (neu can marker that)
Trong `map.html`, sua:

```html
window.GMAPS_API_KEY = "YOUR_KEY";
```

Hoac mo URL:

```text
map.html?key=YOUR_KEY
```

## 5) Cau hinh Supabase (neu can luu don that)
- SQL/policy: thu muc `supabase/`.
- File huong dan: `SUPABASE_SETUP.md`.
- Neu demo truoc BGK va uu tien on dinh, giu `DEMO_MODE = true` trong `js/booking.js`.

## 6) Loi thuong gap va cach xu ly nhanh

### 6.1 Map hien 0 diem
- Kiem tra mo bang server (`http://127.0.0.1:5500`), khong mo `file://`.
- Kiem tra file `data/places.json` co ton tai.

### 6.2 Form booking bao loi
- Demo mode: kiem tra `const DEMO_MODE = true` trong `js/booking.js`.

### 6.3 Khong vao duoc admin
- Kiem tra user admin da tao trong Supabase Auth.
- Kiem tra policy secure da run.

## 7) Ghi chu khi trinh bay
- Nhan manh diem bao ton:
  - record_permission
  - sensitivity_level
  - quy tac ung xu
- Nhac lai day la bo khung co the thay du lieu that sau khao sat.
