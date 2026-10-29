import { Component } from "@angular/core";
import { StatusBlockComponent } from "@life-os/shared-ui";

@Component({
  selector: "lifeos-under-development",
  standalone: true,
  imports: [StatusBlockComponent],
  templateUrl: "./under-development.component.html",
  styleUrl: "./under-development.component.scss",
})
export class UnderDevelopmentComponent {}
