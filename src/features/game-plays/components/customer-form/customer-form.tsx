import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import { ensureAudioContext } from "@/lib/audio";
import APIService from "@/services/api-service";
import { useCustomerSchema, TCustomerSchema } from "./schema";
import type { Customer } from "../../types";
import { QUERY_KEYS } from "@/configs/query-keys";
import { IconSetting } from "@/assets";

type Props = {
  onStart: (info: Customer) => void;
  onOpenConfig: () => void;
};

const CustomerForm = ({ onStart, onOpenConfig }: Props) => {
  const customerSchema = useCustomerSchema();

  const { data: stores = [], isLoading: isLoadingStores } = useQuery({
    queryKey: [QUERY_KEYS.STORE_LIST],
    queryFn: APIService.getStores,
  });

  const { control, handleSubmit, formState } = useForm<TCustomerSchema>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      store: undefined,
    },
  });

  const onSubmit = (data: TCustomerSchema) => {
    ensureAudioContext();
    onStart(data);
  };

  return (
    <div className="relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <button
        type="button"
        className="absolute top-6 right-6 size-11 flex items-center justify-center bg-brand-gradient rounded-full text-2xl"
        aria-label="Cài đặt"
        onClick={onOpenConfig}
      >
        <IconSetting className="text-white size-6" />
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-xl md:max-w-2xl"
      >
        <div className="flex w-full flex-col rounded-3xl p-6 bg-white shadow-card md:p-10 lg:p-14">
          <p className="text-center text-3xl font-bold text-foreground mb-6">
            Nhập thông tin để bắt đầu chơi và nhận quà!
          </p>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="capitalize"
                      required
                      htmlFor={field.name}
                    >
                      Tên khách hàng
                    </FieldLabel>
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
            </div>

            <div className="col-span-12 md:col-span-6">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      required
                      className="capitalize"
                      htmlFor={field.name}
                    >
                      Email
                    </FieldLabel>
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
            </div>

            <div className="col-span-12 md:col-span-6">
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="capitalize"
                      required
                      htmlFor={field.name}
                    >
                      Số điện thoại
                    </FieldLabel>
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
            </div>

            <div className="col-span-12">
              <Controller
                name="store"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="capitalize" required htmlFor="store">
                      Cửa hàng
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingStores}
                    >
                      <SelectTrigger size="lg" id="store" className="w-full">
                        <SelectValue placeholder="Chọn cửa hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((s) => (
                          <SelectItem key={s.storeID} value={s.storeID}>
                            {s.storeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            size="2xl"
            variant="game"
            disabled={!formState.isValid}
            className="mt-10 w-full"
          >
            BẮT ĐẦU CHƠI
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
