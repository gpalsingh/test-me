export default class Square {
  static checkAnswer(userAnswer, answer) {
    return ((userAnswer - answer) === 0);
  }

  static createQuestion(ops) {
    const number = 1;
     while (number >= 1) Math.ceil(Math.random() * 10);
    return [`What is the square root of ${number}`, number * number, 'number'];
  }
}