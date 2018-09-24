import React, { Component } from "react";
import "./Home.css";
import axios from 'axios';
import Cookies from 'js-cookie';
export class Home extends Component {
constructor(props)
{
	super(props);
	this.state = {data:"",tagData:"",userId : Cookies.get('userId'), pagination:""};
	this.navigateQuestion = this.navigateQuestion.bind(this);
	this.getQuestions = this.getQuestions.bind(this);
	this.handlePagination = this.handlePagination.bind(this);
}
componentWillMount() {
	var self = this;
	let params = (new URL(document.location)).searchParams;
    let pageNum = params.get("page") ? parseInt(params.get("page")) : 1;
	self.getQuestions(pageNum);
	axios({
		method: 'get',
		url: 'http://localhost:4000/api/rest/getTagsByUserId',
		config: { headers: {'Content-Type': 'application/json' }},
		credentials: 'same-origin'
		})
		.then((response) => {
			self.setState({tagData : response && response.data.children && response.data.children[0] && response.data.children[0].tags ? response.data.children[0].tags : ""});
		})
		.catch(function (response) {
			console.log(response);
	});
}
getQuestions(currPage) {
	var self = this;
	var currPageNum = currPage ? currPage : 1;
	var dataParam = {"page": currPageNum, "limit": 3};
	axios({
		method: 'post',
		url: 'http://localhost:4000/api/rest/getQuestions',
		data: dataParam,
		config: { headers: {'Content-Type': 'application/json' }},
		credentials: 'same-origin'
		})
		.then((response) => {
			self.setState({data : response && response.data && response.data.message ? response.data.message : ""});
			self.setState({pagination: response && response.data && response.data.pagination ? response.data.pagination : ""});
		})
		.catch(function (response) {
			console.log(response);
	});
}
handlePagination(pageNum) {
	var self = this;
	self.getQuestions(pageNum);
}
render(){
	var self = this;
	return(
		 this.state.data.length ?
		 	<div className="homePage">
            	<div className="questContainer">
	                <div className="questTitle">All Questions{this.state.pagination && this.state.pagination.totalNoOfRecords ? "("+this.state.pagination.totalNoOfRecords+")" : ""}</div>
	                <div className="LoginAskQuestion"></div>
                	<div className="ListQuestions">
		                {
		                    this.state.data.map(function(questions,i){
			                    return <div className={"parentListDiv list_0" + i} uid={questions.userId}>
			                      <div className="questionTitle" qid={questions.questionId} onClick={self.navigateQuestion.bind(this) } >{questions.title}</div> <br/>
								  <div className="questionDesc" qid={questions.questionId} >
								  	 <div dangerouslySetInnerHTML={{ __html: questions.description }} />
								  </div> <br/>
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
					{
						this.state.pagination && this.state.pagination.totalNoOfRecords && this.state.pagination.limit && this.state.pagination.totalNoOfRecords>this.state.pagination.limit ?
							<div className="paginationContainer">
				 				<Pagination data = {this.state.pagination} thisObj = {this}/>
				 			</div>
						  : ""
					}
            	</div>
				{ this.state.userId && this.state.tagData? 
            	<div className="popularTags">
            		<div className="popularTagTitle">Popular Tags</div>
            		<div className="tagsName">
            		{
            			this.state.tagData.map(function(tagid,i){
			                    return <div className={"tag_0" + i}>
			                      		<div className="tagsBackground tagAlign">{tagid}</div>
			                    </div>;
			                })
            		}	
            		</div>
				</div> : "" }
           </div>
		   : "Please Wait... "
		)
	}
navigateQuestion(self)
{
	var QuestionId = self ? self.target.getAttribute("qid") : "";
	window.location.href = "/Qa?id="+QuestionId;
}
}
class Pagination extends Component {
	render(){
		var pageList = [];
		var totalNoOfPages = this.props.data.totalNoOfRecords / this.props.data.limit;
		if(this.props.data.totalNoOfRecords % this.props.data.limit > 0) {
			totalNoOfPages++;
		}
		var currPage = this.props.data.page;
		var thisObj = this.props.thisObj;
		for(let index = 1; index <= totalNoOfPages; index++) {
			if(index === currPage) {
				pageList.push(<a href={"/home?page="+index} className = "pageList currPage" id = {"page"+index} onClick={() => thisObj.handlePagination(index)}>{index}</a>);
			}
			else {
				pageList.push(<a href={"/home?page="+index} className = "pageList" id = {"page"+index} onClick={() => thisObj.handlePagination(index)}>{index}</a>);
			}
		}
		return(pageList);
	}
}
export default Home;