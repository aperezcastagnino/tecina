export type DialogData = {
  id: string | undefined;
  description: string | undefined;
  statements: string[];
  options: string[] | undefined;
  correctOption: string | undefined;
  showed: boolean | undefined;
};

export type DialogDataCollection = {
  npcs: DialogData[][];
  simpleDialogs: DialogData[];
  dialogsWithOptions: DialogWithOptionsData[];
};

export type LevelData = {
  title: string;
  dialogs: DialogDataCollection;
};
