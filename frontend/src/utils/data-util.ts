import type { DialogData, LevelData, RawDialogData } from "types/level-data";

const isNotEmpty = (arr: string[]): boolean =>
  arr.length > 0 && arr.some((t) => t.trim().length > 0);

export const loadLevelData = (
  scene: Phaser.Scene,
  level: string,
): LevelData => {
  const rawData = scene.cache.json.get(level);

  const convertedDialogs = rawData.dialogs.map(
    (dialog: RawDialogData): DialogData => ({
      id: dialog.id,
      description: dialog.description,
      questStart: [
        dialog.questStart ?? [],
        dialog.questStartIAGenerated ?? [],
      ].filter(isNotEmpty),
      questInProgress: [
        dialog.questInProgress ?? [],
        dialog.questInProgressIAGenerated ?? [],
      ].filter(isNotEmpty),
      questFinished: [
        dialog.questFinished ?? [],
        dialog.questFinishedIAGenerated ?? [],
      ].filter(isNotEmpty),
      questWrongItem: [
        dialog.questWrongItem ?? [],
        dialog.questWrongItemIAGenerated ?? [],
      ].filter(isNotEmpty),
      hints: [dialog.hints ?? [], dialog.hintsIAGenerated ?? []].filter(
        isNotEmpty,
      ),
      options: dialog.options,
      correctOption: dialog.correctOption,
      assetKey: dialog.assetKey,
      quantityToCollect: dialog.quantityToCollect,
      completed: false,
      disable: dialog.disable ?? false,
    }),
  );

  return {
    title: rawData.title,
    dialogs: convertedDialogs.filter((dialog: DialogData) => !dialog.disable),
  };
};
