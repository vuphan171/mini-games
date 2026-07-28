import { useRef, useState } from "react";
import { STORES } from "../../../configs";
import { ensureAudioContext } from "../../../lib/audio";
import type { Customer } from "../types";

interface CustomerFormProps {
  onStart: (info: Customer) => void;
  onOpenConfig: () => void;
}

type FormErrors = Partial<Record<"name" | "email" | "phone", string>>;

export default function CustomerForm({ onStart, onOpenConfig }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [store, setStore] = useState(STORES[STORES.length - 1]);
  const [errors, setErrors] = useState<FormErrors>({});
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const validate = () => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Vui lòng nhập tên khách hàng";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Email không hợp lệ";
    if (!/^0\d{9,10}$/.test(phone.trim())) e.phone = "SĐT không hợp lệ (bắt đầu bằng 0, 10-11 số)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    ensureAudioContext();
    if (validate()) onStart({ name: name.trim(), email: email.trim(), phone: phone.trim(), store });
  };

  const inputCls = (err?: string) =>
    "w-full px-4 py-3 rounded-xl border-2 text-lg outline-none " +
    (err ? "border-red-400 bg-red-50" : "border-emerald-200 bg-white focus:border-emerald-500");

  return (
    <div
      className="w-full flex items-center justify-center p-6"
      style={{ minHeight: "100vh", background: "linear-gradient(160deg,#065f46,#059669 55%,#34d399)" }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 relative">
        <button onClick={onOpenConfig} className="absolute top-4 right-4 text-2xl opacity-30" aria-label="Cài đặt">
          ⚙️
        </button>

        <div
          className="text-center mb-6 select-none"
          onTouchStart={() => {
            holdTimer.current = setTimeout(onOpenConfig, 1500);
          }}
          onTouchEnd={() => clearTimeout(holdTimer.current)}
        >
          <div className="text-6xl mb-2">🐄⚽</div>
          <h1 className="text-3xl font-extrabold text-emerald-800">SIÊU BÒ SÚT BÓNG</h1>
          <p className="text-emerald-600 mt-1">Nhập thông tin để bắt đầu chơi và nhận quà!</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Tên khách hàng</label>
            <input
              className={inputCls(errors.name)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email</label>
            <input
              className={inputCls(errors.email)}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@vidu.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Số điện thoại</label>
            <input
              className={inputCls(errors.phone)}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901234567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Cửa hàng</label>
            <select className={inputCls()} value={store} onChange={(e) => setStore(e.target.value)}>
              {STORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={submit} className="mt-7 w-full py-4 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-lg">
          BẮT ĐẦU CHƠI 🎮
        </button>
      </div>
    </div>
  );
}
