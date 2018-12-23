import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECT_ID_TO_NAME } from '../constants/probGenerators';
import chemistry_icon from '../images/chemistry_icon.svg';
import maths_icon from '../images/maths_icon.svg';
import physics_icon from '../images/physics_icon.svg';
import '../css/subjects.css';

const SUB_ID_TO_ICON = {
  'maths': maths_icon,
  'chemistry': chemistry_icon,
  'physics': physics_icon,
}

class SubjectIcon extends Component {
  render() {
    return (
      <img
        className={`subject-icon w-25 w-sm-auto align-self-center ${this.props.sub_id}`}
        src={SUB_ID_TO_ICON[this.props.sub_id]}
        alt={`${SUBJECT_ID_TO_NAME[this.props.sub_id]} icon`}
      />
    );
  }
}

class SubjectCard extends Component {
  render() {
    return (
      <Link
        key={this.props.sub_id}
        to={`test/${this.props.sub_id}`}
      >
        <div className={`subject-card d-flex flex-column flex-sm-row ${this.props.sub_id}`}>
          <div className="subject-name w-100 align-self-center">
            {SUBJECT_ID_TO_NAME[this.props.sub_id]}
          </div>
          <SubjectIcon sub_id={this.props.sub_id} />
        </div>
      </Link>
    );
  }
}

export class SubjectsPage extends Component {
  
  render() {
    let subjectDivs = [];
    for (let subjectId in SUBJECT_ID_TO_NAME) {
      subjectDivs.push(<SubjectCard sub_id={subjectId} key={subjectId} />);
    }
    return (
      <div className="subjects-list">
        {subjectDivs}
      </div>
    );
  }
}