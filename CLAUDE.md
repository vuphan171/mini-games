# Quy ước code

- Các giá trị cấu hình/tuỳ chọn tĩnh của 1 màn hình (VD: danh sách option cho dropdown như `GAME_SPEED_OPTIONS`) phải để trong folder `configs/` riêng của feature đó (VD: `src/features/settings/configs/`), không khai báo trực tiếp trong file component.
- Không hardcode string/number literal lặp lại ở nhiều nơi cho các giá trị định danh (option value, key...). Khai báo 1 object `as const` làm nguồn duy nhất (VD: `GameSpeeds = { slow: "slow", normal: "normal" } as const`), rồi tham chiếu qua object đó (`GameSpeeds.slow`) thay vì viết lại raw string. Lý do: sau này đổi giá trị chỉ cần sửa 1 chỗ, không phải rà từng file dùng raw string.
