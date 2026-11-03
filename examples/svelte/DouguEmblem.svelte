<script lang="ts">
  import { onMount } from "svelte";

  let { emblem = "trophy:stanley-cup", size = 200 }: { emblem?: string; size?: number } = $props();

  // The element needs a browser: onMount never runs on the server.
  onMount(() => {
    void import("@johnmorrisdotca/dougu-sports/element");
  });
</script>

<dougu-emblem {emblem} {size} turnable></dougu-emblem>
