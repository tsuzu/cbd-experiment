<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="display-2 mb-3">Thank you!</h1>
      </v-col>
    </v-row>
    <v-row v-for="stat in statements" :key="stat">
      <v-col>
        <div class="title">{{stat}}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn small color="primary" @click="start">トップへ</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    statements: ["ご参加いただきありがとうございました。"]
  }),

  methods: {
    async start() {
      this.$router.push("/");
    }
  }
};
</script>
