
import React, { useCallback } from "react";
import "../../../static/css/header.css";
import MenuItem from "@material-ui/core/MenuItem";
import languages from "../data/language";
// import language from "../data/language"
import { debounce } from "lodash";
import CssTextField from "../theme/MuiThemeTextField";

const Header = ({
  word,
  headerError,
}) => {

  return (
    <div className="header">
      <div className="inputs">
        <CssTextField
          error={headerError}
          helperText={headerError ? "Incorrect word, please search correct word." : ""}
          className="search"
          id="outlined-basic"
          label={headerError ? "" : "Word"}
          value={word != "" ? word : ""}
        />
      </div>
    </div>
  );
};

export default Header;