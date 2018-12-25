import React, { Component } from 'react';
import {
  Route,
  Link,
  Switch } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert } from 'reactstrap';
import {
  GEN_IDS,
  GEN_ID_TO_GEN,
  GEN_ID_TO_GEN_NAME, 
  SUBJECT_ID_TO_NAME } from '../constants/probGenerators';
import { SubjectsPage } from './subjects';
import { NotFound } from './notfound';
import { TestProgressBar } from './testProgressBar';
  
class Problem extends Component {
  constructor(props) {
    super(props);
    this.state = {answerText: '', qNo: props.qNo};

    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(event) {
    event.preventDefault();
    this.props.onClick(this.state.answerText);
  }

  render() {
    return (
      <div className="problem-container">
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Q{this.props.qNo}. {this.props.questionText}</Label>
            <Input
              id="answerInput"
              type={this.props.type}
              value={this.state.answerText}
              onChange={this.handleAnswerChange}
            />
          </FormGroup>
          <Button color="primary" type="submit">
            Check
          </Button>
        </Form>
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
    this.probGen = GEN_ID_TO_GEN[this.props.sub_id][this.props.gen_id];
    this.state = this.getStartingState();
  }

  handleAnswer(userAnswer) {
    // Don't allow empty answer
    if (!userAnswer) {
      this.setState({error: <Alert color="danger">Enter an answer first.</Alert>});
      return;
    }
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
    this.setState({error: <Alert color="danger">Wrong answer. Try again</Alert>});
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
      <div>
        <h1>{GEN_ID_TO_GEN_NAME[this.props.sub_id][this.props.gen_id]} practice</h1>
        <Problem 
          qNo={this.state.qNo}
          questionText={this.state.questionText}
          onClick={(ans) => this.handleAnswer(ans)}
          type={this.state.type}
        /><br />
        <div>{this.state.error}</div>
        <TestProgressBar currentQNo={this.state.qNo} totalQNo={this.totalQuestions} />
      </div>
    );
  }
}

class TestConfig extends Component {
  constructor(props) {
    super(props);

    this.qLimit = 10;
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
      errors: [],
    }

    this.handleTotQuestionsChange = this.handleTotQuestionsChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.startTest = this.startTest.bind(this);
  }

  componentDidMount() {
    //End test when moving in history
    this.unlisten = this.props.history.listen((location, action) => {
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

  isValidForm() {
    let errors = [];
    let totQ = this.state.totalQuestions;
    // Check for missing questions number
    if (!totQ) {
      errors.push(
        <Alert key="noTotQ" color="danger">
          Number of questions cannot be empty.
        </Alert>
      );
    }
    // Check number of questions is in range
    else if ((totQ > this.qLimit) || (totQ < 1)) {
      errors.push(
        <Alert key="wrongTotQRange" color="danger">
          The number of questions should be between 1 and {this.qLimit}.
        </Alert>
      );
    }

    // Also clears errors if there are none
    this.setState({errors: errors});
    if (errors.length > 0) {
      return false;
    }
    return true;
  }

  startTest(event) {
    event.preventDefault();
    if (this.isValidForm()) {
      const problemUrl = `/test/${this.state.sub_id}/${this.state.gen_id}`;
      this.props.history.push(problemUrl);
      this.setState({
        testStarted: true,
      });
    }
  }

  render() {
    if (this.state.testStarted) {
      return (
        <Test totalQuestions={this.state.totalQuestions}
          sub_id={this.state.sub_id}
          gen_id={this.state.gen_id}
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
      <div>
        <h1>{SUBJECT_ID_TO_NAME[this.state.sub_id]} Practice</h1>
        <Form onSubmit={this.startTest}>
          <FormGroup>
            <Label for="totalQuestionsSelect">
              Enter number of questions (Max. {this.qLimit})
            </Label>
            <Input
              type="number"
              name="totalQuestions"
              min="1"
              max="10"
              value={this.state.totalQuestions}
              onChange={this.handleTotQuestionsChange}
              id="totalQuestionsSelect"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="questionsTypeSelect">Select Problems type</Label>
            <Input
              type="select"
              name="questionsTypeSelect"
              id="questionsTypeSelect"
              value={this.state.gen_id}
              onChange={this.handleTypeChange}
            >
              {genOptions}
            </Input>
          </FormGroup>
          {this.state.errors}
          <Button color="primary" type="submit">Start</Button>
        </Form>
      </div>
    );
  }
}

export class TestContainer extends Component {
  render() {
    let subjectsRoutes = [];
    for (let sub_id in SUBJECT_ID_TO_NAME) {
      if (GEN_IDS[sub_id]) { //Add route only if problems for subject exist
        subjectsRoutes.push(
          <Route
            path={`${this.props.match.path}/${sub_id}/:gen_id?`}
            render={props => <TestConfig sub_id={sub_id} {...props}/>}
            key={sub_id}
          />
        );
      }
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