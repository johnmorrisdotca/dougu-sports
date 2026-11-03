import { useEffect } from "react";

export function DouguEmblem({ emblem = "trophy:stanley-cup", size = 200 }: { emblem?: string; size?: number }) {
  useEffect(() => {
    // The element needs a browser, so it is imported here, never at the top of the file: a server render never reaches an effect.
    void import("@johnmorrisdotca/dougu-sports/element");
  }, []);
  return <dougu-emblem emblem={emblem} size={size} turnable />;
}
