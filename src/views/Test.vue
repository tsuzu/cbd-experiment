<template>
  <v-container fill-height style="align-items: initial;">
    <v-row align="start" no-gutters>
      <v-col cols="12">
        <v-row align="start">
          <v-col cols="12">
            <h1 class="display-2">テスト問題</h1>
          </v-col>
          <v-col cols="12">
            <div class="title text">{{statement}}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row align="end">
      <v-col v-if="answering" cols="12">
        <v-row v-for="(v, id) in options" :key="id" @click="click(id)">
          <v-col>
            <v-btn block>{{v}}</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else-if="!answering">
        <v-row>
          <v-col cols="12">
            <h1 class="display-1" v-if="is_correct">正解！</h1>
            <h1 class="display-1" v-else>不正解</h1>
          </v-col>
          <v-col cols="12">正解は「{{ans}}」です。</v-col>
          <v-col cols="12">
            <v-btn @click="next_problem">次の問題へ</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
/* eslint-disable no-console */
import API from "@/API";

export default {
  data() {
    API.get_problems();
    return {
      statement: "",
      problem: "",
      ans: "",
      options: [],
      problems: [],
      remaining: [],
      answering: true,
      selected: "",
      score: 0,

      result: []
    };
  },
  async mounted() {
    await API.get_problems();

    this.result = [];

    this.problems = await API.get_selected_problems();
    this.reset_remaining();
    this.update_problem();
    this.score = 0;
  },
  beforeDestroy() {
    API.update_result(this.result, this.score);
  },
  methods: {
    reset_remaining() {
      this.remaining = API.shuffle(
        this.problems.map(x => Object.assign({}, x))
      );
    },
    async update_problem() {
      if (this.remaining.length == 0) {
        this.$router.push("/thank_you");

        return;
      }

      const prob = this.remaining[this.remaining.length - 1];
      this.remaining.pop();

      this.statement = prob.problem + "の意味は?";
      this.problem = prob.problem;
      this.ans = prob.answer;
      this.options = await API.get_options(this.ans, 4);
      API.shuffle(this.options);
    },

    complete: function() {
      clearInterval(this.timerObj);
    },

    click(index) {
      this.selected = this.options[index];

      if (this.selected == this.ans) {
        ++this.score;
      }
      this.result.push({
        problem: this.statement,
        ans: this.ans,
        selected: this.options[index],
        options: this.options
      });

      // this.update_problem();
      this.answering = false;
    },
    next_problem() {
      this.update_problem();
      this.answering = true;
    }
  },
  computed: {
    format_time: function() {
      let timeStrings = [this.min.toString(), this.sec.toString()].map(function(
        str
      ) {
        if (str.length < 2) {
          return "0" + str;
        } else {
          return str;
        }
      });
      return timeStrings[0] + ":" + timeStrings[1];
    },
    is_correct() {
      return this.selected == this.ans;
    }
  }
};
</script>

<style>
.text {
  display: inline-block;
}
</style>
