import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
        return (
            <div>
                <div class="mainContainer">
                    <div className="pagecontainer">
                    <div className="Qamodel">
                        <div className="qaContainer">
                            <div className="qtitlecontainer">
                                <div className="qtitle"> Javascript </div>
                            </div>
                            <div className="qDescription">What is Javascript ? </div>
                            <div className="rightcontent"><div className="tags"><div>Css</div> <div>Javascript</div></div></div>
                        </div>
                        <div className="answercontainer">
                            <div className="innerContainer">
                                <div className="noOfAnswers"><span>1 </span> Answers</div>
                                    <div className="answerDesc"> 
                                        <div className="answer"><p> Javascript is a dynamic computer programming language. It is lightweight and most commonly used as a part of web pages, whose implementations allow client-side script to interact with the user and make dynamic pages. It is an interpreted programming language with object-oriented capabilities.</p> </div> 
                                    <div class="postedInfo">
                                        <div className="Answered"><span>Answered</span><span className="postedDate">Nov 8 2017</span></div>
                                                <div className="postedName"><span>by </span> Andris</div>
                                        </div>
                                    </div>
                                    <div className="answerDesc"> 
                                        <div className="answer"><p> Javascript is a dynamic computer programming language. It is lightweight and most commonly used as a part of web pages, whose implementations allow client-side script to interact with the user and make dynamic pages. It is an interpreted programming language with object-oriented capabilities.</p> </div> 
                                    <div class="postedInfo">
                                        <div className="Answered"><span>Answered</span><span className="postedDate">Nov 8 2017</span></div>
                                                <div className="postedName"><span>by </span> Andris</div>
                                        </div>
                                    </div>
                                    <div className="answerDesc"> 
                                        <div className="answer"><p> Javascript is a dynamic computer programming language. It is lightweight and most commonly used as a part of web pages, whose implementations allow client-side script to interact with the user and make dynamic pages. It is an interpreted programming language with object-oriented capabilities.</p> </div> 
                                    <div class="postedInfo">
                                        <div className="Answered"><span>Answered</span><span className="postedDate">Nov 8 2017</span></div>
                                                <div className="postedName"><span>by </span> Andris</div>
                                        </div>
                                    </div>
                                </div>
                        </div>
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
                                    <div className="relatedTag">Js</div>
                                    <div className="relatedTag">Javascript</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}
}
export default Qa;