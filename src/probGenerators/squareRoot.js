export default class SquareRoot {
  static checkAnswer(userAnswer, answer) {
    return ((userAnswer - answer) === 0);
  }

  static createQuestion(ops) {
    const number = Math.ceil(Math.random() * 10);
    return [`What is the square root of ${number * number}`, number, 'number'];
  }
}