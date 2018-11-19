import React, { Component } from 'react';
import SquareRoot from './probGenerators/squareRoot';                                                                                                                                                                                         
import './App.css';

class Problem extends Component {
  constructor(props) {
    super(props);
    this.state = {answerText: '', qNo: props.qNo};

    this.handleAnswerChange = this.handleAnswerChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.qNo !== this.state.qNo) {
      //Reset answer text for new questions
      this.setState({answerText: '', qNo: nextProps.qNo});
    }
  }

  handleAnswerChange(event) {
    this.setState({answerText: event.target.value});
  }

  render() {
    return (
      <div className="problem-container">
        <div className="problem-text">Q.{this.props.qNo} {this.props.questionText}</div>
        <input className="answer-box"
          type={this.props.type}
          value={this.state.answerText}
          onChange={this.handleAnswerChange}
        /><br />
        <button onClick={(ans) => this.props.onClick(this.state.answerText)}>
          Check
        </button>
      </div>
    );
  }
}

class TestResults extends Component {
  render() {
    return (
      <div className="test-result">
        Test over!<br />
        <button onClick={() => this.props.onClick()}>Again</button>
      </div>
    );
  }
}

class Test extends Component {
  constructor(props) {
    super(props);

    this.totalQuestions = props.totalQuestions;
    this.probGen = props.probGen;
    this.state = this.getStartingState();
  }

  handleAnswer(userAnswer) {
    if (this.probGen.checkAnswer(userAnswer, this.state.answer)) {
      if (this.state.qNo >= this.totalQuestions) {
        this.setState({ended: true, error: ''});
        return;
      }
      const [question, answer, type] = this.probGen.createQuestion();
      this.setState({
        qNo: this.state.qNo + 1,
        questionText: question,
        type: type,
        answer: answer,
        error: '',
      })
      return;
    }
    this.setState({error: 'Wrong answer. Try again'});
  }

  resetTest() {
    this.setState(this.getStartingState());
  }

  getStartingState() {
    const [question, answer, type] = this.probGen.createQuestion();
    return({
      qNo: 1,
      questionText: question,
      type: type,
      answer: answer,
      error: '',
      ended: false,
    });
  }

  render() {
    if (this.state.ended) {
        return (
          <TestResults onClick={() => this.resetTest()}/>
        );
    }
    
    return (
      <div className="test-div">
        <Problem 
          qNo={this.state.qNo}
          questionText={this.state.questionText}
          onClick={(ans) => this.handleAnswer(ans)}
          type={this.state.type}
        /><br />
        <div>Question {this.state.qNo}/{this.totalQuestions}</div>
        <div>{this.state.error}</div>
      </div>
    );
  }
}

class TestOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testStarted: false,
      totalQuestions: 3,
      probGen: props.probGen,
    }

    this.handleTotQuestionsChange = this.handleTotQuestionsChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.startTest = this.startTest.bind(this);
  }

  handleTotQuestionsChange(event) {
    this.setState({
      totalQuestions: event.target.value,
    });
  }

  handleTypeChange(event) {
    this.setState({
      probGen: event.target.value,
    })
  }

  startTest(event) {
    this.setState({
      testStarted: true,
    })
  }

  render() {
    if (this.state.testStarted) {
      return (
        <Test totalQuestions={this.state.totalQuestions}
          probGen = {SquareRoot}
        />
      );
    }
    return (
      <div className="test-options">
        Number of questions:
        <input type="number" min="1" max="10"
          value={this.state.totalQuestions}
          onChange={this.handleTotQuestionsChange}
        /><br />
        Select type:
        <select value={this.state.probGen} onChange={this.handleTypeChange}>
          <option value="squareroot">Square Root</option>
        </select><br />
        <button onClick={this.startTest}>Start</button>
      </div>
    );
  }
}

class Content extends Component {
  render() {
    return (
      <div className="content">
        <TestOptions probGen={SquareRoot}/>
      </div>
    );
  }
}

class Navigation extends Component {
  render() {
    return (
      <div className="nav">
        <ul className="nav-list">
          <li>First option</li>
          <li>Second option</li> 
          <li>Third option</li>
        </ul>
      </div>
    );
  }
}

class Body extends Component {
  render() {
    return (
      <div className="app-body">
        <Navigation />
        <Content />
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div className="header">
        <span className="logo">TestMe</span>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Body />
      </div>
    );
  }
}

export default App;
