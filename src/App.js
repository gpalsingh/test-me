import React, { Component } from 'react';                                                                                                                                                     
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch } from 'react-router-dom';
import { GENERATOR_IDS, GEN_ID_TO_GENERATOR, GEN_ID_TO_NAME } from './constants/probGenerators';
import { Navigation } from './components/navbar';
import { About } from './components/about';
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

class TestConfig extends Component {
  constructor(props) {
    super(props);

    // Check that problem generator is supported
    let gen_id = props.match.params.gen_id;
    const probGen = GEN_ID_TO_GENERATOR[gen_id];
    // Set default generator if probGen is invalid
    // Possibly show a message saying invalid gen
    if (!probGen) gen_id = GENERATOR_IDS[0];

    this.state = {
      testStarted: false,
      totalQuestions: 3,
      gen_id: gen_id,
    }

    this.handleTotQuestionsChange = this.handleTotQuestionsChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.startTest = this.startTest.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let gen_id = this.state.gen_id;
    if (nextProps.match.params.gen_id) gen_id = nextProps.match.params.gen_id;
    this.setState({
      testStarted: false,
      gen_id: gen_id,
    });
  }

  handleTotQuestionsChange(event) {
    this.setState({
      totalQuestions: event.target.value,
    });
  }

  handleTypeChange(event) {
    this.setState({
      gen_id: event.target.value,
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
          probGen = {GEN_ID_TO_GENERATOR[this.state.gen_id]}
        />
      );
    }

    let genOptions = [];
    for (let option of GENERATOR_IDS) {
      genOptions.push(
        <option key={option} value={option}>
          {GEN_ID_TO_NAME[option]}
        </option>
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
        <select value={this.state.gen_id} onChange={this.handleTypeChange}>
          {genOptions}
        </select><br />
        <button onClick={this.startTest}>Start</button>
      </div>
    );
  }
}

class TestContainer extends Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route exact path={this.props.match.path}>
            <TestConfig {...this.props} />
          </Route>
          <Route
            path={`${this.props.match.path}/:gen_id`}
            component={TestConfig}
            {...this.props}
          />
        </Switch>
      </div>
    );
  }
}

class LandingPage extends Component {
  render() {
    return (
      <div>
        Test yourself endlessly with computer generated problems, for free!<br />
        <Link to="/test">Start practising</Link>
      </div>
    );
  }
}

class NotFound extends Component {
  render() {
    return (
      <div>
        Nothing but only chickens.
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Navigation />

          <div className="container ">
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/test" component={TestContainer} />
              <Route path="/about" component={About} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
