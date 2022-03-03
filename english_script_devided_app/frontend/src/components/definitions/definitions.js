import React from "react";
import "../../../static/css/definitions.css";
import { Container } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { Button } from "@material-ui/core";

// LightTheme除去
const Definitions = ({ meanings, word, language }) => {
  return (
    <div className="meanings-zone">

      {meanings[0] && word && language === "en" && (
        <Container>
          <Row>
            <Col>
              <Row>
                <span>Pronunciation: {meanings[0].phonetics[0].text}</span>
              </Row>
              <Row>
                <audio
                  className="padding-left-release"
                  style={{ backgroundColor: "#fff", borderRadius: 10 }}
                  src={meanings[0].phonetics[0] && meanings[0].phonetics[0].audio}
                  controls
                >
                  Your browser does not support the audio element.
                </audio>
              </Row>
            </Col>
            <Col>
            <Button>追加</Button>
            </Col>
          </Row>
        </Container>
      )}


      <div className="meanings">
        {word === "" ? (
          <span className="no-meanings"></span>
        ) : (
          meanings.map((mean) =>
            mean.meanings.map((item) =>
              item.definitions.map((def) => (
                <div
                  className="singleMean"
                  style={{
                    backgroundColor:"white",
                    color:"black",
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
                      <b>Synonyms :</b> {def.synonyms.map((s) => `${  s}, `)}
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
};

export default Definitions;