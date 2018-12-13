import React, { Component } from 'react';                                                                                                                                                     
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch } from 'react-router-dom';
import { Button } from 'reactstrap';
import { createBrowserHistory } from 'history';
import {
  GEN_IDS,
  GEN_ID_TO_GEN,
  GEN_ID_TO_GEN_NAME, 
  SUBJECT_ID_TO_NAME } from './constants/probGenerators';
import { Navigation } from './components/navbar';
import { About } from './components/about';
import { SubjectsPage } from './components/subjects';
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

    const sub_id = props.sub_id;
    const testStarted = props.testStarted || false;
    const totalQuestions = props.totalQuestions || 3;
    // Validate problem generator
    let gen_id = props.match.params.gen_id;
    const probGen = GEN_ID_TO_GEN[sub_id][gen_id];
    if (!probGen) gen_id = GEN_IDS[sub_id][0];

    this.state = {
      sub_id: sub_id,
      testStarted: testStarted,
      totalQuestions: totalQuestions,
      gen_id: gen_id,
    }

    this.handleTotQuestionsChange = this.handleTotQuestionsChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.startTest = this.startTest.bind(this);
  }

  componentDidMount() {
    //Listen to history changes to render accordingly
    this.unlisten = history.listen((location, action) => {
      this.setState({testStarted: false});
    });
  }

  componentWillUnmount() {
    this.unlisten();
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
    });
  }

  render() {
    if (this.state.testStarted) {
      return (
        <Test totalQuestions={this.state.totalQuestions}
          probGen = {GEN_ID_TO_GEN[this.state.sub_id][this.state.gen_id]}
        />
      );
    }

    let genOptions = [];
    for (let gen_id of GEN_IDS[this.state.sub_id]) {
      genOptions.push(
        <option key={gen_id} value={gen_id}>
          {GEN_ID_TO_GEN_NAME[this.state.sub_id][gen_id]}
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
        <Link
          to={`/test/${this.state.sub_id}/${this.state.gen_id}`}
        >
          <Button color="primary" onClick={this.startTest}>Start</Button>
        </Link>
      </div>
    );
  }
}

class TestContainer extends Component {
  render() {
    let subjectsRoutes = [];
    for (let sub_id in SUBJECT_ID_TO_NAME) {
      subjectsRoutes.push(
        <Route
          path={`${this.props.match.path}/${sub_id}/:gen_id?`}
          render={props => <TestConfig sub_id={sub_id} {...props}/>}
          key={sub_id}
        />
      );
    }
    return (
      <div className="content">
        <Switch>
          <Route exact path={this.props.match.path}>
            <SubjectsPage />
          </Route>
          {subjectsRoutes}
          <Route component={NotFound} />
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

const history = createBrowserHistory();
export default App;
