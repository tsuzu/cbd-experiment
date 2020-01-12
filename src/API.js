import firebase from "firebase";

/* eslint-disable */
class API {
  problems_num = 10;

  constructor() {
    console.log("initialzing API")
    const firebaseConfig = {
      apiKey: "AIzaSyCD419zYBZJyH5NaTl4xPDejB3Ho4ovzYY",
      authDomain: "cbd-experiment.firebaseapp.com",
      databaseURL: "https://cbd-experiment.firebaseio.com",
      projectId: "cbd-experiment",
      storageBucket: "cbd-experiment.appspot.com",
      messagingSenderId: "395768182981",
      appId: "1:395768182981:web:05de52a362c72c1ec2d8ac",
      measurementId: "G-HJ54Y6D5NC"
    };

    let app = firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth(app);
    this.store = firebase.firestore(app);
  }

  async signin() {
    await this.auth.signInAnonymously();
  }

  async get_problems() {
    if (this.problems != undefined) {
      return this.problems;
    }

    this.problems = (await this.store.collection('dataset').doc('problems').get()).data().problems;

    return this.problems;
  }

  async get_counter() {
    (await this.store.collection('dataset').doc('counter').update("counter", firebase.firestore.FieldValue.increment(1)));
    this.counter = (await this.store.collection('dataset').doc('counter').get()).data().counter;

    return this.counter;
  }

  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }

    return array;
  }

  async get_random_problems(counter) {
    const problems = this.shuffle(await this.get_problems());

    const selected_problems = [];
    for (let i = 0; i < counter; ++i) {
      selected_problems.push(problems[i]);
    }

    return selected_problems;
  }

  async get_selected_problems() {
    if (this.selected_problems != undefined) {
      return this.selected_problems;
    }

    this.selected_problems = this.get_random_problems(this.problems_num);

    return this.selected_problems;
  }

  reset_selected() {
    this.selected_problems = undefined;
  }

  async get_options(ans, counter) {
    let prob = [];
    prob.push(this.shuffle((await this.get_selected_problems()).filter(x => x.answer != ans))[0].answer);

    const random = (await this.get_random_problems(counter + 1))
      .filter(v => {
        return v.answer != prob[0] && v.answer != ans;
      })
      .slice(0, counter - 1)
      .map(v => v.answer);

    prob = this.shuffle(prob.concat(random)).slice(0, counter - 1);
    prob.push(ans);

    return this.shuffle(prob);
  }

  async set_problems(problems) {
    await this.store.collection('dataset').doc('problems').set(problems)
  }

  set_counter(counter) {
    this.counter = counter;
  }

  async update_study_result(method, result) {
    await this.store.collection('result').doc(this.auth.currentUser.uid + "-" + this.counter).set({
      method: method,
      study_result: JSON.stringify(result),
    }, { merge: true });
  }

  async update_result(result, score) {
    await this.store.collection('result').doc(this.auth.currentUser.uid + "-" + this.counter).set({
      test_result: JSON.stringify(result),
      score: score,
    }, { merge: true });
  }

  async update_problems(problems) {
    await this.store.collection('result').doc(this.auth.currentUser.uid + "-" + this.counter).set({
      problems: JSON.stringify(problems),
    }, { merge: true });
  }
}

let api = new API()

export default api;