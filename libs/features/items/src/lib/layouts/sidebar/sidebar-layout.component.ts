import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslocoPipe } from "@jsverse/transloco";
import { TuiIcon } from "@taiga-ui/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LanguageSwitcherComponent } from "../../components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "../../components/theme-switcher/theme-switcher.component";

export interface SidebarItem {
  link: string;
  icon: string;
  label: string;
}

@Component({
  selector: "lifeos-sidebar-layout",
  imports: [
    TranslocoPipe,
    TuiIcon,
    RouterLinkActive,
    ThemeSwitcherComponent,
    LanguageSwitcherComponent,
    RouterLink,
  ],
  templateUrl: "./sidebar-layout.component.html",
  styleUrl: "./sidebar-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SidebarLayoutComponent {
  public readonly items = input<readonly SidebarItem[]>([]);
}
