import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  usePinSchema,
  TPinSchema,
  PIN_CODE_LENGTH,
} from "./config-dialog.schema";

type Props = {
  onOpenConfig: () => void;
};

const ConfigDialog = ({ onOpenConfig }: Props) => {
  const [open, setOpen] = useState(false);

  const pinSchema = usePinSchema();

  const { control, handleSubmit, formState, reset } = useForm<TPinSchema>({
    resolver: zodResolver(pinSchema),
    mode: "onSubmit",
    defaultValues: { pin: "" },
  });

  const onSubmit = () => {
    onOpenConfig();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute top-4 right-4 text-2xl opacity-40 transition-opacity hover:opacity-80"
          aria-label="Cài đặt"
        >
          ⚙️
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-[#2c7a37] text-3xl font-semibold">
            NHẬP MÃ PIN
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3.5"
        >
          <Controller
            name="pin"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Mã PIN
                </FieldLabel>
                <Input
                  {...field}
                  onChange={(e) => {
                    const digitsOnly = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, PIN_CODE_LENGTH);
                    field.onChange(digitsOnly);
                  }}
                  id={field.name}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={PIN_CODE_LENGTH}
                  autoComplete="off"
                  placeholder="••••"
                  className="text-center indent-[0.5em] text-3xl placeholder:text-3xl tracking-[0.5em]"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.isTouched && fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            className="mt-4"
            type="submit"
            size="2xl"
            variant="game"
            disabled={!formState.isValid}
          >
            Xác nhận
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDialog;
