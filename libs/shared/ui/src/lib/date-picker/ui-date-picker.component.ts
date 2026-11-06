import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { TuiDay } from "@taiga-ui/cdk";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TuiTextfield } from "@taiga-ui/core";
import { TuiInputDate } from "@taiga-ui/kit";

export type UiDatePickerSize = "sm" | "md" | "lg";

@Component({
  selector: "lifeos-ui-date-picker",
  standalone: true,
  templateUrl: "./ui-date-picker.component.html",
  styleUrl: "./ui-date-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiTextfield, ReactiveFormsModule, TuiInputDate],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDatePickerComponent),
      multi: true,
    },
  ],
})
export class UiDatePickerComponent implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);

  readonly size = input<UiDatePickerSize>("md");
  readonly placeholder = input("ДД.ММ.ГГГГ");

  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);

  readonly disabled = input(false);
  readonly readOnly = input(false);
  readonly clearable = input(false);
  readonly invalid = input(false);

  readonly inputId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  protected readonly control = new FormControl<TuiDay | null>(null);

  private readonly formDisabled = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly min = computed(() => {
    const date = this.minDate();

    return date ? this.toTuiDay(date) : null;
  });

  protected readonly max = computed(() => {
    const date = this.maxDate();

    return date ? this.toTuiDay(date) : null;
  });

  private onChange: (value: Date | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.onChange(value?.toLocalNativeDate() ?? null);
    });

    effect(() => {
      const disabled = this.isDisabled();

      if (disabled && this.control.enabled) {
        this.control.disable({ emitEvent: false });
      } else if (!disabled && this.control.disabled) {
        this.control.enable({ emitEvent: false });
      }
    });
  }

  writeValue(value: Date | null): void {
    this.control.setValue(
      value instanceof Date && !Number.isNaN(value.getTime()) ? this.toTuiDay(value) : null,
      { emitEvent: false },
    );
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private toTuiDay(date: Date): TuiDay {
    return TuiDay.fromLocalNativeDate(date);
  }
}
