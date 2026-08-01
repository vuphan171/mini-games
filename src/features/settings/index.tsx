import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GAME_SPEED_OPTIONS, GameSpeeds } from "./configs/game-speed";
import { schema, type SettingsFormValues } from "./schema";

const SettingsScreen = () => {
  const { control, handleSubmit, watch } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      pointsPerGrain: 0,
      pointsPerGrass: 0,
      unlimitedTime: false,
      timeLimit: 45,
      gameSpeed: GameSpeeds.normal,
    },
  });

  const unlimitedTime = watch("unlimitedTime");

  const onSubmit = (data: SettingsFormValues) => {
    console.log(data);
  };

  return (
    <div className="bg-game-gradient min-h-dvh w-full flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg rounded-[22px] border-4 p-8"
        style={{
          borderColor: "#21351f",
          background: "#fff8e7",
          boxShadow: "0 8px 0 #21351f, 0 18px 40px rgba(0,0,0,.35)",
        }}
      >
        <h1 className="mb-6 text-2xl font-extrabold text-[#2c7a37]">
          ⚙️ Game Settings
        </h1>

        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="pointsPerGrain"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="font-semibold">
                    Points per grain
                  </FieldLabel>
                  <Input
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="font-semibold">
                    Points per grass
                  </FieldLabel>
                  <Input
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

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="unlimitedTime" className="font-semibold">
                Unlimited play time
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

          {!unlimitedTime ? (
            <Controller
              name="timeLimit"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="font-semibold">
                    Time limit per round (seconds)
                  </FieldLabel>
                  <Input
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="font-semibold">
                    Winning score
                  </FieldLabel>
                  <Input
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

          <Field>
            <FieldLabel htmlFor="gameSpeed" className="font-semibold">
              Game speed
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
          <Button type="submit" variant="game" size="2xl" className="w-full">
            Save settings
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default SettingsScreen;
