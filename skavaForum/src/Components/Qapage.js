import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import './Qapage.css'

class Qa extends Component {
    constructor(props)
    {
        super(props);
    }
    render() {
        if(this.props.QaData && this.props.QaData.children && this.props.QaData.children[0])
        {
        return (
            <div className="qpageTopContainer">
                <div className="mainContainer">
                    <div className="pagecontainer">
                    <div className="Qamodel">
                        <div className="qaContainer">
                            {this.props.QaData.children[0].title ?
                                <div className="qtitlecontainer">
                                    <div className="qtitle"> {this.props.QaData.children[0].title} </div>
                                </div>
                                : "" } 
                            {this.props.QaData.children[0].description ?
                                <div className="qDescription"> {this.props.QaData.children[0].description} </div>
                                :""}
                            <div className="rightcontent"><div className="tags">
                            {this.props.QaData.children[0].relatedTags ?
                                this.props.QaData.children[0].relatedTags.map(function(tags,i)
                                    {
                                        return  <div className="tagsBackground">{tags}</div>
                                    })
                                
                                : ""
                            }
                            </div>
                        </div>
                        </div>
                        {this.props.QaData.children[0].answerDetails ? 
                            <div className="answercontainer">
                                <div className="innerContainer">
                                    <div className="noOfAnswers"><span> {this.props.QaData.children[0].answerDetails.length} </span> Answers</div>
                                        { this.props.QaData.children[0].answerDetails.map(function(answers , key)
                                        {   
                                            return <div className="answerDesc"> 
                                                { answers.answerDescription && answers.answerDescription[0] && answers.answerDescription[0].description ?
                                                    <div className="answer"> <p> {answers.answerDescription[0].description}</p> </div> 
                                                     :""
                                                }
                                            <div className="postedInfo">
                                                <div className="Answered"><span>Answered</span><span className="postedDate">Nov 8 2017</span></div>
                                                        <div className="postedName"><span>by </span> Andris</div>
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
                                 <textarea className="description" cols="100" rows="15" onChange={this.handlequesDescription}></textarea>
                            </div>
                        </div>
                        <button type="submit" id="post_submitbtn">Post Answer</button>
                     </div>

                    </div>
                    <div className="tagcontainer">
                        <div className="postedInformation">
                            <div className="postedByValues"><span className="postedby">Posted By : </span><span>Kumar</span></div>
                            <div className="postedDateValues"><span className="posteDate">Posted Date : </span><span>Oct 8 2017</span></div>
                        </div>
                        <div className="relatedtagCont">
                            <div className="relatedContent">
                                <div className="relatedTagTxt">Related Tags</div> 
                                <div className="tagValues">  
                                    <div className="tagsBackground tagAlign">Js</div>
                                    <div className="tagsBackground tagAlign">Javascript</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else
    {
        return "Please Wait"
    }
}
}
export default Qa;