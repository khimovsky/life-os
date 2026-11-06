import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type UiTextareaSize = "sm" | "md" | "lg";
export type UiTextareaResize = "none" | "vertical" | "both";

@Component({
  selector: "lifeos-ui-textarea",
  standalone: true,
  templateUrl: "./ui-textarea.component.html",
  styleUrl: "./ui-textarea.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextareaComponent),
      multi: true,
    },
  ],
})
export class UiTextareaComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  public readonly size = input<UiTextareaSize>("md");

  public readonly placeholder = input("");
  public readonly rows = input(1);
  public readonly minLength = input<number>();
  public readonly maxLength = input<number>();

  public readonly name = input<string>();
  public readonly inputId = input<string>();

  public readonly required = input(false);
  public readonly disabled = input(false);
  public readonly readOnly = input(false);
  public readonly invalid = input(false);

  public readonly resize = input<UiTextareaResize>("vertical");
  public readonly showCounter = input(false);

  public readonly ariaLabel = input<string>();
  public readonly ariaDescribedBy = input<string>();

  protected readonly value = signal("");
  private readonly formDisabled = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly characterCount = computed(() => this.value().length);

  protected readonly counterText = computed(() => {
    const count = this.characterCount();
    const max = this.maxLength();

    return max == null ? `${count}` : `${count} / ${max}`;
  });

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: string | null): void {
    this.value.set(value ?? "");
    this.cdr.markForCheck();
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    this.cdr.markForCheck();
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    this.value.set(value);
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
