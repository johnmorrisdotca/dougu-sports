import { createApp } from "vue";
import EmblemCard from "./EmblemCard.vue";

const app = createApp(EmblemCard);
app.config.compilerOptions.isCustomElement = (tag) => tag === "dougu-emblem";
app.mount("#app");
