import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "lifeos-ui-status-block",
  standalone: true,
  templateUrl: "./ui-status-block.component.html",
  styleUrl: "./ui-status-block.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStatusBlockComponent {
  public readonly title = input<string>();
  public readonly description = input<string>();
  public readonly image = input<string>();
}
