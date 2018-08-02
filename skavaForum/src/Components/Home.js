import React, { Component } from "react";
import data from "./QuestionList.json";
import "./Home.css";

export class Home extends Component {
	constructor(props)
	{
		super(props);
		this.state = {data:""};
	}

render(){
	return(
		 this.state.data ?
            <div className="homePage">
            	<div className="questContainer">
	                <div className="questTitle">Questions</div>
	                <div className="LoginAskQuestion"></div>
                	<div className="ListQuestions">
		                {
		                    data.map(function(questions,i){
			                    return <div className={"parentListDiv list_0" + i}>
			                      <div className="questionDesc">{questions.question}</div> <br/>
			                      <div className="questionType">{questions.description}</div> <br/>
			                      <div className="questionTitle">
			                      		<div className="relatedTag">Related Tags</div> 
			                      		<div className="relatedTagName">{questions.title}</div>
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
            			data.map(function(tagid,i){
			                    return <div className={"tag_0" + i}>
			                      		<div className="relatedTag tagAlign">{tagid.title}</div>
			                    </div>;
			                })
            		}	
            		</div>
            	</div>
           </div>
		   : ""
		)
	}

	
}
export default Home;