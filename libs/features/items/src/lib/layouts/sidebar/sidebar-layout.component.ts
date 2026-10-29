import { Component, inject, Input, signal } from "@angular/core";
import { TuiAsideComponent, TuiAsideItemDirective } from "@taiga-ui/layout";
import { RouterLink } from "@angular/router";
import { TUI_DARK_MODE, TuiIcon } from "@taiga-ui/core";
import { TranslocoPipe } from "@jsverse/transloco";
import { UI_STORAGE } from "@life-os/domain-items";

export interface SidebarItem {
  link: string;
  icon: string;
  label: string;
}

@Component({
  selector: "lifeos-sidebar-layout",
  imports: [TuiAsideComponent, TuiAsideItemDirective, RouterLink, TuiIcon, TranslocoPipe],
  templateUrl: "./sidebar-layout.component.html",
  styleUrl: "./sidebar-layout.component.scss",
  standalone: true,
})
export class SidebarLayoutComponent {
  private readonly storage = inject(UI_STORAGE);

  protected readonly darkMode = inject(TUI_DARK_MODE);

  @Input() items: SidebarItem[] = [];

  protected readonly expanded = signal(this.storage.getItem<boolean>("expandedSidebar", false));

  protected handleToggle(): void {
    this.expanded.update((value) => {
      const next = !value;
      this.storage.setItem<boolean>("expandedSidebar", next);
      return next;
    });
  }
}
