import React, { Component } from 'react';                                                                                                                                                 
import {
  BrowserRouter as Router,
  Route,
  Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Navigation } from './components/navbar';
import { About } from './components/about';
import { NotFound } from './components/notfound';
import { LandingPage } from './components/landingpage';
import { TestContainer } from './components/practice';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Navigation />

          <Container>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/test" component={TestContainer} />
              <Route path="/about" component={About} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
