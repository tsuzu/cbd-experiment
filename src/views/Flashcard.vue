<template>
  <v-container fill-height style="align-items: initial;">
    <v-row align="start" no-gutters>
      <v-col cols="12">
        <v-row align="start">
          <v-col cols="12">
            <h1 class="display-2">問題(残り時間: {{format_time}})</h1>
          </v-col>
          <v-col cols="12">
            <div class="title text">{{statement}}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row align="end">
      <v-col v-if="answering" cols="12">
        <v-row @click="click()">
          <v-col>
            <v-btn block>正解を見る</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else-if="!answering">
        <v-row>
          <v-col cols="12">正解は「{{ans}}」です。次に進むにはいずれかのボタンを押してください。</v-col>
          <v-col cols="12">
            <v-btn @click="next_problem(true)">正解だった</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="next_problem(false)">不正解だった</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
/* eslint-disable no-console */
import API from "@/API";
import Const from "@/const";

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

      result: [],

      min: Const.min,
      sec: Const.sec,
      timerOn: false,
      timerObj: null
    };
  },
  async mounted() {
    await API.get_problems();

    this.result = [];
    API.reset_selected();

    this.problems = await API.get_selected_problems();
    this.update_problem();

    this.start();
  },
  beforeDestroy() {},
  methods: {
    reset_remaining() {
      this.remaining = API.shuffle(
        this.problems.map(x => Object.assign({}, x))
      );
    },
    async update_problem() {
      if (this.remaining.length == 0) {
        this.reset_remaining();
      }

      const prob = this.remaining[this.remaining.length - 1];
      this.remaining.pop();

      this.statement = prob.problem + "の意味は?";
      this.problem = prob.problem;
      this.ans = prob.answer;
      this.options.push(prob.answer);

      API.shuffle(this.options);
    },

    count: function() {
      if (this.sec <= 0 && this.min >= 1) {
        this.min--;
        this.sec = 59;
      } else if (this.sec <= 0 && this.min <= 0) {
        this.complete();
      } else {
        this.sec--;
      }
    },

    start: function() {
      let self = this;
      this.timerObj = setInterval(function() {
        self.count();
      }, 1000);
      this.timerOn = true; //timerがOFFであることを状態として保持
    },

    stop: function() {
      clearInterval(this.timerObj);
      this.timerOn = false; //timerがOFFであることを状態として保持
    },

    complete: async function() {
      clearInterval(this.timerObj);
      await API.update_study_result("flashcard", this.result);
      await API.update_problems(await API.get_selected_problems());
      this.$router.push("/test");
    },

    click(index) {
      this.selected = this.options[index];
      // this.update_problem();
      this.answering = false;
    },
    next_problem(tf) {
      this.result.push({
        problem: this.statement,
        ans: this.ans,
        selected: tf ? this.ans : "",
        options: this.options
      });

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
