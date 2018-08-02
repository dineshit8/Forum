import React, { Component } from 'react';
import './PostQuestion.css';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from './Home';
export class PostQuestion extends Component {
  constructor(props)
  {
  super(props);
  this.state = {title:"",tags:"",quesId:"",userId:"",quesDescription:"",showErrordomQuestionTitle:{display:"none"},showErrordomQuestionDescription:{display:"none"},addedTags:{display:"none"},showErrordomTag:{display:"none"} , userId : Cookies.get('userId')  };
  this.handleQuestionTitle = this.handleQuestionTitle.bind(this);
  this.handleuserId = this.handleuserId.bind(this); 
  this.handlequesDescription = this.handlequesDescription.bind(this); 
  this.handleClick = this.handleClick.bind(this);
  this.handleTagList = this.handleTagList.bind(this);
  this.addQuestion = this.addQuestion.bind(this);
  
}
//handleTagList = (e) =>{this.setState({tags:e.target.value})}
handleQuestionTitle(e)
{
  this.setState({title:e.target.value})
}
handleTagList(e)
{
  this.setState({tags:e.target.value})
}
handleuserId(e)
{
  this.setState({userId:1})
}
handlequesDescription(e)
{
  this.setState({quesDescription:e.target.value})
}
handleClick(e){
    if(this.state.tags != ""){
        ReactDOM.render(<ButtonList data = {this.state.tags}/>,document.getElementById("tagList"));      
        this.setState({addedTags :{display:'block'}});
    }else{
        this.setState({showErrordomTag :{display:'block'}});
    }
  }
render() {
  if(this.state.userId)
  {
    return (
        <div className="cls_postQuestion">
          <div className="pageTitle">Post Your New Question</div>
          <div className="Quescontainer">
            <div className="Title parentDiv">
              <div className="titleName titleDiv">Question Title</div>
              <div className="titleInput">
            <input type="text" name="title" placeholder="Ask your Question?" maxLength="300" className="askTitle" onChange={this.handleQuestionTitle} />  
              </div>
          <div id="errordom" style={this.state.showErrordomQuestionTitle}>Question Title is Required</div>
            </div>
            <div className="quesDescription parentDiv">
              <div className="quesName titleDiv">Question Description</div>
              <div className="quesInput">
            <textarea className="description" cols="92" rows="15" onChange={this.handlequesDescription}></textarea>
              </div>
          <div id="errordom" style={this.state.showErrordomQuestionDescription}>Question Description is Required</div>
            </div>
            <div className="tags parentDiv">
          <div id="tagContainer"></div>
            </div>
            <div className="newTags parentDiv">
          <div className="tagName titleDiv" style={this.state.addedTags}>Tags</div>
          <div id="tagList"></div>
              <div className="newTagName titleDiv">New Tags</div>
            <input type="text" name="tagInput" placeholder="Add tag name (max 4 tags)" maxLength="300" className="tagInput" onChange={this.handleTagList}/>
            <button type="button" className="btn newTagButton" onClick={this.handleClick}>Add Tag</button>
            <div id="errordom" style={this.state.showErrordomTag}>Tag is Required</div>
            </div>
            <div className="postQuestion">
          <button type="button" className="btn btn-primary postQuestion" onClick={this.addQuestion}>Post Question</button>
            </div>
          </div>
        </div>
      )
    }
    else
    {
       return  <Redirect to='/'  />
    }
  }
  addQuestion(event)
  {
    event.preventDefault();
    var QuestionTitle = this.state.title;
    var userId = this.state.userId;
    var quesDescription = this.state.quesDescription;
    var QuestionId = Math.floor(Math.random() * 90000) + 10000;
    var tagArr = this.state.tags;
    tagArr = tagArr.split(",");
    var noError = true;
    var self = this;
    //var userId = this.state.userId; 
    if(QuestionTitle == ""){
      noError = false;
      self.setState({showErrordomQuestionTitle:{display:'block'}});
    }
    if(userId == ""){
      this.setState({showErrordomTag :{display:'block'}});
    }
    if(quesDescription == ""){
      noError = false;
      self.setState({showErrordomQuestionDescription:{display:'block'}});
    }
    if( !document.getElementById("tagList").children.length ){
      noError = false;
      this.setState({showErrordomTag :{display:'block'}});
    }
    if(noError){
       axios({
        method: 'post',
        url: 'http://localhost:4000/api/rest/addUserQuestion',
        data: {"QuestionId":QuestionId,"UserId":userId,"RelatedTags":tagArr,"Title":QuestionTitle,"Description":quesDescription},
        config: { headers: {'Content-Type': 'application/json' }},
        credentials: 'same-origin'
      })
      .then((response) => {
        var responseData = response && response.data ? response.data : "";
        if(responseData && responseData[0] && responseData[0].msg)
        {
          
        }
        else if(responseData && responseData.message)
        {
          
        }
      })
      .catch(function (response) {
        console.log(response);
      });
    }
  }
} 
export default PostQuestion;
class ButtonList extends Component {
  render() {
    var listitems = [];
    var tagArr = this.props.data;
    tagArr = tagArr.split(",");
    var tagArrLen = tagArr.length;
    var dom ="";
    for(var i=0;i<tagArrLen;i++){
        listitems.push(<button type="button" className="btn tagButton">{tagArr[i]}</button>);
   }
    return (listitems)
}
}