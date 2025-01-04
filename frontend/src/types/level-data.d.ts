export type DialogData = {
  id: string | undefined;
  description: string | undefined;
  questStart: string[];
  questInProgress: string[];
  questFinished: string[];
  hints: string[];
  options: string[] | undefined;
  correctOption: string | undefined;
  showed: boolean | undefined;
  showed_by: string | undefined;
  completed: boolean | undefined;
};

export type LevelData = {
  title: string;
  dialogs: DialogData[];
};
