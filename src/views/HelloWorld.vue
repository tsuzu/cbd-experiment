<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="display-2 mb-3">CBD実験用単語帳アプリ</h1>
      </v-col>
    </v-row>
    <v-row v-for="stat in statements" :key="stat">
      <v-col>
        <div class="title">{{stat}}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn small color="primary" @click="start">Start</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import API from "@/API";

export default {
  name: "HelloWorld",

  data: () => ({
    statements: [
      "大学の講義において「オンライン学習ツールの手法と記憶効率の関係」について調査しています。そのための実験に参加いただければ幸いです。所要時間は5分程度です。",
      "下のStartボタンを押すと2分間の勉強時間がスタートします。記憶する内容はロシア語の基本単語、10個です。単語が書かれているため、その意味を覚えてください。3分間の間は繰り返し学習することができます。学習スタイルはフラッシュカード(自己申告式)、True-False、四択のいずれかです。(自動選択されます)",
      "2分経過後、テストがあります。テストは学習方法に関わらず四択です。よろしくお願いいたします。",
      "複数回参加していただいてももちろん大丈夫ですが大変ですので暇でしょうがない場合のみで大丈夫です。"
    ]
  }),

  methods: {
    async start() {
      const counter = await API.get_counter();

      /* eslint-disable */

      console.log(counter);

      this.$router.push(["/four", "/tf", "/flashcard"][counter % 3]);
    }
  }
};
</script>
