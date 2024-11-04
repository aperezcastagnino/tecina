export type DialogData = {
  id: string | undefined;
  description: string | undefined;
  statements: string[];
  options: string[] | undefined;
  correctOption: string | undefined;
  completed: boolean | undefined;
};

export type DialogDataNPC = {
  id: string;
  description: string | undefined;
  dialogs: DialogData[];
};

export type DialogDataCollection = {
  npcs: DialogDataNPC[];
  simpleDialogs: DialogData[];
  dialogsWithOptions: DialogWithOptionsData[];
};

export type LevelData = {
  title: string;
  dialogs: DialogDataCollection;
};
