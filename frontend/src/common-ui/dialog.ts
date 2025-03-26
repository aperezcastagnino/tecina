import type { DialogData } from "types/level-data";
import { Animations } from "utils/animation-utils";
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
    Animations.animateText(
      this.scene,
      this.statementUI,
      this.messagesToShow.shift() || "",
      10,
      () => {
        this.textAnimationPlaying = false;
      },
    );
  }

  setMessageComplete(npcId?: string): void {
    if (!this.activeDialog) return;

    if (this.questGiverNpcId === npcId) {
      this.activeDialog!.completed = true;
      this.activeDialog = undefined;
      this.questGiverNpcId = undefined;
    }
  }

  getQuestGiverNpcId(): string | undefined {
    return this.questGiverNpcId;
  }

  getAssetKey(): string | undefined {
    return this.activeDialog?.assetKey;
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

    if (!this.activeDialog) {
      this.activeDialog = dialog;
      this.questGiverNpcId = npcId;
    }

    const textsToShow = this.resolveDialogsToShow(dialog, npcId);
    this.messagesToShow = [...textsToShow];
    this.showNextMessage();
  }

  private resolveDialogsToShow(dialog: DialogData, npcId?: string): string[] {
    if (this.questGiverNpcId === npcId) return this.selectRandomText(dialog.questInProgress);
    if (this.questGiverNpcId) return this.selectRandomText(dialog.hints);

    // eslint-disable-next-line no-param-reassign
    this.questGiverNpcId = npcId || "";
    return this.selectRandomText(dialog.questStart);

  }

  private findMessageInCompleted(dialogs?: DialogData[]): DialogData | undefined {
    return dialogs?.find(
      (dialog) =>
        !dialog.completed && (!dialog.options || dialog.options.length === 0),
    );
  }
}
