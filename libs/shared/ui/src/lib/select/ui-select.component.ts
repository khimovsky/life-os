import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type UiSelectSize = "sm" | "md" | "lg";
export type UiSelectValue<T> = T | null | T[];

export interface UiSelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

@Component({
  selector: "lifeos-ui-select",
  standalone: true,
  templateUrl: "./ui-select.component.html",
  styleUrl: "./ui-select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
})
export class UiSelectComponent<T = string> implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() options: UiSelectOption<T>[] = [];
  @Input() size: UiSelectSize = "md";
  @Input() placeholder = "";
  @Input() inputId = "";
  @Input() ariaLabel = "";
  @Input() ariaDescribedBy = "";

  @Input() clearable = false;
  @Input() multiple = false;
  @Input() invalid = false;
  @Input() loading = false;

  protected value: UiSelectValue<T> = null;
  protected disabled = false;
  protected opened = false;
  protected activeIndex = -1;

  private onChange: (value: UiSelectValue<T>) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get selectedOption(): UiSelectOption<T> | undefined {
    if (this.multiple || this.value === null || Array.isArray(this.value)) {
      return undefined;
    }

    return this.options.find((option) => Object.is(option.value, this.value));
  }

  protected get selectedOptions(): UiSelectOption<T>[] {
    if (!this.multiple || !Array.isArray(this.value)) {
      return [];
    }

    const selectedValues = this.value;

    return this.options.filter((option) =>
      selectedValues.some((value) => Object.is(value, option.value)),
    );
  }

  protected get selectedIndex(): number {
    if (this.multiple || this.value === null || Array.isArray(this.value)) {
      return -1;
    }

    return this.options.findIndex((option) => Object.is(option.value, this.value));
  }

  protected get hasValue(): boolean {
    return this.multiple ? Array.isArray(this.value) && this.value.length > 0 : this.value !== null;
  }

  protected get canClear(): boolean {
    return this.clearable && this.hasValue && !this.disabled && !this.loading;
  }

  public writeValue(value: UiSelectValue<T>): void {
    this.value = this.multiple
      ? Array.isArray(value)
        ? [...value]
        : []
      : Array.isArray(value)
      ? value[0] ?? null
      : value;

    this.cdr.markForCheck();
  }

  public registerOnChange(fn: (value: UiSelectValue<T>) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (isDisabled) {
      this.close();
    }

    this.cdr.markForCheck();
  }

  protected toggle(): void {
    if (this.disabled || this.loading) return;

    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  protected open(): void {
    if (this.disabled || this.loading) return;

    this.opened = true;

    const selectedIndex = this.multiple
      ? this.options.findIndex((option) => this.isSelected(option))
      : this.selectedIndex;

    this.activeIndex = selectedIndex >= 0 ? selectedIndex : this.findEnabledOption(0, 1);

    this.cdr.markForCheck();
  }

  protected close(): void {
    this.opened = false;
    this.activeIndex = -1;
    this.onTouched();
    this.cdr.markForCheck();
  }

  protected select(option: UiSelectOption<T>): void {
    if (option.disabled || this.disabled || this.loading) return;

    if (this.multiple) {
      const currentValue = Array.isArray(this.value) ? [...this.value] : [];
      const existingIndex = currentValue.findIndex((value) => Object.is(value, option.value));

      if (existingIndex >= 0) {
        currentValue.splice(existingIndex, 1);
      } else {
        currentValue.push(option.value);
      }

      this.value = currentValue;
      this.onChange([...currentValue]);
      this.cdr.markForCheck();
      return;
    }

    this.value = option.value;
    this.onChange(option.value);
    this.close();
  }

  protected removeOption(option: UiSelectOption<T>, event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled || this.loading || !this.multiple) return;

    const currentValue = Array.isArray(this.value) ? [...this.value] : [];
    const nextValue = currentValue.filter((value) => !Object.is(value, option.value));

    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
    this.cdr.markForCheck();
  }

  protected clear(event?: MouseEvent): void {
    event?.stopPropagation();

    if (!this.canClear) return;

    this.value = this.multiple ? [] : null;
    this.onChange(this.value);
    this.onTouched();
    this.cdr.markForCheck();
  }

  protected isSelected(option: UiSelectOption<T>): boolean {
    if (this.multiple) {
      return (
        Array.isArray(this.value) && this.value.some((value) => Object.is(value, option.value))
      );
    }

    return this.value !== null && !Array.isArray(this.value) && Object.is(option.value, this.value);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.loading) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        if (!this.opened) {
          this.open();
        } else {
          this.moveActive(1);
        }
        break;

      case "ArrowUp":
        event.preventDefault();

        if (!this.opened) {
          this.open();
        } else {
          this.moveActive(-1);
        }
        break;

      case "Enter":
      case " ":
        event.preventDefault();

        if (!this.opened) {
          this.open();
        } else {
          this.selectActive();
        }
        break;

      case "Escape":
        if (this.opened) {
          event.preventDefault();
          this.close();
        }
        break;

      case "Backspace":
        if (this.multiple && Array.isArray(this.value) && this.value.length) {
          event.preventDefault();
          this.removeLastSelected();
        } else if (this.canClear) {
          event.preventDefault();
          this.clear();
        }
        break;
    }
  }

  protected optionId(index: number): string {
    return `${this.inputId || "ui-select"}-option-${index}`;
  }

  @HostListener("document:click", ["$event"])
  protected handleOutsideClick(event: MouseEvent): void {
    if (this.opened && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  private removeLastSelected(): void {
    if (!Array.isArray(this.value) || !this.value.length) return;

    const nextValue = this.value.slice(0, -1);
    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
    this.cdr.markForCheck();
  }

  private moveActive(direction: 1 | -1): void {
    const length = this.options.length;

    if (!length) {
      this.activeIndex = -1;
      return;
    }

    const startIndex = this.activeIndex === -1 ? (direction === 1 ? -1 : 0) : this.activeIndex;

    for (let offset = 1; offset <= length; offset++) {
      const nextIndex = (startIndex + direction * offset + length) % length;

      if (!this.options[nextIndex].disabled) {
        this.activeIndex = nextIndex;
        this.cdr.markForCheck();
        return;
      }
    }

    this.activeIndex = -1;
  }

  private findEnabledOption(start: number, direction: 1 | -1): number {
    const length = this.options.length;

    if (!length) return -1;

    for (let offset = 0; offset < length; offset++) {
      const index = (start + direction * offset + length) % length;

      if (!this.options[index].disabled) {
        return index;
      }
    }

    return -1;
  }

  private selectActive(): void {
    const option = this.options[this.activeIndex];

    if (option) {
      this.select(option);
    }
  }
}
