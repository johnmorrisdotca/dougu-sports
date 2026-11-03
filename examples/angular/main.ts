import "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { DouguEmblemComponent } from "./dougu-emblem.component";

void bootstrapApplication(DouguEmblemComponent, { providers: [provideZonelessChangeDetection()] });
