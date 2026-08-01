type FieldObject =
  | { kind: "collectible"; sprite: string; points: number }
  | { kind: "obstacle"; sprite: string };

type SpawnedObject = FieldObject & { x: number };

export type { FieldObject, SpawnedObject };
