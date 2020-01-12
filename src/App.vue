<template>
  <v-app>
    <v-app-bar color="blue darken-4" overflow app clipped-left fixed extended :extension-height="4">
      <v-toolbar-title class="white--text" @click="top">CBD Flashcard</v-toolbar-title>
      <v-progress-linear
        slot="extension"
        v-model="progress"
        class="ma-0"
        color="red accent-1"
        :height="4"
        style="padding: 0px"
      ></v-progress-linear>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import router from "./router";

export default Vue.extend({
  name: "App",
  data() {
    return {
      //
    };
  },
  computed: {
    progress() {
      return 0;
    }
  },
  methods: {
    top: async () => {
      router.push("/");
    }
  }
});
</script>

<style>
.v-toolbar__extension {
  padding: 0px !important;
}
</style>
