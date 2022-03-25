import React, { useState } from "react";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { Container } from "react-bootstrap";
import { useUserContext } from "./userContext";

const Auth = () => {
  // const [index, setIndex] = useState(false);
  const { index, setIndex } = useUserContext();
  const toggleIndex = () => {
    setIndex((prevState) => !prevState);
  };
  return (

      <Container>
      {!index ? <SignInPage text="New user? Click here " toggleIndex={toggleIndex} /> : <SignUpPage text="Already have an acount? Click here" toggleIndex={toggleIndex}/>}
      </Container>


  );
};

export default Auth;