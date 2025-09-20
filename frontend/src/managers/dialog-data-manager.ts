import { ItemAssets, type AssetKey } from "assets/assets";
import type { DialogData, RawDialogData } from "types/dialog-data";

const isNotEmpty = (arr: string[]): boolean =>
  arr.length > 0 && arr.some((t) => t.trim().length > 0);

export const loadDialogData = (scene: Phaser.Scene): DialogData[] => {
  const rawData = scene.cache.json.get(scene.scene.key.toLowerCase());

  return rawData.dialogs
    .map(
      (dialog: RawDialogData, index: number): DialogData => ({
        id: dialog.id || `d-${index}`,
        description: dialog.description,
        questStart: [
          dialog.questStart ?? [],
          dialog.questStartIAGenerated ?? [],
        ].filter(isNotEmpty),
        questInProgress: [
          dialog.questInProgress ?? [],
          dialog.questInProgressIAGenerated ?? [],
        ].filter(isNotEmpty),
        questPartiallyCompleted: [
          dialog.questPartiallyCompleted ?? [],
          dialog.questPartiallyCompletedIAGenerated ?? [],
        ].filter(isNotEmpty),
        questFinished: [
          dialog.questFinished ?? [],
          dialog.questFinishedIAGenerated ?? [],
        ].filter(isNotEmpty),
        questWrongItem: [
          dialog.questWrongItem ?? [],
          dialog.questWrongItemIAGenerated ?? [],
        ].filter(isNotEmpty),
        questHints: [
          dialog.questHints ?? [],
          dialog.hintsIAGenerated ?? [],
        ].filter(isNotEmpty),
        options: dialog.options,
        correctOption: dialog.correctOption,
        asset: dialog.assetKey
          ? ItemAssets[dialog.assetKey as AssetKey]
          : undefined,
        quantityToCollect: dialog.quantityToCollect,
        completed: false,
        disable: dialog.disable ?? false,
      }),
    )
    .filter((dialog: DialogData) => !dialog.disable);
};
