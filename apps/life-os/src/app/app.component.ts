import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TuiRoot } from "@taiga-ui/core";
import { UiThemeService } from "@life-os/shared-ui";

@Component({
  imports: [RouterModule, TuiRoot],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  protected readonly theme = inject(UiThemeService);
}
