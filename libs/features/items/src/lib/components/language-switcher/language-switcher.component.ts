import { TitleCasePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { TuiButton } from "@taiga-ui/core/components/button";
import { TuiDataList } from "@taiga-ui/core/components/data-list";
import { tuiScrollbarOptionsProvider } from "@taiga-ui/core/components/scrollbar";
import { type TuiCountryIsoCode, type TuiLanguageName } from "@taiga-ui/i18n/types";
import { TuiBadge } from "@taiga-ui/kit/components/badge";
import { TuiBadgedContent } from "@taiga-ui/kit/components/badged-content";
import { TuiButtonSelect } from "@taiga-ui/kit/directives/button-select";
import { TuiFlagPipe, TuiTextfieldDropdownDirective } from "@taiga-ui/core";
import { TuiLanguageSwitcherService } from "@taiga-ui/i18n";
import { TUI_DOC_ICONS } from "@taiga-ui/addon-doc/tokens";
import { APP_LANGUAGE_SETTER } from "@life-os/domain-items";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: "lifeos-language-switcher",
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    TuiBadge,
    TuiBadgedContent,
    TuiButton,
    TuiButtonSelect,
    TuiDataList,
    TuiFlagPipe,
    TuiTextfieldDropdownDirective,
    TranslocoPipe,
  ],
  templateUrl: "./language-switcher.component.html",
  styleUrl: "./language-switcher.component.scss",
  providers: [tuiScrollbarOptionsProvider({ mode: "hover" })],
  standalone: true,
})
export class LanguageSwitcherComponent {
  protected readonly icons = inject(TUI_DOC_ICONS);
  protected readonly switcher = inject(TuiLanguageSwitcherService);
  protected readonly language = new FormControl(this.switcher.language);
  private readonly setAppLanguage = inject(APP_LANGUAGE_SETTER);

  public readonly flags = new Map<TuiLanguageName, TuiCountryIsoCode>([
    ["english", "GB"],
    ["russian", "RU"],
  ]);

  public readonly names: TuiLanguageName[] = Array.from(this.flags.keys());

  public setLang(lang: TuiLanguageName): void {
    this.language.setValue(lang);
    this.switcher.setLanguage(lang);
    this.setAppLanguage(lang);
  }
}
