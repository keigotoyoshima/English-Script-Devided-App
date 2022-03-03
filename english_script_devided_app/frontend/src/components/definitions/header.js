import { TextField } from "@material-ui/core";
import React, { useCallback } from "react";
import "../../../static/css/header.css";
import MenuItem from "@material-ui/core/MenuItem";
import languages from "../data/language";
// import language from "../data/language"
import { debounce } from "lodash";
import CssTextField from "../theme/MuiThemeTextField";

const Header = ({
  setWord,
  language,
  setLanguage,
  word,
  setMeanings,
}) => {

  const handleChange = (e) => {
    setLanguage(e.target.value);
    console.log(e.target.value, "e.target.value in handleChange")
    setWord("");
    setMeanings([]);
  };

  const deb = useCallback(
    debounce((text) => setWord(text), 1000),
    []
  );

  const handleText = (text) => {
    deb(text);
  };

  return (
    <div className="header">
      <div className="inputs">
        <CssTextField
          className="search"
          id="filled-basic"
          // value={word}
          label="Search"
          onChange={(e) => handleText(e.target.value)}
        />
        {/* <CssTextField
          select
          label="Language"
          value={language}
          onChange={(e) => handleChange(e)}
          className="select"
        >
          {languages.map((option) => (
            <MenuItem key={option.label} value={option.label}>
              {option.value}
            </MenuItem>
          ))}
        </CssTextField> */}

      </div>
    </div>
  );
};

export default Header;