import { Component, computed, input } from "@angular/core";
import { TranslocoPipe } from "@jsverse/transloco";
import { TuiBlockStatus } from "@taiga-ui/layout";
import { Status } from "./status-block.types";
import { STATUS_DATA } from "./status-block.config";

@Component({
  selector: "lifeos-status-block",
  standalone: true,
  imports: [TranslocoPipe, TuiBlockStatus],
  templateUrl: "./status-block.html",
  styleUrl: "./status-block.scss",
})
export class StatusBlockComponent {
  public readonly status = input.required<Status>();
  public readonly text = input<string>();

  protected readonly data = computed(() => STATUS_DATA[this.status()]);
}
