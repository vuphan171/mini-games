import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STORES } from "@/configs";
import { ensureAudioContext } from "@/lib/audio";
import { customerFormSchema, type CustomerFormValues } from "../schema";
import type { Customer } from "../types";

interface CustomerFormProps {
  onStart: (info: Customer) => void;
  onOpenConfig: () => void;
}

export default function CustomerForm({
  onStart,
  onOpenConfig,
}: CustomerFormProps) {
  const { control, handleSubmit, formState } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      store: STORES[STORES.length - 1],
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    ensureAudioContext();
    onStart(data);
  };

  return (
    <div className="bg-game-gradient relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <button
        type="button"
        onClick={onOpenConfig}
        className="absolute top-4 right-4 text-2xl opacity-40 transition-opacity hover:opacity-80"
        aria-label="Cài đặt"
      >
        ⚙️
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-xl flex-col items-center gap-3.5 py-7"
      >
        <div className="flex flex-col items-center gap-0.5 text-center">
          <div className="text-7xl">🐮</div>
          <h1
            className="text-5xl leading-none font-extrabold text-white"
            style={{
              textShadow: "0 3px 0 #1a4d21, 0 6px 14px rgba(0,0,0,.35)",
            }}
          >
            SIÊU BÒ ÚC
          </h1>
          <h2
            className="text-2xl leading-tight font-extrabold text-[#ffd54f]"
            style={{ textShadow: "0 3px 0 #8a5a00, 0 5px 12px rgba(0,0,0,.3)" }}
          >
            ⚽ SÚT BÓNG ⚽
          </h2>
        </div>

        <div
          className="flex w-full flex-col gap-3.5 rounded-[22px] border-4 p-6"
          style={{
            borderColor: "#21351f",
            background: "#fff8e7",
            boxShadow: "0 8px 0 #21351f, 0 18px 40px rgba(0,0,0,.35)",
          }}
        >
          <p className="text-center text-lg font-bold text-[#2c7a37]">
            Nhập thông tin để bắt đầu 🎮
          </p>

          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tên khách hàng *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Nguyễn Văn A"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.isTouched && fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="a@email.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.isTouched && fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Số điện thoại *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="0901234567"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.isTouched && fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="store"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="store">Cửa hàng *</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger size="lg" id="store" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STORES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Button
            type="submit"
            size="2xl"
            variant="game"
            disabled={!formState.isValid}
            className="mt-1 w-full"
          >
            ▶ BẮT ĐẦU CHƠI
          </Button>
        </div>
      </form>
    </div>
  );
}
