import type { AssetConfig } from "./asset";

export type DialogData = {
  id?: string;
  description?: string;
  questStart: string[][];
  questInProgress: string[][];
  questPartiallyCompleted: string[][];
  questFinished: string[][];
  questWrongItem: string[][];
  questHints?: string[][];
  options?: string[];
  correctOption?: string;
  asset?: AssetConfig;
  quantityToCollect?: number;
  completed?: boolean;
  disable?: boolean;
};

export type RawDialogData = {
  id?: string;
  description?: string;
  questStart: string[];
  questStartIAGenerated?: string[];
  questPartiallyCompleted: string[];
  questPartiallyCompletedIAGenerated?: string[];
  questInProgress: string[];
  questInProgressIAGenerated?: string[];
  questFinished: string[];
  questFinishedIAGenerated?: string[];
  questWrongItem: string[];
  questWrongItemIAGenerated?: string[];
  questHints?: string[];
  hintsIAGenerated?: string[];
  options?: string[];
  correctOption?: string;
  assetKey?: string;
  quantityToCollect?: number;
  disable?: boolean;
};
