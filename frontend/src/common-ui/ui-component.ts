export abstract class UIComponent {
  protected abstract initializeUI(): void;
  abstract show(): void;
  abstract hide(): void;
}
