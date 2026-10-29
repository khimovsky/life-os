import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarItem, SidebarLayoutComponent } from "../sidebar/sidebar-layout.component";
import { HeaderLayoutComponent } from "../header/header-layout.component";

@Component({
  selector: "lifeos-basic-layout",
  imports: [RouterOutlet, SidebarLayoutComponent, HeaderLayoutComponent],
  templateUrl: "./basic-layout.component.html",
  styleUrl: "./basic-layout.component.scss",
  standalone: true,
})
export class BasicLayoutComponent {
  protected readonly links: SidebarItem[] = [
    { label: "layouts.basic.sidebar.fields.main", link: "main", icon: "@tui.home" },
    { label: "layouts.basic.sidebar.fields.things", link: "things", icon: "@tui.box" },
    { label: "layouts.basic.sidebar.fields.documents", link: "documents", icon: "@tui.file" },
    { label: "layouts.basic.sidebar.fields.events", link: "events", icon: "@tui.calendar-days" },
    {
      label: "layouts.basic.sidebar.fields.analytics",
      link: "analytics",
      icon: "@tui.chart-no-axes-column-increasing",
    },
  ];
}
