import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import APIService from "@/services/api-service";
import type { Store, UpdateStorePayload } from "@/types/store";
import {
  GAME_SPEED_OPTIONS,
  GameSpeeds,
  DEFAULT_WINNING_SCORE,
  DEFAULT_PENALTY,
} from "./configs";
import { schema, type SettingsFormValues } from "./schema";
import { InputStepper } from "@/components/ui/input-stepper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const POINTS_STEP = 1;
const PENALTY_STEP = 1;

type Props = {
  store: Store;
  onDone: (data: SettingsFormValues) => void;
};

const AdminConfigs = ({ store, onDone }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gameSpeed: store.gameSpeed || GameSpeeds.normal,
      pointsPerGrain: store?.pointsPerGrain || 2,
      pointsPerGrass: store?.pointsPerGrass || 2,
      timeLimit: store?.timeLimit || 20,
      unlimitedTime: false,
      winningScore: store?.winningScore || DEFAULT_WINNING_SCORE,
      penalty: store?.penaltyPoints || DEFAULT_PENALTY,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const payload: UpdateStorePayload = {
      storeName: store?.storeName || "",
      pointsPerGrain: data.pointsPerGrain,
      pointsPerGrass: data.pointsPerGrass,
      penaltyPoints: data.penalty,
      unlimitedTime: false,
      timeLimit: data.timeLimit,
      winningScore: data.winningScore,
      gameSpeed: data.gameSpeed,
    };

    const success = await APIService.updateStore(store.storeID, payload);

    if (!success) {
      toast.error("Lưu cài đặt thất bại");
      return;
    }

    toast.success("Đã lưu cài đặt");
    onDone(data);
  };

  return (
    <div className="relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-xl md:max-w-2xl lg:max-w-3xl mt-20 md:mt-0"
      >
        <div className="flex w-full flex-col rounded-3xl p-6 bg-white shadow-card md:p-10 lg:p-14">
          <h3 className="text-3xl text-foreground font-bold">
            CÀI ĐẶT TRÒ CHƠI
          </h3>
          <FieldGroup className="mt-6 gap-7">
            <div className="grid grid-cols-12 gap-6">
              <Controller
                name="pointsPerGrain"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    className="col-span-12 sm:col-span-6"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor={field.name} className="font-semibold">
                      Điểm mỗi ngũ cốc
                    </FieldLabel>
                    <InputStepper
                      {...field}
                      id={field.name}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      onDecrease={() =>
                        field.onChange(Math.max(0, field.value - POINTS_STEP))
                      }
                      onIncrease={() =>
                        field.onChange(field.value + POINTS_STEP)
                      }
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="pointsPerGrass"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    className="col-span-12 sm:col-span-6"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor={field.name} className="font-semibold">
                      Điểm mỗi cọng cỏ
                    </FieldLabel>
                    <InputStepper
                      {...field}
                      id={field.name}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      onDecrease={() =>
                        field.onChange(Math.max(0, field.value - POINTS_STEP))
                      }
                      onIncrease={() =>
                        field.onChange(field.value + POINTS_STEP)
                      }
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="penalty"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  className="col-span-12 sm:col-span-6"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor={field.name} className="font-semibold">
                    Điểm phạt khi chạm vật phẩm
                  </FieldLabel>
                  <InputStepper
                    {...field}
                    id={field.name}
                    type="number"
                    aria-invalid={fieldState.invalid}
                    onDecrease={() =>
                      field.onChange(Math.max(0, field.value - PENALTY_STEP))
                    }
                    onIncrease={() =>
                      field.onChange(field.value + PENALTY_STEP)
                    }
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="border-t border-divider-warm" />

            <Field>
              <FieldLabel className="font-semibold">Tốc độ trò chơi</FieldLabel>
              <Controller
                control={control}
                name="gameSpeed"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="mt-4 flex flex-wrap gap-6"
                  >
                    {GAME_SPEED_OPTIONS.map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-3">
                        <RadioGroupItem
                          value={value}
                          id={`gameSpeed-${value}`}
                        />
                        <Label
                          className="font-semibold"
                          htmlFor={`gameSpeed-${value}`}
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </Field>
            <Button
              type="submit"
              variant="game"
              size="2xl"
              className="w-full uppercase"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Lưu cài đặt
            </Button>
          </FieldGroup>
        </div>
      </form>
    </div>
  );
};

export default AdminConfigs;
