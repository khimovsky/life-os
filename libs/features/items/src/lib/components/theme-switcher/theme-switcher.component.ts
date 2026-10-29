import { Component, inject } from "@angular/core";
import { TUI_DARK_MODE, TuiButton } from "@taiga-ui/core";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: "lifeos-theme-switcher",
  imports: [TuiButton, TranslocoPipe],
  templateUrl: "./theme-switcher.component.html",
  styleUrl: "./theme-switcher.component.scss",
  standalone: true,
})
export class ThemeSwitcherComponent {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
