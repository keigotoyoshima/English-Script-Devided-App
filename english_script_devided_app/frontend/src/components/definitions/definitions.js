import React from "react";
import "../../../static/css/definitions.css";
import { Container } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { Button } from "@material-ui/core";
import { TextField } from "@mui/material";

const Definitions = (props) =>{

  const onClick = () => {
    props.saveWordAndTime()
  }


    return (
      <div className="meanings-zone">

        {props.meaning_list[0] && props.word && (
          <Container>
            <Row>
              <Col>
                <Row>
                  <span style={{ color: "#FAFAFA", fontWeight: "100"}}>Pronunciation: {props.meaning_list[0].phonetics[0] ? props.meaning_list[0].phonetics[0].text: ""}</span>
                </Row>
                <Row>
                  <audio
                    className="padding-left-release"
                    style={{ color: "#313131", borderRadius: 10 }}
                    src={props.meaning_list[0].phonetics[0] && props.meaning_list[0].phonetics[0].audio}
                    controls
                  >
                    Your browser does not support the audio element.
                  </audio>
                </Row>
              </Col>
              <Col>

                  <Row>
                    <Col>
                    <TextField sx={{
                      width: "100%",
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "#888888"
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "#FAFAFA"
                      }
                    }} label={props.addError ? "Not found" : "Time"} value={props.startText}
                      size='small' onChange={e => updateInputValue(e)} error={props.addError} variant="standard" inputProps={{ style: { fontSize: 15, color: "#FAFAFA", textAlign:"center " } }} InputLabelProps={{ style: { fontSize: 15, color: "#888888", padding: "0", margin: "0", height: "100%", lineHeight: "1" } }} />
                    </Col>
                    <Col>
                      <Container style={{ display: "flex", justifyContent: 'end', alignItems: 'end', 
                        height: "100%", width: "100%", margin: 0, padding: 0 }}>
                      <Button style={{ width: "100%", height: 25, backgroundColor: "#313131", color: "#FAFAFA"}} className="react-button" variant="outlined" margin="normal" onClick={onClick} >
                          Add
                        </Button>
                      </Container>

                    </Col>
                  </Row>


              </Col>
            </Row>
          </Container>
        )}


        <div className="meanings">
          {props.word === "" ? (
            <span className="no-meanings"></span>
          ) : (
            props.meaning_list.map((mean) =>
              mean.meanings.map((item) =>
                item.definitions.map((def, index) => (
                  <div
                    key={`section-definition-${index}`}
                    className="singleMean"
                    style={{
                      color: "#FAFAFA",
                      fontWeight: "100",
                    }}
                  >
                    <b>Definition : {def.definition}</b>

                    {/* 例文があったら */}
                    {def.example && (
                      <span>
                        <b>Example :</b> {def.example}
                      </span>
                    )}
                    {/* 類語があったら */}
                    {def.synonyms[0] && (
                      <span>
                        <b>Synonyms :</b> {def.synonyms.map((s) => `${s}, `)}
                      </span>
                    )}
                    <hr style={{ backgroundColor: "white", width: "100%" }} />
                  </div>
                ))
              )
            )
          )}
        </div>
      </div>
    );
  }



export default Definitions;