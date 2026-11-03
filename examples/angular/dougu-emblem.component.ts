import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dougu-emblem",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<dougu-emblem [attr.emblem]="emblem" [attr.size]="size" turnable></dougu-emblem>`,
})
export class DouguEmblemComponent implements OnInit {
  @Input() emblem = "trophy:stanley-cup";
  @Input() size = 200;

  ngOnInit(): void {
    // The element needs a browser: ngOnInit also runs when a server renders, so the import waits for one.
    if (typeof window !== "undefined") void import("@johnmorrisdotca/dougu-sports/element");
  }
}
