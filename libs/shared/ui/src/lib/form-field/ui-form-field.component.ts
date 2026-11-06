import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "lifeos-ui-form-field",
  standalone: true,
  templateUrl: "./ui-form-field.component.html",
  styleUrl: "./ui-form-field.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormFieldComponent {
  @Input() label = "";
  @Input() hint = "";
  @Input() error = "";
  @Input() controlId = "";
  @Input() required = false;
  @Input() disabled = false;

  protected get hasError(): boolean {
    return !!this.error;
  }

  public get hintId(): string {
    return this.controlId ? `${this.controlId}-hint` : "";
  }

  public get errorId(): string {
    return this.controlId ? `${this.controlId}-error` : "";
  }

  public get describedBy(): string {
    if (this.hasError) {
      return this.errorId;
    }

    return this.hint ? this.hintId : "";
  }
}
