import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "dougu-emblem": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { emblem?: string; size?: number | string; variant?: string; turnable?: boolean; autoplay?: boolean };
    }
  }
}
