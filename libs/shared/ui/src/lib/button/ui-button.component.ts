import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

export type UiButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";

export type UiButtonSize = "sm" | "md" | "lg";

export type UiButtonType = "button" | "submit" | "reset";

@Component({
  selector: "lifeos-ui-button",
  standalone: true,
  templateUrl: "./ui-button.component.html",
  styleUrl: "./ui-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = "primary";
  @Input() size: UiButtonSize = "md";
  @Input() type: UiButtonType = "button";

  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  protected get isDisabled(): boolean {
    return this.disabled || this.loading;
  }
}
