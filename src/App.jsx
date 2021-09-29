import { useEffect, useState } from "react";
import "./App.css";
import data from "./data.json";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function App() {
  const d = [];
  const checkboxArray = [];

  const [object, setObject] = useState();

  //main accordion code
  const AccordionFather = ({ o }) => {
    return (
      <>
        {o?.map((obj, index) => {
          return (
            <div key={`checkbox-${obj.id}`}>
              <div
                id={`checkbox-${obj.id}`}
                className="option"
                onClick={() => {
                  var doc = document
                    .getElementById(`checkbox-${obj.id}`)
                    .getElementsByClassName("checkbox");
                  checkTrueFalse(doc["0"], obj, doc["0"].checked);
                  checkIndeterminate(obj, doc["0"].checked);
                }}
              >
                <input
                  className="checkbox"
                  type="checkbox"
                  onChange={() => {
                    var doc = document
                      .getElementById(`checkbox-${obj.id}`)
                      .getElementsByClassName("checkbox");
                    checkTrueFalse(doc["0"], obj, doc["0"].checked);
                    checkIndeterminate(obj, doc["0"].checked);
                  }}
                />
                {obj.name}
              </div>
              <Accordion style={{ magin: 0 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  style={{ minHeight: "48px" }}
                ></AccordionSummary>
                <AccordionDetails>{verifyChildrenArray(obj)}</AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </>
    );
  };

  var selected = null;

  //function used to find a specific user
  function findObject(array, id) {
    if (id !== null) {
      array.map((o) => {
        if (o.id === id) {
          selected = o;
        }
        if (o.childrenArray.length > 0) findObject(o.childrenArray, id);
      });
    }
  }

  //function used to indeterminate a checkbox
  function checkIndeterminate(obj, checked) {
    if (obj.father !== null) {
      findObject(object, obj.father);
      const fatherDocument = document
        .getElementById(`checkbox-${selected.id}`)
        .getElementsByClassName("checkbox");
      fatherDocument["0"].indeterminate = checked ? true : false;
      fatherDocument["0"].checked = checked ? true : false;
      checkIndeterminate(selected, checked);
    }
  }

  //function used to check the selected and all children as true or false
  function checkTrueFalse(doc, obj, checked) {
    doc.indeterminate = false;
    doc.checked = checked === true ? false : true;
    obj.childrenArray.length > 0 &&
      obj.childrenArray.map((object) => {
        const childDocument = document
          .getElementById(`checkbox-${object.id}`)
          .getElementsByClassName("checkbox");
        checkTrueFalse(childDocument["0"], object, checked);
      });
  }

  //function used to return recursively all children
  function verifyChildrenArray(prop) {
    if (prop.childrenArray.length > 0)
      return <AccordionFather o={prop.childrenArray} />;
    return;
  }

  // useEffect used to set all array
  useEffect(() => {
    //function used to verify if the person has children or not
    function verifyChildren(prop, level, father) {
      if (Object.keys(prop.children)[0]) {
        makeThisArray(prop.childrenArray, prop.children, level + 1, father);
      }
    }

    //function used to put the person on his specific array
    function makeThisArray(finalArray, person, level, father) {
      var actual = "";
      for (var prop in person) {
        if (Object.keys(person[prop])[0]) {
          if (person[prop].level === level) {
            finalArray.push(person[prop]);
            person[prop].childrenArray = [];
            person[prop].father = father;
            actual = person[prop].id;
          }
          checkboxArray.push(false);
        }
        verifyChildren(person[prop], level, person[prop].id);
      }
    }
    makeThisArray(d, data, 0, null);
    setObject(d);
  }, []);

  return (
    <div className="App">
      <AccordionFather o={object} />
    </div>
  );
}

export default App;
