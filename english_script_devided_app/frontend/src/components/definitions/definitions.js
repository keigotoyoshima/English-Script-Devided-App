import React from "react";
import "../../../static/css/definitions.css";
import { Container } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { Button } from "@material-ui/core";
import CssTextField from "../theme/MuiThemeTextField";
import { Component } from "react";

export default class Definitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
    };
  }

  updateInputValue = (evt) => {
    console.log(evt.target.value);
    this.state.time = evt.target.value;
  }

  onClick = () => {
    console.log('onClick');
    // this.props.setTime(this.state.time);
    this.props.addWordAndTime(this.state.time)
  }

  render() {
    return (
      <div className="meanings-zone">

        {this.props.meanings[0] && this.props.word && (
          <Container>
            <Row>
              <Col>
                <Row>
                  <span>Pronunciation: {this.props.meanings[0].phonetics[0].text}</span>
                </Row>
                <Row>
                  <audio
                    className="padding-left-release"
                    style={{ backgroundColor: "#fff", borderRadius: 10 }}
                    src={this.props.meanings[0].phonetics[0] && this.props.meanings[0].phonetics[0].audio}
                    controls
                  >
                    Your browser does not support the audio element.
                  </audio>
                </Row>
              </Col>
              <Col>

                  <Row>
                    <Col>
                    <CssTextField style={{ margin: "auto 0" }} id="outlined-basic" style={{ width: "100%" }} label={this.props.addError ? "Not found" : "Time"} size='small' onChange={e => this.updateInputValue(e)} error={this.props.addError}
                   />
                    </Col>
                    <Col>
                      <Container style={{ display: "flex", justifyContent: 'end', alignItems: 'end', 
                        height: "100%", width: "100%", margin: 0, padding: 0 }}>
                        <Button style={{ width: "100%", height: 25}} className="react-button" variant="outlined" margin="normal" onClick={this.onClick} >
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
          {this.props.word === "" ? (
            <span className="no-meanings"></span>
          ) : (
            this.props.meanings.map((mean) =>
              mean.meanings.map((item) =>
                item.definitions.map((def, index) => (
                  <div
                    key={`section-definition-${index}`}
                    className="singleMean"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    <b>Definitin : {def.definition}</b>

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
                    <hr style={{ backgroundColor: "black", width: "100%" }} />
                  </div>
                ))
              )
            )
          )}
        </div>
      </div>
    );
  }
}


