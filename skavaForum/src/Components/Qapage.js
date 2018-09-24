import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import './Qapage.css';
import RichTextEditor from 'react-rte';

class Qa extends Component {
    constructor(props)
    {
        super(props);
        this.addAnswer = this.addAnswer.bind(this);
        this.state = {richValue: RichTextEditor.createValueFromString("", 'html'),htmlValue: "",QaData : "",tagData:"",userId : Cookies.get('userId') }
        this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
        this.renderRichTextArea = this.renderRichTextArea.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
        this.addComment = this.addComment.bind(this);
    }
    componentWillMount()
    {
        let params = (new URL(document.location)).searchParams;
        let questionId = params.get("id");
        var _self = this;
        axios({
            method: 'post',
            url: 'http://localhost:4000/api/rest/getQuqAnsById',
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
                url: 'http://localhost:4000/api/rest/getTagsByUserId',
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
    onChange = (richValue) => {
        this.setState({richValue, htmlValue: richValue.toString('html')}, () => {
        });
      };

    render() {
           if(this.state.QaData && this.state.QaData.children && this.state.QaData.children[0])
            {
            var thisObj = this;
            const noOfAnswersLen = this.state.QaData.children[0] && this.state.QaData.children[0].answerDetails && this.state.QaData.children[0].answerDetails[0] && this.state.QaData.children[0].answerDetails[0].answerDescription && this.state.QaData.children[0].answerDetails[0].answerDescription.length ? this.state.QaData.children[0].answerDetails[0].answerDescription.length : 0;
            return (
                <div className="qpageTopContainer">
                    <div className="mainContainer">
                        <div className="pagecontainer">
                        <div className="Qamodel">
                            <div className="qaContainer">
                                {this.state.QaData.children[0].title ?
                                    <div className="qtitlecontainer">
                                        <div className="qtitle"> {this.state.QaData.children[0].title} </div>
                                    </div>
                                    : "" } 
                                {this.state.QaData.children[0].description ?
                                    <div className="qDescription">  <div dangerouslySetInnerHTML={{ __html: this.state.QaData.children[0].description }} /> </div>
                                    :""}
                                <div className="rightcontent">
                                {this.state.QaData.children[0].relatedTags ?
                                    <div className="tags">
                                        {this.state.QaData.children[0].relatedTags.map(function(tags,i)
                                        {
                                            return  <div className="tagsBackground">{tags}</div>
                                        })}
                                    </div>
                                    : ""
                                }
                                 { !noOfAnswersLen ? <div className ="firstAnswer"> No answers yet !!.. </div>  : ""}
                            </div>
                            </div>
                            {this.state.QaData.children[0].answerDetails && this.state.QaData.children[0].answerDetails[0] && this.state.QaData.children[0].answerDetails[0].answerDescription ? 
                                <div className="answercontainer">
                                    <div className="innerContainer">
                                       
                                        <div className="noOfAnswers"><span> {noOfAnswersLen > 1 ? noOfAnswersLen + " Answers" : noOfAnswersLen + " Answer" }</span> </div>
                                            { this.state.QaData.children[0].answerDetails[0].answerDescription.map(function(answers , key)
                                            {   
                                                return <div className="answerDesc"> <div className="answerContainer">
                                                    { answers.description ?
                                                        <div className="answer"> <div dangerouslySetInnerHTML={{ __html: answers.description }} /></div> 
                                                        :""
                                                    }
                                                 { answers.commentArr && answers.commentArr.length > 0 ? 
                                                    <div className="showCommentCont">
                                                        <span style={{"fontWeight":"bold", "marginBottom":"10px"}}> Comments </span>
                                                        <div className="contentsList">
                                                            { 
                                                                answers.commentArr.map(function(commentArr , key)
                                                                {
                                                                    { return commentArr.commentDescription && commentArr.commentDescription.description ? 
                                                                            
                                                                        <div className="comments"> <span>{commentArr.commentDescription.description}</span>
                                                                            <div className="commentPostedInfo">
                                                                            { commentArr.commentDescription.userName ? 
                                                                                <span className="commentedUser"> {commentArr.commentDescription.userName} </span>
                                                                                :""
                                                                            }
                                                                            { thisObj.state.userId && commentArr.commentDescription.userId && thisObj.state.userId == commentArr.commentDescription.userId ?
                                                                                <span className="deleteCont deleteComment"><img src="https://png.icons8.com/metro/50/000000/trash.png" cid = {commentArr.commentDescription.commentId} qid = {answers.questionId} aid = {answers.answerId} onClick = {thisObj.handleDeleteComment.bind(this)}/></span>
                                                                            :""
                                                                            }
                                                                        </div></div>
                                                                        :""
                                                                    } 
                                                                        
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                :""}
                                                <div className="postedInfo">
                                                    <div className="Answered"><span>Answered</span><span className="postedDate">{answers.postedDate}</span></div>
                                                            <div className="postedName"><span>by </span> {answers.userName}</div>
                                                            { thisObj.state.userId && answers.userId && thisObj.state.userId == answers.userId 
                                                                ?
                                                                    <div className="deleteCont"><img src="https://png.icons8.com/metro/50/000000/trash.png" uid = {answers.userId} qid = {answers.questionId} aid = {answers.answerId} onClick = {thisObj.handleDeleteAnswer.bind(this)}/></div>
                                                                :   "" 
                                                            }
                                                            { thisObj.state.userId 
                                                                ?
                                                                    <div className="commentCont"><img src="https://png.icons8.com/metro/50/000000/comments.png" uid = {answers.userId} qid = {answers.questionId} aid = {answers.answerId} onClick = {thisObj.handleComment.bind(this)}/></div>
                                                                :   "" 
                                                            }
                                                </div>
                                                </div>
                                                 <div className="commentsContainer" style={{"display":"none"}}>
                                                    <div className="addcommentsCont">
                                                        <div className="textareaContainer">
                                                            <textarea placeholder = "Add your comments here..." rows="5" className="addCommentArea" id="addCommentArea"></textarea>
                                                            <button type="button" className="btn btn-primary addcomment" qid = {answers.questionId} aid = {answers.answerId} onClick={thisObj.addComment}>Reply To This Answer</button>
                                                        </div>
                                                    </div>  
                                                 </div>
                                                 
                                                 </div>
                                            })
                                        }
                                        </div>
                                </div>
                            : "" }
                        </div>
                        { this.state.userId ? 
                        <div className="postAnswer">
                            <div className="answerCont">
                                <div className="yourAns">Your Answer</div>
                                <div className="postAns">
                                    {/* <textarea className="description" id="description" cols="100" ref = "answerValue" rows="15" onChange={this.handlequesDescription}></textarea> */}
                                   {this.renderRichTextArea()}
                                </div>
                            </div>
                            <button type="submit" id="post_submitbtn" ref= "postAnswer" uid = {this.state.QaData.children[0].userId} qid = {this.state.QaData.children[0].questionId} onClick={this.addAnswer}>Post Answer</button>
                        </div>
                            : <div className = "loginSignup">Login / Sign-up to Post your Answer</div> }
                        </div>
                        <div className="tagcontainer">
                            <div className="postedInformation">
                                <div className="postedByValues"><span className="postedby">Question Posted By : </span><span>{this.state.QaData.children[0].postedUserName ? this.state.QaData.children[0].postedUserName : ""}</span></div>
                                <div className="postedDateValues"><span className="posteDate">Question Posted Date : </span><span>{this.state.QaData.children[0].postedDate ? this.state.QaData.children[0].postedDate : ""}</span></div>
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
                                </div> : "" 
                            }
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
   /* else
    {
        setTimeout(function()
        { 
            window.location.href = window.location.origin;
        }, 3000);
        return "Please Login First..!!  You will be Re-directing to the home page soon..."
    }*/
    renderRichTextArea()
    {
        return <RichTextEditor id="description" className = "description" 
            value={this.state.richValue}
            placeholder={"Type here.."}
            onChange={this.onChange}
            />
    }
    addAnswer(event)
    {
        event.preventDefault(); 
        var postAnswerdom = this.refs.postAnswer;
        var QuestionId = postAnswerdom.getAttribute('qid');
        var userId = postAnswerdom.getAttribute('uid');
        var description = this.state.htmlValue;
        var _self = this;
        if(description && description.length > 1)
        {
            axios({
                    method: 'post',
                    url: 'http://localhost:4000/api/rest/addUserAnswer',
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
                        _self.state.richValue = RichTextEditor.createValueFromString("", 'html')
                    axios({
                        method: 'post',
                        url: 'http://localhost:4000/api/rest/getMailIdByUserId',
                        data: {"userId":userId},
                        config: { headers: {'Content-Type': 'application/json' }},
                        credentials: 'same-origin'
                    })
                    .then((response) => {
                            var responseData = response && response.data ? response.data : "";
                            if(responseData)
                            {
                                if(responseData.status && responseData.status == "success")
                                {
                                    var getMailId = responseData.children && responseData.children[0] && responseData.children[0].mailId ? responseData.children[0].mailId : "";
                                    axios({
                                        method: 'post',
                                        url: 'http://localhost:4000/api/rest/sendMail',
                                        data: {"Qid":QuestionId,"mailId":getMailId},
                                        config: { headers: {'Content-Type': 'application/json' }},
                                        credentials: 'same-origin'
                                    })
                                    .then((response) => {
                                        var responseData = response && response.data ? response.data : "";
                                        if(responseData)
                                        {
                                            if(responseData.status && responseData.status == "Success")
                                            {
                                                console.log("Mail sent");
                                            }
                                            else if(responseData.status && responseData.status == "Failure")
                                            {
                                                console.log("Mail not sent");
                                            }
                                        }
                                    })
                                    .catch(function (response) {
                                        console.log(response);
                                    });
                                }
                                else if(responseData.status && responseData.status == "Failure")
                                {
                                    console.log("MailId not detected");
                                }
                            }
                        })
                        .catch(function (response) {
                            console.log(response);
                        });
                    }
                    else if(responseData && responseData.message && responseData.message == "session timed out")
                    {
                        window.alert("Your session has been expired.. Kindly login");
                        window.location.reload();
                    }
            })
            .catch(function (response) {
                console.log(response);
            });
        }
    }
    handleDeleteAnswer(self)
    {
        var _self = this;
        if(self)
        {
            var quesid =  parseFloat(self.target.getAttribute("qid"));
            var ansid = parseFloat(self.target.getAttribute("aid"));
            var userid = self.target.getAttribute("uid");
            axios({
                method: 'post',
                url: 'http://localhost:4000/api/rest/deleteAnswer',
                data: {"userId":userid,"answerId":ansid,"questionId":quesid},
                config: { headers: {'Content-Type': 'application/json' }},
                credentials: 'same-origin'
            })
            .then((response) => {
                var responseData = response && response.data ? response.data : "";
                if(responseData)
                {
                    if(responseData.status && responseData.status == "success")
                    {
                        _self.componentWillMount();
                    }
                   
                }
            })
            .catch(function (response) {
                console.log(response);
            });
        }
    }
    handleComment(self)
    {
        self.target.parentNode.parentNode.parentNode.nextElementSibling.classList.add('show')
    }
    addComment(self)
    {
        var _self = this;
        if(self)
        {
            var quesid =  parseFloat(self.target.getAttribute("qid"));
            var ansid = parseFloat(self.target.getAttribute("aid"));
            var commentValue = self.target.previousElementSibling.value;
            axios({
                method: 'post',
                url: 'http://localhost:4000/api/rest/addComment',
                data: {"commentDesc":commentValue,"answerId":ansid,"questionId":quesid},
                config: { headers: {'Content-Type': 'application/json' }},
                credentials: 'same-origin'
            })
            .then((response) => {
                var responseData = response && response.data ? response.data : "";
                if(responseData)
                {
                    if(responseData.status && responseData.status == "success")
                    {
                        _self.componentWillMount();
                    }
                }
            })
            .catch(function (response) {
                console.log(response);
            });
        }
    }
    handleDeleteComment(self)
    {
        var _self = this;
        if(self)
        {
            var quesid =  parseFloat(self.target.getAttribute("qid"));
            var ansid = parseFloat(self.target.getAttribute("aid"));
            var commentId = parseFloat(self.target.getAttribute('cid'));
            axios({
                method: 'post',
                url: 'http://localhost:4000/api/rest/deleteComment',
                data: {"commentId":commentId,"answerId":ansid,"questionId":quesid},
                config: { headers: {'Content-Type': 'application/json' }},
                credentials: 'same-origin'
            })
            .then((response) => {
                var responseData = response && response.data ? response.data : "";
                if(responseData)
                {
                    if(responseData.status && responseData.status == "success")
                    {
                        _self.componentWillMount();
                    }
                }
            })
            .catch(function (response) {
                console.log(response);
            });
        }
    }

}
export default Qa;