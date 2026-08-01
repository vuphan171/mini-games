import { z } from "zod";

const PIN_CODE_LENGTH = 4;

// ---------- MOCK: mã PIN hợp lệ ----------
const MOCK_PIN_CODE: string = "1234";

const PIN_REGEX = new RegExp(`^\\d{${PIN_CODE_LENGTH}}$`);

export const usePinSchema = () => {
  return z.object({
    pin: z
      .string()
      .trim()
      .regex(PIN_REGEX, `Mã PIN phải gồm ${PIN_CODE_LENGTH} chữ số`)
      .refine((pin) => pin === MOCK_PIN_CODE, "Mã PIN không đúng"),
  });
};

export { PIN_CODE_LENGTH };

export type TPinSchema = z.infer<ReturnType<typeof usePinSchema>>;
