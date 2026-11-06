import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type UiRadioGroupSize = "sm" | "md" | "lg";
export type UiRadioGroupDirection = "horizontal" | "vertical";

export interface UiRadioGroupOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

let nextRadioGroupId = 0;

@Component({
  selector: "lifeos-ui-radio-group",
  standalone: true,
  templateUrl: "./ui-radio-group.component.html",
  styleUrl: "./ui-radio-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiRadioGroupComponent),
      multi: true,
    },
  ],
})
export class UiRadioGroupComponent<T = string> implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly internalId = `ui-radio-group-${++nextRadioGroupId}`;

  public readonly options = input<UiRadioGroupOption<T>[]>([]);
  public readonly size = input<UiRadioGroupSize>("md");
  public readonly direction = input<UiRadioGroupDirection>("vertical");

  public readonly name = input<string>();
  public readonly inputId = input<string>();

  public readonly disabled = input(false);
  public readonly required = input(false);
  public readonly invalid = input(false);

  public readonly ariaLabel = input<string>();
  public readonly ariaDescribedBy = input<string>();

  public readonly valueChange = output<T>();

  protected readonly value = signal<T | null>(null);
  private readonly formDisabled = signal(false);

  protected readonly isDisabled = () => this.disabled() || this.formDisabled();

  protected readonly groupName = () => this.name() || this.internalId;

  protected readonly optionId = (index: number) => `${this.inputId() || this.internalId}-${index}`;

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: T | null): void {
    this.value.set(value);
    this.cdr.markForCheck();
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    this.cdr.markForCheck();
  }

  protected selectOption(option: UiRadioGroupOption<T>): void {
    if (this.isDisabled() || option.disabled || this.value() === option.value) {
      return;
    }

    this.value.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
