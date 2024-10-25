type Dialog = {
  id: string | undefined;
  description: string | undefined;
  statements: string[];
}

type DialogWithOptionsData = Dialog & {
  options: string[];
  correctOption: string;
}

export type LevelData = {
  title: string;
  npcs: Dialog[];
  dialog: Dialog[];
  dialogWithOptions: DialogWithOptionsData[];
}
