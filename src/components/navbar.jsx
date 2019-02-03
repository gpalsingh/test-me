import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { SUBJECT_ID_TO_NAME } from '../constants/probGenerators';

export class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    let subjects = [];
    for (let [sub_id, sub_name] of Object.entries(SUBJECT_ID_TO_NAME)) {
      let url = `/test/${sub_id}`;
      subjects.push(
        <DropdownItem
          tag={Link}
          to={url}
          key={sub_id}
        >
          {sub_name}
        </DropdownItem>
      );
    }
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">TestMe</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret> Subjects </DropdownToggle>
                <DropdownMenu>
                  {subjects}
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink tag={Link} to="/about">About</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}