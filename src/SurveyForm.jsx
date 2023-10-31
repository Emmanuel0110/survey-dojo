import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const maxNumberOfPoints = numberOfOptions => Math.floor(numberOfOptions/2);

function SurveyForm() {
  const [numberOfOptions, setNumberOfOptions] = useState(0);
  const [choices, setChoices] = useState([]); //example : {A:4, C:3}
  const {surveyId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/numberoptions?surveyId=${surveyId}`, {
      method: 'get',
      headers: {'Content-Type':'application/json'},
     }).then(response => response.json()).then(({numberOptions}) => {
      if(typeof(numberOptions) === "number") setNumberOfOptions(numberOptions);
      setChoices(new Array(Math.floor(numberOptions/2)).fill(0));
     });
  },[]);

  const handleSubmit = (event) => { 
    event.preventDefault();
    fetch('/vote', {
     method: 'post',
     headers: {'Content-Type':'application/json'},
     body: JSON.stringify({surveyId , vote: createDict(choices)})
    });
    navigate("/done");
   };

  const createDict = (arr) => {
    return arr.reduce((acc, currentValue, index) => {
      console.log(acc, currentValue, index);
      return {...acc, [currentValue]: arr.length - index};
    }, {});
  } 

  return <div id="surveyForm">
    <form onSubmit={handleSubmit}>
    {Array.from({length: maxNumberOfPoints(numberOfOptions)},(_, index) => index).map((lineNumber) => {
      return <div>
        <input onChange={e => {
          //setChoices({...choices, [e.currentTarget.value] : maxNumberOfPoints(numberOfOptions) - lineNumber});
          setChoices(choices.map((el, index) => {
            if (index === lineNumber) {
              return e.currentTarget.value;
            } else {
              return el;
            }
          }))
          }} placeholder={"Choice " + (lineNumber + 1).toString()} type="text"/><br />   
      </div>;
    })}
       <br/>
       <button type="Submit">Submit</button>
    </form>
  </div>;
}

export default SurveyForm;