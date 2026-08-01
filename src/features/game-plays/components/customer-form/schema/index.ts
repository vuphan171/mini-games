import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^(0|\+84)[35789]\d{8}$/;

export const useCustomerSchema = () => {
  return z.object({
    name: z.string().trim().min(1, "Vui lòng nhập tên khách hàng"),
    email: z.string().trim().regex(EMAIL_REGEX, "Email không hợp lệ"),
    phone: z.string().trim().regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
    store: z.string().min(1, "Vui lòng chọn cửa hàng"),
  });
};

export type TCustomerSchema = z.infer<ReturnType<typeof useCustomerSchema>>;
