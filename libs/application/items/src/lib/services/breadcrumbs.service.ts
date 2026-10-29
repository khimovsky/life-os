import { Injectable, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Breadcrumb } from "@life-os/domain-items";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  private readonly dynamicLabels = signal<Record<string, string>>({});

  public setLabel(url: string, label: string): void {
    this.dynamicLabels.update((prev) => ({ ...prev, [url]: label }));
  }

  public getLabel(url: string): string {
    return this.dynamicLabels()[url];
  }

  public buildBreadCrumb(
    route: ActivatedRoute,
    url = "",
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    if (breadcrumbs.length === 0) {
      const rootConfig = route.pathFromRoot
        .map((r) => r.routeConfig?.data?.["breadcrumbRoot"])
        .find(Boolean);

      if (rootConfig) {
        breadcrumbs = [
          {
            labelKey: rootConfig.label,
            url: `/${rootConfig.url}`,
          },
        ];
      }
    }

    const routeConfig = route.routeConfig;

    if (!routeConfig) {
      return route.firstChild
        ? this.buildBreadCrumb(route.firstChild, url, breadcrumbs)
        : breadcrumbs;
    }

    const segments = route.snapshot.url.map((segment) => segment.path);
    const nextUrl = segments.length ? `${url}/${segments.join("/")}` : url;

    const label = this.getLabel(nextUrl) || routeConfig.data?.["breadcrumb"] || "";

    const isRootBreadcrumb = breadcrumbs.some((item) => item.url === nextUrl);

    const nextBreadcrumbs =
      label && !isRootBreadcrumb
        ? [...breadcrumbs, { labelKey: label, url: nextUrl || "/" }]
        : breadcrumbs;

    return route.firstChild
      ? this.buildBreadCrumb(route.firstChild, nextUrl, nextBreadcrumbs)
      : nextBreadcrumbs;
  }
}
