import { z } from "zod";

const PHONE_REGEX = /^(0|\+84)[35789]\d{8}$/;

export const useCustomerSchema = () => {
  return z.object({
    name: z.string().trim().min(1, "Vui lòng nhập tên khách hàng"),
    invoice: z.string(),
    phone: z.string().trim().regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
    store: z.string().min(1, "Vui lòng chọn cửa hàng"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Vui lòng đồng ý với Điều khoản và Điều kiện",
    }),
  });
};

export type TCustomerSchema = z.infer<ReturnType<typeof useCustomerSchema>>;
