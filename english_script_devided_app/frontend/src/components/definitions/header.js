
import React, { useCallback } from "react";
import "../../../static/css/header.css";
import MenuItem from "@material-ui/core/MenuItem";
import languages from "../data/language";
// import language from "../data/language"
import { debounce } from "lodash";
import CssTextField from "../theme/MuiThemeTextField";

const Header = ({
  setWord,
  setWordWithCalling,
  headerError,
}) => {

  const deb = useCallback(
    debounce((text) => setWordWithCalling(text), 1000),
    []
  );

  const handleText = (text) => {
    deb(text);
    console.log(text);
  };
  
  const onSubmit = () => {
    console.log("onSubmit in Header.js")
  }

  return (
    <div className="header">
      <div className="inputs">
        <CssTextField
          error={headerError}
          helperText={headerError ? "Incorrect word, please search correct word." : ""}
          className="search"
          id="outlined-basic"
          label={headerError ? "" : "Search"}
          onChange={(e) => handleText(e.target.value)}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default Header;