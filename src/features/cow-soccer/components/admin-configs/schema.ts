import { z } from "zod";
import { GAME_SPEED_OPTIONS, type GameSpeed } from "./configs";

const gameSpeedValues = GAME_SPEED_OPTIONS.map((o) => o.value) as [
  GameSpeed,
  ...GameSpeed[],
];

export const schema = z
  .object({
    pointsPerGrain: z.number({ error: "Must be a number" }),
    pointsPerGrass: z.number({ error: "Must be a number" }),
    unlimitedTime: z.boolean(),
    timeLimit: z.number({ error: "Must be a number" }).optional(),
    winningScore: z.number({ error: "Must be a number" }).optional(),
    gameSpeed: z.enum(gameSpeedValues),
  })
  .superRefine((data, ctx) => {
    if (!data.unlimitedTime) {
      if (data.timeLimit == null || Number.isNaN(data.timeLimit)) {
        ctx.addIssue({
          code: "custom",
          message: "Time limit per round is required",
          path: ["timeLimit"],
        });
      }
      return;
    }

    if (data.winningScore == null || Number.isNaN(data.winningScore)) {
      ctx.addIssue({
        code: "custom",
        message: "Winning score is required",
        path: ["winningScore"],
      });
      return;
    }

    if (data.winningScore <= data.pointsPerGrain + data.pointsPerGrass) {
      ctx.addIssue({
        code: "custom",
        message:
          "Winning score must be greater than points per grain + points per grass",
        path: ["winningScore"],
      });
    }
  });

export type SettingsFormValues = z.infer<typeof schema>;
