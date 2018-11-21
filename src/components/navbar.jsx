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
    return (
      <div>
        <Navbar color="light" expand="md">
          <NavbarBrand href="/">TestMe</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto">
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret> Boards </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>CBSE</DropdownItem>
                  <DropdownItem>Others</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret> Testing </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to="/test/square">Square</DropdownItem>
                  <DropdownItem tag={Link} to="/test/squareroot">Square Root</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}