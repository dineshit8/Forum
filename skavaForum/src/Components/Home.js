import React, { Component } from "react";
import data1 from "./QuestionList.json";
import ReactDOM from 'react-dom';
import "./Home.css";
import axios from 'axios';
import Qa from './Qapage';
export class Home extends Component {
constructor(props)
{
	super(props);
	this.state = {data:""};
	this.navigateQuestion = this.navigateQuestion.bind(this);
}
componentWillMount() {
	var self = this;
	axios({
		method: 'get',
		url: 'http://localhost:4000/api/rest/getQuestions',
		config: { headers: {'Content-Type': 'application/json' }},
		credentials: 'same-origin'
		})
		.then((response) => {
			self.setState({data : response && response.data && response.data.message ? response.data.message : ""});
		})
		.catch(function (response) {
			console.log(response);
	});
}
render(){
	var self = this;
	return(
		 this.state.data.length ?
		 	
            <div className="homePage">
            	<div className="questContainer">
	                <div className="questTitle">Questions</div>
	                <div className="LoginAskQuestion"></div>
                	<div className="ListQuestions">
		                {
		                    this.state.data.map(function(questions,i){
			                    return <div className={"parentListDiv list_0" + i} uid={questions.userId}>
			                      <div className="questionTitle" qid={questions.questionId} ref = "questionTitle" onClick={self.navigateQuestion} >{questions.title}</div> <br/>
			                      <div className="questionDesc" qid={questions.questionId} ref = "questionDesc" >{questions.description} </div> <br/>
								  <div className="questionTag">
									{
										questions.relatedTags.map(function(tags,j)
										{
											return <div className="tagsBackground">{tags}</div>
										})
									}
								  </div>  
							     </div>;
		                	})
		                }   
            		</div>
            	</div>
            	<div className="popularTags">
            		<div className="popularTagTitle">Popular Tags</div>
            		<div className="tagsName">
            		{
            			this.state.data.map(function(tagid,i){
			                    return <div className={"tag_0" + i}>
			                      		<div className="tagsBackground tagAlign">{tagid.title}</div>
			                    </div>;
			                })
            		}	
            		</div>
            	</div>
           </div>
		   : "No Questions Found "
		)
	}
navigateQuestion()
{
	var _self = this;
	var element = _self.refs.questionTitle;
	var QuestionId = element.getAttribute("qid");
	axios({
		method: 'post',
		url: 'http://localhost:4000/api/rest/getQuqAnsById',
		data: {"questionId":QuestionId},
		config: { headers: {'Content-Type': 'application/json' }},
		credentials: 'same-origin'
		})
		.then((response) => {
			if(response && response.data && response.data.status && response.data.status == "success")
			{
			_self.setState({data : response && response.data ? response.data : ""});
			ReactDOM.render(<Qa QaData = {_self.state.data}/>,document.getElementById('searchResults'));
			}
		})
		.catch(function (response) {
			console.log(response);
		});
}
}
export default Home;