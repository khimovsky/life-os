import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type UiCheckboxSize = "sm" | "md" | "lg";

@Component({
  selector: "lifeos-ui-checkbox",
  standalone: true,
  templateUrl: "./ui-checkbox.component.html",
  styleUrl: "./ui-checkbox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckboxComponent),
      multi: true,
    },
  ],
})
export class UiCheckboxComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  public readonly size = input<UiCheckboxSize>("md");
  public readonly disabled = input(false);
  public readonly indeterminate = input(false);
  public readonly required = input(false);
  public readonly id = input<string>();
  public readonly name = input<string>();
  public readonly value = input<string>("on");
  public readonly ariaLabel = input<string>();
  public readonly ariaDescribedBy = input<string>();
  public readonly invalid = input<boolean>(false);

  public readonly checkedChange = output<boolean>();

  protected readonly checked = signal(false);

  private readonly formDisabled = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

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
