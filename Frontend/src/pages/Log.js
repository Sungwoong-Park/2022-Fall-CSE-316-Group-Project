import Topnav from './nav.js';
import Axios from "axios";
import { useState, useEffect} from "react";
import React, { Link } from "react-router-dom";

export default function Log(props) {

    const cum_date = new Date();
    const [returnee, setReturnee] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [cumDate, setCumDate] = useState({
        cum_year : cum_date.getFullYear(),
        cum_month : cum_date.getMonth()+1,
        cum_day : cum_date.getDate(),
    })

    const { cum_year, cum_month, cum_day } = cumDate;

    const clickPre = () => {
        var arr = [31,30,31,30,31,30,31,31,30,31,30,31];
        var temp ={}
        if (cumDate.cum_month == 1) {
            if (cumDate.cum_day == 1) {
                temp = {
                    ...cumDate,
                    cum_year: cum_year-1,
                    cum_month: 12,
                    cum_day: 31
                }
            } else {
                temp = {
                    ...cumDate,
                    cum_day: cum_day-1
                }
            }
        } else {
            if (cumDate.cum_day == 1) {
                temp = {
                    ...cumDate,
                    cum_month: cum_month-1,
                    cum_day: arr[cum_month-2]
                }
            } else {
                temp = {
                    ...cumDate,
                    cum_day: cum_day-1
                }
            }
        }
        setCumDate(temp);
        var list = document.getElementById("list");
        for (var i = 0; i < list.childNodes.length; i++) {
            if (list.childNodes[i].childNodes.length === 7) { //if multiple choice
                list.childNodes[i].childNodes[1].checked = returnMutliple(questions[i], 0, temp)
                list.childNodes[i].childNodes[3].checked = returnMutliple(questions[i], 1, temp)
                list.childNodes[i].childNodes[5].checked = returnMutliple(questions[i], 2, temp)
            }
            if (list.childNodes[i].childNodes.length === 5) { //if multiple choice
                list.childNodes[i].childNodes[1].checked = returnBoolean(questions[i], 0, temp)
                list.childNodes[i].childNodes[3].checked = returnBoolean(questions[i], 1, temp)
            } 
            if (list.childNodes[i].childNodes.length === 2) { //if multiple choice
                if (returnText(questions[i], temp) === undefined) {
                    list.childNodes[i].childNodes[1].value = ""
                } else {
                    list.childNodes[i].childNodes[1].value = returnText(questions[i], temp);
                }
            } 
        }
        
    }

    const clickNext = () => {
        var arr = [31,30,31,30,31,30,31,31,30,31,30,31];
        var temp ={}
        if (cumDate.cum_month == 12) {
            if (cumDate.cum_day == arr[cumDate.cum_month-1]) {
                temp = {
                    ...cumDate,
                    cum_year: cum_year+1,
                    cum_month: 1,
                    cum_day: 1
                }
            } else {
                temp = {
                    ...cumDate,
                    cum_day: cum_day+1
                }
            }
        } else {
            if (cumDate.cum_day == arr[cumDate.cum_month-1]) {
                temp = {
                    ...cumDate,
                    cum_month: cum_month+1,
                    cum_day: 1
                }
            } else {
                temp = {
                    ...cumDate,
                    cum_day: cum_day+1
                }
            }

        }
        setCumDate(temp);
        var list = document.getElementById("list");
        for (var i = 0; i < list.childNodes.length; i++) {
            if (list.childNodes[i].childNodes.length === 7) { //if multiple choice
                list.childNodes[i].childNodes[1].checked = returnMutliple(questions[i], 0, temp)
                list.childNodes[i].childNodes[3].checked = returnMutliple(questions[i], 1, temp)
                list.childNodes[i].childNodes[5].checked = returnMutliple(questions[i], 2, temp)
            }
            if (list.childNodes[i].childNodes.length === 5) { //if boolean
                list.childNodes[i].childNodes[1].checked = returnBoolean(questions[i], 0, temp)
                list.childNodes[i].childNodes[3].checked = returnBoolean(questions[i], 1, temp)
            } 
            if (list.childNodes[i].childNodes.length === 2) { //if text or number
                if (returnText(questions[i], temp) === undefined) {
                    list.childNodes[i].childNodes[1].value = ""
                } else {
                    list.childNodes[i].childNodes[1].value = returnText(questions[i], temp);
                }
            } 
        }
    }

    function append(questions, question) {
        var temp = questions;
        questions.push(question);
        setQuestions(temp);
    }

    function returnMutliple(x, y, z) {
        if (z === undefined) {
            z=cumDate;
        }
        for (var i = 0; i < x.question_answers.length; i++) {
            if (x.question_answers[i].date == "" + z.cum_year + "-" + z.cum_month + "-" + z.cum_day) {
                if (x.question_answers[i].answer === x.question_selection[y]) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function returnBoolean(x, y, z) {
        if (z === undefined) {
            z=cumDate;
        }
        for (var i = 0; i < x.question_answers.length; i++) {
            if (x.question_answers[i].date === "" + z.cum_year + "-" + z.cum_month + "-" + z.cum_day) {
                if (x.question_answers[i].answer === true && y == 0) {
                    return true;
                } else if (x.question_answers[i].answer === false && y == 1) {
                    return true;
                }
            }
        }
        return false;
    }

    function returnText(x, z) {
        if (z === undefined) {
            z=cumDate;
        }
        for (var i = 0; i < x.question_answers.length; i++) {
            if (x.question_answers[i].date == "" + z.cum_year + "-" + z.cum_month + "-" + z.cum_day) {
                return x.question_answers[i].answer;
            }
        }
    }

    function returnInput(x) {
        if (x.question_type === "multiple choice") {
            return(
            <>
                <input type="radio" name={x.question} value={x.question_selection[0]} defaultChecked={returnMutliple(x,0)}></input>
                <label>{x.question_selection[0]}</label>
                <input type="radio" name={x.question} value={x.question_selection[1]} defaultChecked={returnMutliple(x,1)}></input>
                <label>{x.question_selection[1]}</label>
                <input type="radio" name={x.question} value={x.question_selection[2]} defaultChecked={returnMutliple(x,2)}></input>
                <label>{x.question_selection[2]}</label>
            </>)
        } else if (x.question_type === "boolean") {
            return(
            <>
                <input type="radio" name={x.question} value={true}defaultChecked={returnBoolean(x,0)}></input>
                <label>True</label>
                <input type="radio" name={x.question} value={false} defaultChecked={returnBoolean(x,1)}></input>
                <label>False</label>
            </>)
        } else if (x.question_type === "number") {
            return  (<input type="number" defaultValue={returnText(x)}/>);
        } else {
            return(
                <>
                    <input type="text" defaultValue={returnText(x)}></input>
                </>)
        }
    }

    function getData(x) {
        if (x < questions.length) {
            return (
            <>
            <div>
                <p>{questions[x].question}</p>
                {returnInput(questions[x])}
                </div>
                {getData(x+1)}
                
            </>);
        }
        return(<></>);
        
    }

    useEffect(() => {
        Axios.get("http://localhost:3305/api/diary/questions/id="+props.profile.user_id).then((response) => {
            var z = 0;
            for (var i in response.data) {
                var temp = JSON.parse(response.data[i].question_selection);
                var temp1 = JSON.parse(response.data[i].question_answers);

                append(questions, {
                    id: response.data[i].id,
                    user_id: response.data[i].user_id,
                    question: response.data[i].question,
                    question_type: response.data[i].question_type,
                    question_selection: temp,
                    question_answers: temp1
                });
                //ChangeReturnee(setSome(z),z);
                z++;
                
            }
            setReturnee(getData(0));
    })}, []);
    function changeQuestions(a) {
        setQuestions(a);
    }
    function ChangeReturnee(a) {
        setReturnee(a)
    }
    function submit() {
        var temp = questions;
        console.log(temp);
        var list = document.getElementById("list");
        for (var i = 0; i < list.childNodes.length; i++) {
            var temp1 = {
                date: "" + cumDate.cum_year + "-"+ cumDate.cum_month + "-" + cumDate.cum_day,
                answer: ""
            }
            if (list.childNodes[i].childNodes.length === 7) {
                if (list.childNodes[i].childNodes[1].checked) {
                    temp1.answer = list.childNodes[i].childNodes[1].value;
                } else if (list.childNodes[i].childNodes[3].checked) {
                    temp1.answer = list.childNodes[i].childNodes[3].value;
                } else if (list.childNodes[i].childNodes[5].checked) {
                    temp1.answer = list.childNodes[i].childNodes[5].value;
                }
            } else if (list.childNodes[i].childNodes.length === 5) {
                if (list.childNodes[i].childNodes[1].checked) {
                    temp1.answer = true;
                } else if (list.childNodes[i].childNodes[3].checked) {
                    temp1.answer = false;
                }
            } else if (list.childNodes[i].childNodes.length === 2) {
                temp1.answer = list.childNodes[i].childNodes[1].value;
            }
            for (var j = 0; j < temp[i].question_answers.length; j++) {
                if (temp[i].question_answers[j].date === ""+cumDate.cum_year +"-"+cumDate.cum_month+"-"+cumDate.cum_day) {
                    temp[i].question_answers[j].answer = temp1.answer
                } else if (j === temp[i].question_answers.length - 1) {
                    temp[i].question_answers.push(temp1);
                }
            }
            if (temp[i].question_answers.length == 0) {
                temp[i].question_answers.push(temp1);
            }
            
        }
        
        for (var i = 0; i < temp.length; i++) {
            Axios.put('http://localhost:3305/api/diary/questions/', {
                user_id: props.profile.user_id,
                question: temp[i].question,
                question_answers: JSON.stringify(temp[i].question_answers)
            })
        }
        alert("Your submission is correctly submitted on the db");
        
}

    return(
        <div id="pageWrapper">
            <Topnav selected="log" />
            <div id="logWrapper">
                <button onClick={clickPre}>
                    <span className="material-icons md-18">arrow_back_ios</span>
                </button>
                <p>{cumDate.cum_year}-{cumDate.cum_month}-{cumDate.cum_day}</p>
                <button onClick={clickNext}>
                    <span className="material-icons md-18">arrow_forward_ios</span>
                </button>
            </div>
            <div id="list">
                {returnee}
            </div>
            <button onClick={submit} id="submit">Submit</button>
        </div>
    );
}