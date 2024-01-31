import Topnav from './nav';
import { useState, useEffect } from "react";
import Chart from 'chart.js/auto';
import React, { Link } from "react-router-dom";
import Axios from "axios";

export default function View(props) {
    
    const [userdata, setUserdata] = useState({
        date: [],
        question: [],
        question_value: [],
    }) //if match id then get Axios.
    var datas = [];
    var charts= [];
    const { date, question, question_value } = userdata;

      function download(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      }

    function toggleSwitch() {
        var a = document.getElementById("chart");
        var b = document.getElementById("table");
        if (a.style.display === "block") {
            a.style.display = "none"
            b.style.display = "block"
        } else {
            a.style.display = "block"
            b.style.display = "none"
        }
    }

    const cum_date = new Date();
    const [returnee, setReturnee] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [cumDate, setCumDate] = useState({
        cum_year : cum_date.getFullYear(),
        cum_month : cum_date.getMonth()+1,
        cum_day : cum_date.getDate(),
    })
    function onDownload(){
        download(JSON.stringify(questions), "yourfile.json", "text/plain");
    }

    

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
                <input type="radio" name={x.question} value={x.question_selection[0]}  disabled={true} defaultChecked={returnMutliple(x,0)}></input>
                <label>{x.question_selection[0]}</label>
                <input type="radio" name={x.question} value={x.question_selection[1]} disabled={true} defaultChecked={returnMutliple(x,1)}></input>
                <label>{x.question_selection[1]}</label>
                <input type="radio" name={x.question} value={x.question_selection[2]} disabled={true} defaultChecked={returnMutliple(x,2)}></input>
                <label>{x.question_selection[2]}</label>
            </>)
        } else if (x.question_type === "boolean") {
            return(
            <>
                <input type="radio" name={x.question} value={true} disabled={true} defaultChecked={returnBoolean(x,0)}></input>
                <label>True</label>
                <input type="radio" name={x.question} value={false} disabled={true} defaultChecked={returnBoolean(x,1)}></input>
                <label>False</label>
            </>)
        } else if (x.question_type === "number") {
            return  (<input type="number" value={returnText(x)}/>);
        } else {
            return(
                <>
                    <input type="text" value={returnText(x)}></input>
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
                var temp2 = [];
                append(questions, {
                    id: response.data[i].id,
                    user_id: response.data[i].user_id,
                    question: response.data[i].question,
                    question_type: response.data[i].question_type,
                    question_selection: temp,
                    question_answers: temp1
                });
                z++;
                if (response.data[i].question_type === "number") {
                    for (var j = 0; j < temp1.length; j++) {
                        temp2.push({x: temp1[j].date, y: temp1[j].answer});
                    }
                    var canvas = document.createElement("canvas");
                    canvas.id = "chart" + i;
                    document.getElementById('chart').appendChild(canvas)
                    var chart = new Chart("chart" + i, {
                        type: 'line',
                        data: {
                          datasets: [{
                            label: response.data[i].question,
                            data: temp2,
                    }]},
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: response.data[i].question
                            }
                        }
                    }})
                    charts.push(chart);
                } else if (response.data[i].question_type == "multiple choice") {
                    var x = [0,0,0];
                    for (var j = 0; j < temp1.length; j++) {
                        if (temp[0] === temp1[j].answer) {
                            x[0]++;
                        }else if (temp[1] === temp1[j].answer) {
                            x[1]++;
                        }else if (temp[2] === temp1[j].answer) {
                            x[2]++;
                        }
                    }
                    var canvas = document.createElement("canvas");
                    canvas.id = "chart" + i;
                    document.getElementById('chart').appendChild(canvas)
                    var chart = new Chart("chart" + i, {
                        type: 'pie',
                        data: {
                            labels: [temp[0], temp[1], temp[2]],
                            datasets: [{
                                data: x,
                            }]},
                        options: {
                                plugins: {
                                    title: {
                                        display: true,
                                        text: response.data[i].question
                                    }
                                }
                            }
                        })
                          charts.push(chart);
                } else if (response.data[i].question_type === "boolean") {
                    var x = [0, 0];
                    for (var j = 0; j < temp1.length; j++) {
                        if (temp1[j].answer === true) {
                            x[0]++;
                        } else if (temp1[j].answer === false) {
                            x[1]++;
                        }
                    }
                    var canvas = document.createElement("canvas");
                    canvas.id = "chart" + i;
                    document.getElementById('chart').appendChild(canvas)
                    var chart = new Chart("chart" + i, {
                        type: 'pie',
                        data: {
                            labels: ['true', 'false'],
                            datasets: [{
                                
                              data: x,
                            }]},
                            options: {
                                plugins: {
                                    title: {
                                        display: true,
                                        text: response.data[i].question
                                    }
                                }
                            }})
                    charts.push(chart);
                } else if (response.data[i].question_type === "text") {
                    console.log(temp1);
                    for (var j = 1; j < temp1.length; j++) {
                        var oned = new Date(temp1[j-1].date);
                        var tned = new Date(temp1[j].date);
                        if (oned.valueOf() > tned.valueOf()) {
                            var tmp = temp1[j-1];
                            temp1[j-1] = temp1[j];
                            temp1[j] = tmp;
                            j = 1;
                        }
                    }
                    console.log(temp1);
                    var canvas = document.createElement("div");
                    canvas.id = "textWrapper";
                    var title = document.createElement("div");
                    title.id="textTitle";
                    title.appendChild(document.createTextNode(response.data[i].question));
                    canvas.appendChild(title)
                    for (var j = 0; j < temp1.length; j++) {
                        var q = document.createElement("div");
                        q.append(document.createTextNode(temp1[j].date+ " - " + temp1[j].answer));
                        canvas.appendChild(q);
                    }
                    document.getElementById('chart').appendChild(canvas)
                    charts.push([]);
                }
            setReturnee(getData(0));
    }})}, []);


    

    return(
        <div id="viewWrapper">
            <Topnav selected="view" />
            <button onClick={onDownload}>Download</button>
            <button onClick={toggleSwitch}>Toggle</button>
            <div style={{display: "block"}} id="chart">
            </div>
            <div style={{display: "none", width: "200px", height: "200px"}} id="table">
            <div>
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
            </div>
        </div>
    );
}