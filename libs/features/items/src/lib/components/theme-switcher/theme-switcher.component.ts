import { Component, inject } from "@angular/core";
import { TuiIcon } from "@taiga-ui/core";
import { TranslocoPipe } from "@jsverse/transloco";
import { UiThemeService } from "@life-os/shared-ui";

@Component({
  selector: "lifeos-theme-switcher",
  imports: [TranslocoPipe, TuiIcon],
  templateUrl: "./theme-switcher.component.html",
  styleUrl: "./theme-switcher.component.scss",
  standalone: true,
})
export class ThemeSwitcherComponent {
  protected readonly theme = inject(UiThemeService);
}
