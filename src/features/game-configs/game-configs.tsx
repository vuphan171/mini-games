import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GAME_SPEED_OPTIONS, DEFAULT_GAME_CONFIG } from "./configs";
import { getGameConfig, saveGameConfig } from "./helpers";
import { schema, type SettingsFormValues } from "./schema";
import { InputStepper } from "@/components/ui/input-stepper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AdminConfigs = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, watch } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getGameConfig() ?? DEFAULT_GAME_CONFIG,
  });

  const unlimitedTime = watch("unlimitedTime");

  const onSubmit = (data: SettingsFormValues) => {
    saveGameConfig(data);
    toast.success("Đã lưu cài đặt");
    navigate("/");
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="border-t border-divider-warm" />

            <Field
              className="flex has-[>[data-slot=field-content]]:items-center"
              orientation="horizontal"
            >
              <FieldContent>
                <FieldLabel htmlFor="unlimitedTime" className="font-semibold">
                  Không giới hạn thời gian chơi
                </FieldLabel>
              </FieldContent>
              <Controller
                control={control}
                name="unlimitedTime"
                render={({ field }) => (
                  <Switch
                    id="unlimitedTime"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>
            <div className="ml-4 col-span-12">
              {!unlimitedTime ? (
                <Controller
                  name="timeLimit"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="flex flex-col items-center gap-2 md:flex-row"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-semibold"
                      >
                        Thời gian mỗi lượt chơi (giây)
                      </FieldLabel>
                      <InputStepper
                        {...field}
                        id={field.name}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : (
                <Controller
                  name="winningScore"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="flex flex-col items-center gap-2 md:flex-row"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-semibold"
                      >
                        Điểm để thắng
                      </FieldLabel>
                      <InputStepper
                        {...field}
                        id={field.name}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}
            </div>

            <div className="border-t border-divider-warm" />

            <Field>
              <FieldLabel htmlFor="gameSpeed" className="font-semibold">
                Tốc độ trò chơi
              </FieldLabel>
              <Controller
                control={control}
                name="gameSpeed"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="gameSpeed" size="lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_SPEED_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Button
              type="submit"
              variant="game"
              size="2xl"
              className="w-full uppercase"
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
