import React, { Component } from "react";
import profileIcon from './profileIcon.jpg';
import axios from 'axios';
import Cookies from 'js-cookie';
import "./Profile.css";

export class Profile extends Component{
    constructor(props)
    {
        super(props);
        this.state = {profileData : "",userId : Cookies.get('userId')}
    }
    componentWillMount()
    {
        var _self = this;
        axios({
            method: 'get',
            url: 'http://localhost:4000/api/rest/getProfileData',
            config: { headers: {'Content-Type': 'application/json' }},
            credentials: 'same-origin'
            })
            .then((response) => {
                if(response && response.data && response.data.status && response.data.status == "success")
                {
                    _self.setState({profileData : response.data.children});
                }
                else{
                    window.location.href = "/";
                }
            })
            .catch(function (response) {
                console.log(response);
            });
    }
    render()
     {
        if(this.state.profileData &&  this.state.userId)
        {
            return(
                <div className="ProfilePage">
                    <div className="profileContainer">
                        <div className="profileIcon"><img src={profileIcon} alt="Image Loading"/></div>
                        <div className="profileName">{this.state.profileData.userName ? this.state.profileData.userName : ""}</div>
                    </div>
                     {/*  <div className="ProfileUserStatus">
                        <div className="postsCount"><h1>1</h1><b>Posts</b></div>
                        <div className="QuestionCount"><h1>1</h1><b>Questions</b></div>
                        <div className="AnswerCount"><h1>0</h1><b>Answers</b></div>
                    </div> */}
                    <div className="profileUserDetails">
                        <div className="JoinedIn  ">Joined in {this.state.profileData.joinDate ? this.state.profileData.joinDate : ""}</div>
                        <div className="tagDetails">
                            <div className="topTag"><b>Top Tags</b>{this.state.profileData.tags ? this.state.profileData.tags.length : "1"}</div>
                            {
                                this.state.profileData.tags ?
                                    <div className="tags">
                                        {this.state.profileData.tags.map(function(tags,i)
                                        {
                                            return  <div className="tagsBackground">{tags}</div>
                                        })}
                                    </div>
                                : ""
                            }
                        </div>
                        {/*  <div className="topPosts">
                            <div className="postTitle"><b>Top Posts</b>(1)</div>
                            <div className="postName">Why Microservices for Digital Commerce are Gaining Analyst Recognition</div>
                        </div> */}
                    </div>
               
                </div>
            )
        }
        else
        {
            return "Please Wait..."
        }
    }
}
export default Profile;