export type DialogData = {
  id: string | undefined;
  description: string | undefined;
  questStart: string[];
  questInProgress: string[];
  questFinished: string[];
  hints: string[];
  options: string[] | undefined;
  correctOption: string | undefined;
  assetKey: string | undefined;
  quantityToCollect: number | undefined;
  completed: boolean | undefined;
};

export type RawDialogData = {
  id: string | undefined;
  description: string | undefined;
  questStart: string[];
  questStartIAGenerated: string[];
  questInProgress: string[];
  questInProgressIAGenerated: string[];
  questFinished: string[];
  questFinishedIAGenerated: string[];
  hints: string[];
  hintsIAGenerated: string[];
  options: string[] | undefined;
  correctOption: string | undefined;
  assetKey: string | undefined;
  quantityToCollect: number | undefined;
};

export type LevelData = {
  title: string;
  dialogs: DialogData[];
};
