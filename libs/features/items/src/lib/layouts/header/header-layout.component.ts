import { Component } from "@angular/core";
import { LanguageSwitcherComponent } from "../../components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "../../components/theme-switcher/theme-switcher.component";
import { BreadcrumbsComponent } from "../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: "lifeos-header-layout",
  imports: [ThemeSwitcherComponent, LanguageSwitcherComponent, BreadcrumbsComponent],
  templateUrl: "./header-layout.component.html",
  styleUrl: "./header-layout.component.scss",
  standalone: true,
})
export class HeaderLayoutComponent {}
