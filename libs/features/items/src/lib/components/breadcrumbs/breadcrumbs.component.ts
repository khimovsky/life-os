import { Component, computed, inject } from "@angular/core";
import { TuiBreadcrumbs, tuiBreadcrumbsOptionsProvider, TuiFade } from "@taiga-ui/kit";
import { TuiItem } from "@taiga-ui/cdk";
import { TuiLink } from "@taiga-ui/core";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { distinctUntilChanged, filter } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslocoPipe } from "@jsverse/transloco";
import { BreadcrumbService } from "@life-os/application-items";

@Component({
  selector: "lifeos-breadcrumbs",
  imports: [TuiBreadcrumbs, TuiFade, TuiItem, TuiLink, RouterLink, TranslocoPipe],
  templateUrl: "./breadcrumbs.component.html",
  styleUrl: "./breadcrumbs.component.scss",
  providers: [tuiBreadcrumbsOptionsProvider({ icon: "/" })],
  standalone: true,
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ),
  );

  protected readonly items = computed(() => {
    this.navigationEnd();
    return this.breadcrumbService.buildBreadCrumb(this.route.root);
  });
}
