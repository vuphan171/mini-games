import { z } from "zod";
import { GAME_SPEED_OPTIONS, type GameSpeed } from "../configs";

const gameSpeedValues = GAME_SPEED_OPTIONS.map((o) => o.value) as [
  GameSpeed,
  ...GameSpeed[],
];

export const schema = z
  .object({
    pointsPerGrain: z.number({ error: "Phải là một số" }),
    pointsPerGrass: z.number({ error: "Phải là một số" }),
    penalty: z.number({ error: "Phải là một số" }),
    unlimitedTime: z.boolean(),
    timeLimit: z.number({ error: "Phải là một số" }).optional(),
    winningScore: z.number({ error: "Phải là một số" }).optional(),
    gameSpeed: z.enum(gameSpeedValues),
  })
  .superRefine((data, ctx) => {
    if (!data.unlimitedTime) {
      if (data.timeLimit == null || Number.isNaN(data.timeLimit)) {
        ctx.addIssue({
          code: "custom",
          message: "Vui lòng nhập thời gian mỗi lượt chơi",
          path: ["timeLimit"],
        });
      }
      return;
    }

    if (data.winningScore == null || Number.isNaN(data.winningScore)) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng nhập điểm để thắng",
        path: ["winningScore"],
      });
      return;
    }

    if (data.winningScore <= data.pointsPerGrain + data.pointsPerGrass) {
      ctx.addIssue({
        code: "custom",
        message:
          "Điểm để thắng phải lớn hơn tổng điểm mỗi bông lúa + điểm mỗi cọng cỏ",
        path: ["winningScore"],
      });
    }
  });

export type SettingsFormValues = z.infer<typeof schema>;
