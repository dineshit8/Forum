import React, { Component } from "react";
import "./Search.css";
import axios from 'axios';
class Search extends Component {

constructor(props) {
    super(props);    
    this.getQuestions = this.getQuestions.bind(this);
    /*if(this.props.searchData) {
        this.state = {data: this.props.searchData};
    }*/
}
//getQuestions();
render(){
   if(this.props.searchData && this.props.searchData.length) {
         var self = this;
        return(
            <div className="searchPage">
            	<div className="questContainer">
	                <div className="questTitle">Questions</div>
	                <div className="LoginAskQuestion"></div>
                	<div className="ListQuestions">
		                {
		                    this.props.searchData.map(function(questions,i){
			                    return <div className={"parentListDiv list_0" + i}>
			                     <div className="questionDesc" qid={questions.questionId} onClick={self.navigateQuestion.bind(this)} >{questions.title}</div> <br/>
			                      <div className="questionType"><div dangerouslySetInnerHTML={{ __html: questions.description }}/></div> <br/>
			                      <div className="questionTitle">
			                      		<div className="relatedTagName">{questions.relatedTags.map(function(tags, index){return <span className="tagsBackground">{tags}</span>})}</div>
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
            			this.props.searchData.map(function(tagid,i){
			                    return <div className={"tag_0" + i}>
			                      		<div className="relatedTag tagAlign">{tagid.relatedTags.map(function(tags, index){return tags})}</div>
			                    </div>;
			                })
            		}	
            		</div>
            	</div>
           </div>
        )
    }
    else
        {
            return "No Search Results Found..."
        }
    }
    
getQuestions()
  {
    var searchTerm = this.props.searchKeyword ? this.props.searchKeyword : "javascript";
    var self = this;
    axios({
        method: 'post',
        url: 'http://localhost:4000/api/rest/getRelatedQuestions',
        data: {"keyWords":searchTerm},
        config: { headers: {'Content-Type': 'application/json' }},
        credentials: 'same-origin'
      })
      .then((response) => {
        console.log(response);  
         self.setState({data : response && response.data ? response.data : ""});
      })
      .catch(function (response) {
         console.log(response);
      });
  }
  navigateQuestion(self)
    {
        var QuestionId = self ? self.target.getAttribute("qid") : "";
        window.location.href = "/Qa?id="+QuestionId;
    }
}
export default Search;