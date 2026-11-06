import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type UiInputType = "text" | "email" | "password" | "number" | "search" | "tel" | "url";

export type UiInputSize = "sm" | "md" | "lg";
export type UiInputValue = string | number | null;

@Component({
  selector: "lifeos-ui-input",
  standalone: true,
  templateUrl: "./ui-input.component.html",
  styleUrl: "./ui-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() type: UiInputType = "text";
  @Input() size: UiInputSize = "md";

  @Input() placeholder = "";
  @Input() autocomplete = "";
  @Input() name = "";
  @Input() inputId = "";
  @Input() ariaLabel = "";
  @Input() ariaDescribedBy = "";

  @Input() required = false;
  @Input() readonly = false;
  @Input() clearable = false;
  @Input() invalid = false;

  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;

  protected value: UiInputValue = "";
  protected disabled = false;
  protected passwordVisible = false;

  private onChange: (value: UiInputValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get nativeType(): string {
    if (this.type === "password" && this.passwordVisible) {
      return "text";
    }

    return this.type;
  }

  protected get hasValue(): boolean {
    return this.value !== "" && this.value !== null;
  }

  protected get canClear(): boolean {
    return this.clearable && this.hasValue && !this.disabled && !this.readonly;
  }

  protected get canTogglePassword(): boolean {
    return this.type === "password" && !this.disabled && !this.readonly;
  }

  public writeValue(value: UiInputValue): void {
    this.value = value ?? "";
    this.cdr.markForCheck();
  }

  public registerOnChange(fn: (value: UiInputValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected handleInput(rawValue: string): void {
    const value: UiInputValue =
      this.type === "number" ? (rawValue === "" ? null : Number(rawValue)) : rawValue;

    this.value = value;
    this.onChange(value);
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected clear(input: HTMLInputElement): void {
    if (!this.canClear) {
      return;
    }

    this.value = "";
    this.onChange(this.type === "number" ? null : "");
    input.focus();
  }

  protected togglePasswordVisibility(): void {
    if (!this.canTogglePassword) {
      return;
    }

    this.passwordVisible = !this.passwordVisible;
  }
}
