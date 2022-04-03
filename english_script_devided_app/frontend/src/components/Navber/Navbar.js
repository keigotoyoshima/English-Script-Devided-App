import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { useUserContext } from "../userContext/userContext";
import { IP_AND_PORT } from "../frontend_api/DjangoApi";

const AppNavBar = () => {
  const { logoutUser, user, displayName } = useUserContext();


  const onClickForManagePage = () => {
    window.location.href = `${IP_AND_PORT}mypage`;
  }

  const onClickForLogout = () => {
    logoutUser();
  }

  return (
    <Navbar bg="dark" variant="dark" style={{ display: "block" }}>
      <Row>
        <Col xs={6} >
          <Navbar.Brand href="#home" style={{ marginLeft: "2rem", display: "block" }}>Youtube Language</Navbar.Brand>
        </Col>
        <Col xs={6}>
          <Row style={{height:"100%"}}>
            <Col xs={10} style={{ justifyContent: "end", alignItems: "center", display:"flex"}}>
              <Navbar.Text style={{fontSize:"larger", paddingTop:"0.6rem  "}}>
                Signed in as: {displayName}
              </Navbar.Text>
            </Col>
            <Col xs={2} style={{ justifyContent: "end", alignItems:"center",  display: "flex" }}>
              <NavDropdown title="Options" id="basic-nav-dropdown" style={{ fontSize: "larger" }}>
                <NavDropdown.Item onClick={onClickForManagePage}>Manage Page</NavDropdown.Item>
                <NavDropdown.Item onClick={onClickForLogout}>Logout</NavDropdown.Item>
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
