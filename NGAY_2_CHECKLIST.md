# Ngày 2 - Hoàn thiện 360 theo từng điểm

## Đã làm
- Nâng dữ liệu điểm để hỗ trợ nhiều `scene` 360 cho mỗi điểm.
- Trang `du-lich-ao-360.html` giờ có:
  - danh sách điểm có 360
  - danh sách scene của điểm đang chọn
  - cập nhật URL theo `?id=<placeId>&scene=<sceneId>`
- Hồ sơ điểm có ghi chú số scene 360 và nút mở trang 360 đầy đủ.
- Tạo file mẫu nhập scene 360:
  - `data/pano360_scene_mapping_template.csv`

## Việc cần bạn/bạn phụ trách 360 điền
- `id` điểm
- tên scene 1, 2, 3
- link 360 tương ứng từng scene

## Mục tiêu đạt cuối ngày
- Bấm từ bản đồ / tìm kiếm / hồ sơ điểm sang trang 360 đúng điểm
- Nếu điểm có nhiều scene thì chuyển được scene trong web
