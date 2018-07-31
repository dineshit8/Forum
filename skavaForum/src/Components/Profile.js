import React, { Component } from "react";
import profileIcon from './profileIcon.jpg';
import "./Profile.css";

export class Profile extends Component{

    render(){
        return(
            <div className="ProfilePage">
                <div className="profileTitle">Profile</div>
                <div className="profileContainer">
                    <div className="profileIcon"><img src={profileIcon}/></div>
                    <div className="profileDetails">
                        <div className="profileName">Arish Ali</div>
                        <div className="profilePosition">Co-founder and President, Skava<br/>San Francisco Bay Area</div>
                        <div className="profileAboutMe">Experienced Intelligence Specialist with a demonstrated history of working in the mental health industry. Skilled in Data Science and Psychology. Strong professional with a UG focused on Computer Science and Masters Of Arts in Psychology. </div>
                    </div>
                </div>
                <div className="ProfileUserStatus">
                        <div className="postsCount"><h1>1</h1><b>Posts</b></div>
                        <div className="QuestionCount"><h1>1</h1><b>Questions</b></div>
                        <div className="AnswerCount"><h1>0</h1><b>Answers</b></div>
                    </div>
                <div className="profileUserDetails">
                    <div className="Location"><b>SanFransico, Coimbatore</b></div>
                    <div className="JoinedIn">Joined in 2018</div>
                </div>
                <div className="UserStatus">
                    <div className="tagDetails">
                        <div className="topTag"><b>Top Tags</b>(1)</div>
                        <div className="tagName">Microserivce</div>
                    </div>
                    <div className="topPosts">
                        <div className="postTitle"><b>Top Posts</b>(1)</div>
                        <div className="postName">Why Microservices for Digital Commerce are Gaining Analyst Recognition</div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Profile;