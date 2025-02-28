import type { DialogData, LevelData, RawDialogData } from "types/level-data";

export const loadLevelData = (
  scene: Phaser.Scene,
  level: string
): LevelData => {
  const rawData = scene.cache.json.get(level);

  const convertedDialogs = rawData.dialogs.map((dialog: RawDialogData) => {
    const convertedDialog: DialogData = {
      id: dialog.id,
      description: dialog.description,
      questStart: [
        ...(dialog.questStart || []),
        ...(dialog.questStartIAGenerated || [])
      ],
      questInProgress: [
        ...(dialog.questInProgress || []),
        ...(dialog.questInProgressIAGenerated || [])
      ],
      questFinished: [
        ...(dialog.questFinished || []),
        ...(dialog.questFinishedIAGenerated || [])
      ],
      hints: [
        ...(dialog.hints || []),
        ...(dialog.hintsIAGenerated || [])
      ],
      options: dialog.options,
      correctOption: dialog.correctOption,
      assetKey: dialog.assetKey,
      quantityToCollect: dialog.quantityToCollect,
      completed: false
    };
    return convertedDialog;
  });

  return {
    title: rawData.title,
    dialogs: convertedDialogs
  };
};
