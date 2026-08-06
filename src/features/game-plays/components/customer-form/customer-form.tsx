import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ensureAudioContext } from "@/lib/audio";
import APIService from "@/services/api-service";
import { useCustomerSchema, TCustomerSchema } from "./schema";
import type { Customer } from "../../types";
import { QUERY_KEYS } from "@/configs/query-keys";
import { IconSetting } from "@/assets";
import CowHoldingBall from "@/assets/logos/cow-holding-ball.png";
import AppLogo from "@/assets/logos/app-logo.png";
import { useEffect } from "react";
import type { Store } from "@/types/store";

type Props = {
  onStart: (customer: Customer, store: Store) => void;
  onOpenConfig: (store: Store) => void;
};

const CustomerForm = ({ onStart, onOpenConfig }: Props) => {
  const customerSchema = useCustomerSchema();

  const { data: stores = [], isLoading: isLoadingStores } = useQuery({
    queryKey: [QUERY_KEYS.STORE_LIST],
    queryFn: APIService.getStores,
  });

  const { control, reset, getValues, handleSubmit, formState } =
    useForm<TCustomerSchema>({
      resolver: zodResolver(customerSchema),
      mode: "onChange",
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        store: "",
        termsAccepted: false,
      },
    });

  useEffect(() => {
    const storeId = stores?.length ? stores[stores.length - 1].storeID : "";
    if (!storeId) return;
    reset({
      store: storeId,
    });
  }, [reset, stores]);

  const onSubmit = async (data: TCustomerSchema) => {
    try {
      const store = stores.find((s) => s.storeID === data.store);

      if (!store) return;

      const customer = await APIService.createCustomer({
        storeID: store.storeID,
        customerName: data.name,
        email: "phanzz147@gmail.com",
        phone: data.phone,
        score: 0,
        playDuration: 0,
        result: "New",
      });

      if (!customer) {
        toast.error("Lưu thông tin khách hàng thất bại");
        return;
      }

      ensureAudioContext();

      onStart(customer, store);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <button
        type="button"
        className="absolute top-6 right-6 size-11 flex items-center justify-center bg-brand-gradient rounded-full text-2xl"
        aria-label="Cài đặt"
        onClick={() => {
          const storeId = getValues("store");
          if (!storeId) return;
          const store = stores.find((s) => s.storeID === storeId);
          if (!store) return;
          onOpenConfig(store);
        }}
      >
        <IconSetting className="text-white size-6" />
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-xl md:max-w-2xl lg:max-w-3xl mt-20 md:mt-0"
      >
        <div className="flex w-full flex-col rounded-3xl p-6 bg-white shadow-card md:p-10 lg:p-14">
          <div className="mb-10 flex flex-col items-center justify-between md:flex-row gap-4">
            <div className="flex items-center order-2 gap-2 md:order-1">
              <img
                width={100}
                height={100}
                src={CowHoldingBall}
                alt="Cow Holding Ball"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
              />
              <p className="text-4xl font-bold text-brand-tertiary">
                SIÊU BÒ ÚC <br /> SÚT BÓNG
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                width="auto"
                height={100}
                src={AppLogo}
                className="h-28 w-auto"
                alt="App Logo"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
              />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-6">
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
                      Số hoá đơn
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="HD123456"
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

            <div className="col-span-12">
              <Controller
                name="termsAccepted"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <Checkbox
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel className="font-normal" htmlFor={field.name}>
                      Tôi đã đọc và đồng ý với các{" "}
                      <a
                        className="text-blue-500 hover:underline cursor-pointer"
                        href="https://docs.google.com/document/d/1YF3C_6U9FYPeBPcTXL0wCEf1hGpOoxY2hTJKSQv7It4/edit?tab=t.0"
                        target="_blank"
                      >
                        Điều khoản và Điều kiện
                      </a>
                    </FieldLabel>
                    {fieldState.isTouched && fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
            loading={formState.isSubmitting}
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
