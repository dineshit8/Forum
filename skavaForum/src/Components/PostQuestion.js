import React, { Component } from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import Home from './Home';
export class PostQuestion extends Component {
  constructor(props)
  {
    super(props);
    this.state = {userId : Cookies.get('userId')};
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
                <input type="text" name="title" placeholder="Ask your Question?" maxLength="300" className="askTitle" />  
              </div>
            </div>
            <div className="quesDescription parentDiv">
              <div className="quesName titleDiv">Question Description</div>
              <div className="quesInput">
                <textarea className="description" cols="92" rows="15"></textarea>
              </div>
            </div>
            <div className="tags parentDiv">
              <div className="tagName titleDiv">Tags</div>
              <div className="cls_tagButton">
                <button type="button" className="btn tagButton">Infra</button>
                <button type="button" className="btn tagButton">AWS</button>
                <button type="button" className="btn tagButton">NOC</button>
              </div>
            </div>
            <div className="newTags parentDiv">
              <div className="newTagName titleDiv">New Tags</div>
                <input type="text" name="tagInput" placeholder="Add tag name (max 4 tags)" maxLength="300" className="tagInput" />
                <button type="button" className="btn newTagButton">Add Tag</button>
            </div>
            <div className="postQuestion">
            <button type="button" className="btn btn-primary postQuestion">Post Question</button>
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
}
export default PostQuestion;