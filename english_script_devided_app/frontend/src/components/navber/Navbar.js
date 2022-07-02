import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { useUserContext } from "../userContext/userContext";
import { IP_AND_PORT } from "../frontend_api/DjangoApi";
import { TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import { BiMenu } from "react-icons/bi";
import {Button as ButtonCore} from '@material-ui/core';

const AppNavBar = ({
  labelURL,
  setInputURL,
  inputURL,
  onSubmit,
  toggleRightSideOpen,
}) => {
  const { signOutUser, waitingInAuthRoom, user, displayName } = useUserContext();


  const onClickForManagePage = () => {
    window.location.href = `${IP_AND_PORT}mypage`;
  }

  const onClickForSignin = () => {
    // displayNameをPreregisteredに変更
    waitingInAuthRoom();
  }

  const onClickForSignout = () => {
    signOutUser();
  }

  // URLinput
  const updateInputValue = (evt) => {
    const val = evt.target.value;
    setInputURL(val)
  }

  return (
    <Navbar style={{ display: "block", backgroundColor: "#202020", height:"6%"}}>
      <Row>
        <Col xs={2} >
          <Navbar.Brand href="#home" style={{ fontSize: "1.2vw", height: "80%", marginLeft: "2rem", padding: "0.3rem", display: "flex", alignItems: "center",  color: "#FAFAFA", borderRadius: "10px", backgroundColor: "#0F80D7",  
          position: "absolute", top:"50%", transform:"translate(0, -50%)" }}>Youtube Language</Navbar.Brand>
        </Col>
        <Col xs={7} >
          <form onSubmit={onSubmit}>
            <Row style={{ height: "100%" }}>
              <Col xs={10} style={{ paddingRight: "0" }}>
                <TextField sx={{
                  height: "90%",
                  width: "100%",
                  top: "-5px",
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#888888"
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#FAFAFA"
                  }
                }} label={labelURL} error={labelURL != "URL"} value={inputURL} onChange={e => updateInputValue(e)} variant="standard" inputProps={{ style: { fontSize: 15, color: "#FAFAFA" } }} InputLabelProps={{ style: { fontSize: 15, color: "#888888", padding: "0", margin: "0", height: "100%", lineHeight: "1" } }} />
              </Col>
              <Col xs={2} style={{ paddingLeft: "0" }}>
                <Button style={{ width: "5rem", display: "block", position: "absolute", top: "3px", backgroundColor: "#313131", color: "#FAFAFA" }} className="react-button" variant="outlined" type="submit" margin="normal">
                  SET
                </Button>
              </Col>
            </Row>
          </form>
          
          
         
        </Col>
        <Col xs={3}>
          <Row style={{height:"100%"}}>
            <Col xs={8} style={{ justifyContent: "center", alignItems: "center", display:"flex"}}>
              <Navbar.Text style={{ fontSize: "medium", paddingTop: "0.6rem", color: "#888888"}}>
                Signed in as: {displayName}
              </Navbar.Text>
            </Col>
            <Col xs={2} style={{ justifyContent: "end", alignItems:"center",  display: "flex", paddingRight: "0" }}>
              <NavDropdown title="Options" id="basic-nav-dropdown" style={{ fontSize: "medium" }}>
                {/* <NavDropdown.Item onClick={onClickForManagePage}>Manage Page</NavDropdown.Item> */}
                {/* <NavDropdown.Item onClick={onClickForSignout}>Register</NavDropdown.Item> */}
                <NavDropdown.Item onClick={onClickForSignin}>SignIn</NavDropdown.Item>
                <NavDropdown.Item onClick={onClickForSignout}>Signout</NavDropdown.Item>
                <NavDropdown.Item>Cancel</NavDropdown.Item>
              </NavDropdown>
            </Col>
            <Col xs={2} style={{ justifyContent: "end", alignItems: "center", display: "flex" }}>
              <ButtonCore onClick={toggleRightSideOpen}><BiMenu style={{ color: "white", fontSize: "30px"}}/></ButtonCore>
            </Col>
          </Row>
        </Col>
      </Row>
    </Navbar>
  );
}
export default AppNavBar;
