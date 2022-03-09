import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import App from "../App";
import { Container } from "@material-ui/core";
import { NavDropdown } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { useUserContext } from "../userContext/userContext";

const AppNavBar = () => {
  const { logoutUser, user } = useUserContext();

  const onClickHandler = () => {
    console.log(onClickHandler);
    logoutUser();
  }

  return (
    <Navbar bg="dark" variant="dark">

      <Container width="100%">
        <Row>
          <Col><Navbar.Brand href="#home">Youtube for English Learning</Navbar.Brand></Col>
          <Col md="auto">
            <Navbar.Collapse>
              <Navbar.Text>
                Signed in as: {user.displayName}
              </Navbar.Text>
            </Navbar.Collapse>
          </Col>
          <Col xs lg="1">
            <Container width="100%">
              <NavDropdown className="justfy-content-end" title="Logout" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={onClickHandler}>Logout</NavDropdown.Item>
                <NavDropdown.Item>Cancel</NavDropdown.Item>
              </NavDropdown>
            </Container>
          </Col>
        </Row>
      </Container> 


    </Navbar>
  );
}
export default AppNavBar;