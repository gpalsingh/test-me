import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECT_ID_TO_NAME } from '../constants/probGenerators';

export class SubjectsPage extends Component {
  
  render() {
    let subjectDivs = [];
    for (let subjectId in SUBJECT_ID_TO_NAME) {
      const url = 'test/' + subjectId;
      const text = SUBJECT_ID_TO_NAME[subjectId];
      subjectDivs.push(<Link key={subjectId} to={url}>{text}</Link>);
    }
    return (
      <div>
        Choose from the currently available subjects:<br/>
        {subjectDivs}
      </div>
    );
  }
}