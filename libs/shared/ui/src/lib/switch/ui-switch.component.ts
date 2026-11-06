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

export type UiSwitchSize = "sm" | "md" | "lg";

let nextSwitchId = 0;

@Component({
  selector: "lifeos-ui-switch",
  standalone: true,
  templateUrl: "./ui-switch.component.html",
  styleUrl: "./ui-switch.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSwitchComponent),
      multi: true,
    },
  ],
})
export class UiSwitchComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly internalId = `ui-switch-${++nextSwitchId}`;

  public readonly size = input<UiSwitchSize>("md");

  public readonly disabled = input(false);
  public readonly required = input(false);
  public readonly invalid = input(false);

  public readonly id = input<string>();
  public readonly name = input<string>();
  public readonly ariaLabel = input<string>();
  public readonly ariaDescribedBy = input<string>();

  public readonly checkedChange = output<boolean>();

  protected readonly checked = signal(false);
  private readonly formDisabled = signal(false);

  protected readonly isDisabled = () => this.disabled() || this.formDisabled();

  protected readonly inputId = () => this.id() || this.internalId;

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: boolean | null): void {
    this.checked.set(!!value);
    this.cdr.markForCheck();
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    this.cdr.markForCheck();
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    this.checked.set(checked);
    this.onChange(checked);
    this.checkedChange.emit(checked);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
