import { Routes } from "@angular/router";
import { BasicLayoutComponent } from "@life-os/feature-items";

export const appRoutes: Routes = [
  {
    path: "",
    component: BasicLayoutComponent,
    data: {
      breadcrumbRoot: {
        label: "layouts.basic.sidebar.fields.main",
        url: "main",
      },
    },
    children: [
      {
        path: "",
        redirectTo: "main",
        pathMatch: "full",
      },
      {
        path: "main",
        loadComponent: () =>
          import("@life-os/feature-pages").then((m) => m.UnderDevelopmentComponent),
        data: { breadcrumb: "layouts.basic.sidebar.fields.main" },
      },
      {
        path: "things",
        loadComponent: () =>
          import("@life-os/feature-pages").then((m) => m.UnderDevelopmentComponent),
        data: { breadcrumb: "layouts.basic.sidebar.fields.things" },
      },
      {
        path: "documents",
        loadComponent: () =>
          import("@life-os/feature-pages").then((m) => m.UnderDevelopmentComponent),
        data: { breadcrumb: "layouts.basic.sidebar.fields.documents" },
      },
      {
        path: "events",
        loadComponent: () =>
          import("@life-os/feature-pages").then((m) => m.UnderDevelopmentComponent),
        data: { breadcrumb: "layouts.basic.sidebar.fields.events" },
      },
      {
        path: "analytics",
        loadComponent: () =>
          import("@life-os/feature-pages").then((m) => m.UnderDevelopmentComponent),
        data: { breadcrumb: "layouts.basic.sidebar.fields.analytics" },
      },
      {
        path: "**",
        redirectTo: "main",
      },
    ],
  },
];
