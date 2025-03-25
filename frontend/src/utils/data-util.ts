import type { DialogData, LevelData, RawDialogData } from "types/level-data";

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
        ...(dialog.questStart ?? []).filter(Boolean),
        ...(dialog.questStartIAGenerated ?? []).filter(Boolean),
      ],
      questInProgress: [
        ...(dialog.questInProgress ?? []).filter(Boolean),
        ...(dialog.questInProgressIAGenerated ?? []).filter(Boolean),
      ],
      questFinished: [
        ...(dialog.questFinished ?? []).filter(Boolean),
        ...(dialog.questFinishedIAGenerated ?? []).filter(Boolean),
      ],
      hints: [
        ...(dialog.hints ?? []).filter(Boolean),
        ...(dialog.hintsIAGenerated ?? []).filter(Boolean),
      ],
      options: dialog.options,
      correctOption: dialog.correctOption,
      assetKey: dialog.assetKey,
      quantityToCollect: dialog.quantityToCollect,
      completed: false,
      disable: dialog.disable ?? true,
    }),
  );

  return {
    title: rawData.title,
    dialogs: convertedDialogs.filter((dialog: DialogData) => !dialog.disable),
  };
};
