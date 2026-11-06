import { Component } from "@angular/core";
import { UiStatusBlockComponent } from "@life-os/shared-ui";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: "lifeos-under-development",
  standalone: true,
  imports: [UiStatusBlockComponent, TranslocoPipe],
  templateUrl: "./under-development.component.html",
  styleUrl: "./under-development.component.scss",
})
export class UnderDevelopmentComponent {}
