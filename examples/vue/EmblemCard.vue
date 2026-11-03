<script setup lang="ts">
import { onMounted } from "vue";

withDefaults(defineProps<{ emblem?: string; size?: number }>(), { emblem: "trophy:stanley-cup", size: 200 });

// The element needs a browser: import it once the component is on the page, never while a server renders it.
onMounted(() => {
  void import("@johnmorrisdotca/dougu-sports/element");
});
</script>

<template>
  <dougu-emblem :emblem="emblem" :size="size" turnable></dougu-emblem>
</template>
