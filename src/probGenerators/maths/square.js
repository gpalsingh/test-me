export default class Square {
  static checkAnswer(userAnswer, answer) {
    return ((userAnswer - answer) === 0);
  }

  static createQuestion(ops) {
    let number = 1;
    while (number <= 1) number = Math.ceil(Math.random() * 10);
    return [`What is the square of ${number}`, number * number, 'number'];
  }
}