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
    if(this.props.searchData) {
        return(
            <div className="searchPage">
            	<div className="questContainer">
	                <div className="questTitle">Questions</div>
	                <div className="LoginAskQuestion"></div>
                	<div className="ListQuestions">
		                {
		                    this.props.searchData.map(function(questions,i){
			                    return <div className={"parentListDiv list_0" + i}>
			                      <div className="questionDesc">{questions.title}</div> <br/>
			                      <div className="questionType">{questions.description}</div> <br/>
			                      <div className="questionTitle">
			                      		<div className="relatedTag">Related Tags</div> 
			                      		<div className="relatedTagName">{questions.relatedTags.map(function(tags, index){return tags})}</div>
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
}
export default Search;