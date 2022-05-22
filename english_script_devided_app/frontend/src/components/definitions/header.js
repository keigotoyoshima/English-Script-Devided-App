
import React, { useCallback } from "react";
import "../../../static/css/header.css";
import { TextField } from "@mui/material";

const Header = ({
  word,
  headerError,
}) => {

  return (
    <div className="header">
      <div className="inputs">
        <TextField sx={{
          width: "50%",
          "& .MuiInput-underline:before": {
            borderBottomColor: "#888888"
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#FAFAFA"
          }
        }} error={headerError} helperText={headerError ? "Incorrect word, please search correct word." : ""} className="search" label={headerError ? "" : "Click a word in transcript."} value={word != "" ? word : ""} variant="standard" inputProps={{ style: { fontSize: 15, color: "#FAFAFA"} }} InputLabelProps={{ style: { fontSize: 15, color: "#888888", padding: "0", margin: "0", height: "100%", width:"100%", textAlign:"center", lineHeight: "1" } }} />
      </div>
    </div>
  );
};

export default Header;