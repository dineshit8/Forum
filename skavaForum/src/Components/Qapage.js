import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import './Qapage.css'

class Qa extends Component {
    constructor(props)
    {
        super(props);
        this.addAnswer = this.addAnswer.bind(this);
        this.state = {QaData : "",tagData:"",userId : Cookies.get('userId')}
    }
    componentWillMount()
    {
        let params = (new URL(document.location)).searchParams;
        let questionId = params.get("id");
        var _self = this;
        axios({
            method: 'post',
            url: '/api/rest/getQuqAnsById',
            data: {"questionId":questionId},
            config: { headers: {'Content-Type': 'application/json' }},
            credentials: 'same-origin'
            })
            .then((response) => {
                if(response && response.data && response.data.status && response.data.status == "success")
                {
                    _self.setState({QaData : response.data });
                }
            })
            .catch(function (response) {
                console.log(response);
            });
            axios({
                method: 'get',
                url: '/api/rest/getTagsByUserId',
                config: { headers: {'Content-Type': 'application/json' }},
                credentials: 'same-origin'
                })
                .then((response) => {
                    _self.setState({tagData : response && response.data.children && response.data.children && response.data.children.tags ? response.data.children.tags : ""});
                })
                .catch(function (response) {
                    console.log(response);
            });
    }

    render() {
        if( this.state.userId)
        {
           if(this.state.QaData && this.state.QaData.children)
            {
                const noOfAnswersLen = this.state.QaData.children[0] && this.state.QaData.children[0].answerDetails && this.state.QaData.children[0].answerDetails[0] && this.state.QaData.children[0].answerDetails[0].answerDescription && this.state.QaData.children[0].answerDetails[0].answerDescription.length ? this.state.QaData.children[0].answerDetails[0].answerDescription.length : "";
            return (
                <div className="qpageTopContainer">
                    <div className="mainContainer">
                        <div className="pagecontainer">
                        <div className="Qamodel">
                            <div className="qaContainer">
                                {this.state.QaData.children.title ?
                                    <div className="qtitlecontainer">
                                        <div className="qtitle"> {this.state.QaData.children.title} </div>
                                    </div>
                                    : "" } 
                                {this.state.QaData.children.description ?
                                    <div className="qDescription"> {this.state.QaData.children.description} </div>
                                    :""}
                                <div className="rightcontent"><div className="tags">
                                {this.state.QaData.children.relatedTags ?
                                    this.state.QaData.children.relatedTags.map(function(tags,i)
                                        {
                                            return  <div className="tagsBackground">{tags}</div>
                                        })
                                    
                                    : ""
                                }
                                </div>
                            </div>
                            </div>
                            {this.state.QaData.children[0].answerDetails && this.state.QaData.children[0].answerDetails[0] && this.state.QaData.children[0].answerDetails[0].answerDescription ? 
                                <div className="answercontainer">
                                    <div className="innerContainer">
                                       
                                        <div className="noOfAnswers"><span> {noOfAnswersLen > 1 ? noOfAnswersLen + " Answers" : noOfAnswersLen + " Answer" }</span> </div>
                                            { this.state.QaData.children[0].answerDetails[0].answerDescription.map(function(answers , key)
                                            {   
                                                return <div className="answerDesc"> 
                                                    { answers.description ?
                                                        <div className="answer"> <p> {answers.description}</p> </div> 
                                                        :""
                                                    }
                                                <div className="postedInfo">
                                                    <div className="Answered"><span>Answered</span><span className="postedDate">{answers.postedDate}</span></div>
                                                            <div className="postedName"><span>by </span> {answers.userName}</div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                        </div>
                                </div>
                            : "" }
                        </div>
                        <div className="postAnswer">
                            <div className="answerCont">
                                <div className="yourAns">Your Answer</div>
                                <div className="postAns">
                                    <textarea className="description" id="description" cols="100" ref = "answerValue" rows="15" onChange={this.handlequesDescription}></textarea>
                                </div>
                            </div>
                            <button type="submit" id="post_submitbtn" ref= "postAnswer" uid = {this.state.QaData.children[0].userId} qid = {this.state.QaData.children[0].questionId} onClick={this.addAnswer}>Post Answer</button>
                        </div>
                        </div>
                        <div className="tagcontainer">
                            <div className="postedInformation">
                                <div className="postedByValues"><span className="postedby">Posted By : </span><span>{this.state.QaData.children[0].postedUserName ? this.state.QaData.children[0].postedUserName : ""}</span></div>
                                <div className="postedDateValues"><span className="posteDate">Posted Date : </span><span>{this.state.QaData.children[0].postedDate ? this.state.QaData.children[0].postedDate : ""}</span></div>
                            </div>
                            { this.state.userId && this.state.tagData? 
                            <div className="relatedtagCont">
                                <div className="relatedTagTxt">Popular Tags</div>
                                <div className="tagValues">
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
                    </div>
                </div>
            );
        }
        else
        {
            return "Please Wait..."
        }
    }
    else
    {
        setTimeout(function()
        { 
            window.location.href = window.location.origin;
        }, 3000);
        return "Please Login First..!!  You will be Re-directing to the home page soon..."
    }

}
addAnswer(event)
{
    event.preventDefault(); 
    var postAnswerdom = this.refs.postAnswer;
    var answerdom = this.refs.answerValue;
    var QuestionId = postAnswerdom.getAttribute('qid');
    var userId = postAnswerdom.getAttribute('uid');
    var description = answerdom.value;
    var _self = this;
        axios({
            method: 'post',
            url: '/api/rest/addUserAnswer',
            data: {"QuestionId":QuestionId,"UserId":userId,"Description":description},
            config: { headers: {'Content-Type': 'application/json' }},
            credentials: 'same-origin'
      })
      .then((response) => {
            var responseData = response && response.data ? response.data : "";
            if(responseData && responseData[0] && responseData[0].msg)
            {
               console.log(responseData[0].msg);
            }
            else if(responseData && responseData.message && responseData.status && responseData.status == "Success")
            {
                _self.componentWillMount();
                document.getElementById('description').value = ""
            }
      })
      .catch(function (response) {
        console.log(response);
      });

}
}
export default Qa;