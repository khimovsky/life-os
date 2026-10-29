import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TUI_DARK_MODE, TuiRoot } from "@taiga-ui/core";

@Component({
  imports: [RouterModule, TuiRoot, TuiRoot],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
