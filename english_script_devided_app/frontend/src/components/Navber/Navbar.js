import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import App from "../App";
import { Container } from "@material-ui/core";
import { NavDropdown } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { useUserContext } from "../userContext/userContext";

const AppNavBar = () => {
  const { logoutUser, user, displayName } = useUserContext();

  const onClickHandler = () => {
    console.log(onClickHandler);
    logoutUser();
  }

  return (
    <Navbar bg="dark" variant="dark" style={{ display: "block" }}>
      <Row>
        <Col xs={6} >
          <Navbar.Brand href="#home" style={{ marginLeft: "2rem", display: "block" }}>Youtube Language</Navbar.Brand>
        </Col>
        <Col xs={6}>
          <Row>
            <Col xs={10}>
              <Navbar.Text style={{ display: "block", textAlign: "end", }}>
                Signed in as: {displayName}
              </Navbar.Text>
            </Col>
            <Col xs={2} style={{ textAlign: "start" }}>
              <NavDropdown title="Logout" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={onClickHandler}>Logout</NavDropdown.Item>
                <NavDropdown.Item>Cancel</NavDropdown.Item>
              </NavDropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </Navbar>
  );
}
export default AppNavBar;
