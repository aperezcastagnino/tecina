import type { DialogData } from "types/dialog-data";
import { AnimationManager } from "managers/animation-manager";
import type { AssetConfig } from "types/asset";
import { BaseDialog, type DialogConfig } from "./base-dialog";

export class Dialog extends BaseDialog {
  private messagesToShow: string[] = [];

  constructor(config: DialogConfig) {
    super(config);
    this.initializeUI();
    this.hide();
  }

  show(npcId?: string): void {
    this.getDialogData(npcId);
  }

  hide(): void {
    this.isVisible = false;
  }

  showNextMessage(): void {
    if (this.textAnimationPlaying) return;

    if (this.messagesToShow.length === 0 && this.isVisible) {
      this.hide();
      return;
    }

    if (this.messagesToShow.length === 0) return;

    this.isVisible = true;
    this.statementUI.setText("").setAlpha(1);
    this.textAnimationPlaying = true;
    AnimationManager.animateText(
      this.scene,
      this.statementUI,
      this.messagesToShow.shift() || "",
      10,
      () => {
        this.textAnimationPlaying = false;
      }
    );
  }

  setMessageComplete(npcId?: string): void {
    if (!this.activeDialog) return;

    if (this.questGiverNpcId === npcId) {
      const textFinished = this.selectRandomText(
        this.activeDialog.questFinished
      );
      this.messagesToShow = [...textFinished];
      this.showNextMessage();

      this.activeDialog!.completed = true;
      this.questGiverNpcId = undefined;
      this.activeDialog = undefined;
    }
  }

  showPartiallyCompletedDialog(npcId?: string): void {
    if (!this.activeDialog || this.questGiverNpcId !== npcId) return;

    const textPartiallyCompleted = this.selectRandomText(
      this.activeDialog.questPartiallyCompleted
    );
    this.messagesToShow = [...textPartiallyCompleted];
    this.showNextMessage();
  }

  showWrongItemDialog(npcId?: string): void {
    if (!this.activeDialog || this.questGiverNpcId !== npcId) return;

    const textWrongItem = this.selectRandomText(
      this.activeDialog.questWrongItem
    );
    this.messagesToShow = [...textWrongItem];
    this.showNextMessage();
  }

  getQuestGiverNpcId(): string | undefined {
    return this.questGiverNpcId;
  }

  getAssetKey(): AssetConfig | undefined {
    return this.activeDialog?.asset;
  }

  isDialogActive(): boolean {
    return !!this.activeDialog;
  }

  getQuantityToCollect(): number | undefined {
    return this.activeDialog?.quantityToCollect;
  }

  private getDialogData(npcId?: string): void {
    const dialog = this.activeDialog || this.findMessageInCompleted(this.data);

    if (!dialog) {
      console.error("No dialogs not shown were found.");
      this.hide();
      return;
    }

    const textsToShow = this.resolveDialogsToShow(dialog, npcId);
    this.messagesToShow = [...textsToShow];
    this.showNextMessage();
  }

  private resolveDialogsToShow(dialog: DialogData, npcId?: string): string[] {
    if (this.questGiverNpcId === npcId)
      return this.selectRandomText(dialog.questInProgress);
    if (this.questGiverNpcId && dialog.hints)
      return this.selectRandomText(dialog.hints);

    this.questGiverNpcId = npcId || "";
    this.activeDialog = dialog;

    return this.selectRandomText(dialog.questStart);
  }

  private findMessageInCompleted(
    dialogs?: DialogData[]
  ): DialogData | undefined {
    return dialogs?.find(
      (dialog) =>
        !dialog.completed && (!dialog.options || dialog.options.length === 0)
    );
  }
}
