import React, { Component } from 'react';
import logo from './logo2.png';
import ReactDOM from 'react-dom';
import './Header.css';
import axios from 'axios';
import PostQuestion from './PostQuestion';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
class Header extends Component {
  constructor(props)
  {
    super(props);
    this.state = {showMask : {display:"none"} , maskFlag : false , signinshowHide : {display:"none"}};
    this.maskFunction = this.maskFunction.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    
  }
  render() {
    return (<Router>
      <div>
      <div className="mask" onClick={this.maskFunction} style={this.state.showMask}></div>
        <div className="header">
          <div className="leftcontent">
            <div className="h-icon"><img className="h-image-icon" src={logo}></img></div>
              <form id="search" action="#" method="post" className="s-bar">
                <div className="searchBar">
                  <input type="text" name="searchinput" placeholder="Search" maxLength="60" className="in-search" />
                </div>
              </form>
          </div>
          <div className="rightContent">
            <div className="loginParent">
              <div className="login" onClick={this.handleLogin}>Login</div>
            </div>
            <div className="QuestionParent">
              <div className="askQuestion">
              <Link to="/PostQuestion">Ask Question</Link>
              </div>
            </div>
          </div>
        </div>
        <div id = "signContainer" style={this.state.signinshowHide}></div>
          <div className="content">
            <Route path="/PostQuestion" component={PostQuestion}/>
          </div>
      </div>
      </Router>);
  }
  handleLogin() {
    this.maskFunction();
      ReactDOM.render(<Login/>,document.getElementById('signContainer'));
  };
  handleAskQuestion() {
    ReactDOM.render(<PostQuestion/>,document.getElementById('id_askQuestion'));
};
  maskFunction(e)
  {
    if(this.state.maskFlag)
    {
      this.setState({showMask : {display:"none"} , maskFlag : false , signinshowHide : {display:"none"}})
    }
    else
    {
      this.setState({showMask : {display:"block"} , maskFlag : true , signinshowHide : {display:"block"}})
    }
  }
 
}
class Login extends Component {
  constructor(props)
  {
    super(props);
    this.state = {emailInput:"",pwdInput:"",errorValue:"",showErrorDom :{display:"none"}};
    this.handleEmailchange = this.handleEmailchange.bind(this);
    this.handlepwdchange = this.handlepwdchange.bind(this);
    this.signinFunction = this.signinFunction.bind(this);
    this.handleCreateAccnt = this.handleCreateAccnt.bind(this);
  }
  handleEmailchange(e)
  {
    this.setState({emailInput:e.target.value})
  }
  handlepwdchange(e)
  {
    this.setState({pwdInput:e.target.value})
  }
  render() {
    return (
      <div>
         <div className="loginContainer">
            <div className="signin_modal">
              <div className="modal_header">
                <div className="headerText">Sign in or Create an Account</div>
              </div>
              <div id="errordom" style={this.state.showErrorDom}>{this.state.errorValue}</div>
              <div className="modal_container">
                <form id="loginform" onSubmit={this.signinFunction}>
                  <div className="formContainer"> 
                    <div className="email inputDiv">
                      <input type="text" name="emailInput" placeholder="Email" value={this.state.emailInput} onChange={this.handleEmailchange} maxLength="60" className="in-email" />
                    </div>
                    <div className="pwd inputDiv">
                      <input type="text" name="pwdInput" placeholder="Password" value={this.state.pwdInput} onChange={this.handlepwdchange} maxLength="60" className="in-pwd" />
                    </div>
                    <button type="submit" id="login_submitbtn">Sign In</button>
                  </div>
                </form>
                <div className="createaccnt_container">
                  <div className="dnttxt"> Don't have an account? </div>
                  <div className="createAccnt_link" onClick={this.handleCreateAccnt} > Create an Account</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

  signinFunction(event)
  {
    event.preventDefault();
    var enteredEmailValue = this.state.emailInput;
    var enteredPwdValue = this.state.pwdInput;
    var self = this;
    axios({
        method: 'post',
        url: 'http://localhost:4000/api/rest/login',
        data: {"mailId":enteredEmailValue,"passWord":enteredPwdValue},
        config: { headers: {'Content-Type': 'application/json' }},
        credentials: 'same-origin'
      })
      .then((response) => {
        var responseData = response && response.data ? response.data : "";
        if(responseData && responseData[0] && responseData[0].msg)
        {
          self.setState({errorValue:responseData[0].msg});
          self.setState({showErrorDom:{display:'block'}});
        }
        else if(responseData && responseData.message)
        {
          if(responseData.status && responseData.status == "Success")
          {
            window.location.reload();
          }
          else
          {
            self.setState({errorValue:responseData.message});
            self.setState({showErrorDom:{display:'block'}});
          }
        }
      })
      .catch(function (response) {
         console.log(response);
      });
  }
  handleCreateAccnt()
  {
    ReactDOM.render(<CreateAccount/>,document.getElementById('signContainer'));
  }
}
class CreateAccount extends Component {
  constructor(props)
  {
    super(props);
    this.state = {mailInput:"",userName:"",tagInput:"",pwdInput:"",errorValue:"",showErrorDom :{display:"none"}};
    this.handleUserNamechange = this.handleUserNamechange.bind(this);
    this.handleMailchange = this.handleMailchange.bind(this);
    this.handlePwdchange = this.handlePwdchange.bind(this);
    this.handleTagchange = this.handleTagchange.bind(this);
    this.createAccntfunction = this.createAccntfunction.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
  }
  handleUserNamechange(e)
  {
    this.setState({userName:e.target.value})
  }
  handleMailchange(e)
  {
    this.setState({mailInput:e.target.value})
  }
  handlePwdchange(e)
  {
    this.setState({pwdInput:e.target.value})
  }
  handleTagchange(e)
  {
    this.setState({tagInput:e.target.value})
  }
  backToLogin()
  {
     ReactDOM.render(<Login/>,document.getElementById('signContainer'));
  }

  render() {
    return (
      <div>
         <div className="signupContainer">
            <div className="createAccnt_modal">
              <div className="modal_header">
                <div className="headerText">Create an Account</div>
              </div>
              <div id="errordom" style={this.state.showErrorDom}>{this.state.errorValue}</div>
              <div className="modal_container">
                <form id="signupForm" onSubmit={this.createAccntfunction}>
                  <div className="formContainer"> 
                    <div className="userName inputDiv">
                      <input type="text" name="userName" placeholder="User Name" value={this.state.unameInput} onChange={this.handleUserNamechange} maxLength="60" className="in-uname" />
                    </div>
                    <div className="mailId inputDiv">
                      <input type="text" name="mailInput" placeholder="Mail" value={this.state.mailInput} onChange={this.handleMailchange} maxLength="60" className="in-mailid" />
                    </div>
                    <div className="pwd inputDiv">
                      <input type="text" name="pwdInput" placeholder="Password" value={this.state.pwdInput} onChange={this.handlePwdchange} maxLength="60" className="in-pwd" />
                    </div>
                    <div className="tags inputDiv">
                      <input type="text " name="tagInput" placeholder="Tags" value={this.state.tagInput} onChange={this.handleTagchange} maxLength="60" className="in-tags" />
                    </div>
                    <button type="submit" id="login_submitbtn">Sign Up</button>
                  </div>
                </form>
                <div className="backtoLogin">
                  <div className="btoLogin" onClick={this.backToLogin} > Back to Login </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
  createAccntfunction (event)
  {
    event.preventDefault();
    var enteredEmailValue = this.state.mailInput;
    var enteredPwdValue = this.state.pwdInput;
    var enteredUNameValue = this.state.userName;
    var enteredTagValue = this.state.tagInput;
    var arr  = enteredTagValue.split(',');
    var self = this;
    axios({
      method: 'post',
      url: 'http://localhost:4000/api/rest/createAccount',
      data: {"userName":enteredUNameValue,"mailId":enteredEmailValue,"passWord":enteredPwdValue,"tags":arr},
      config: { headers: {'Content-Type': 'application/json' }},
      credentials: 'same-origin'
    })
    .then((response) => {
      var responseData = response && response.data ? response.data : "";
      if(responseData && responseData[0] && responseData[0].msg)
      {
        self.setState({errorValue:responseData[0].msg});
        self.setState({showErrorDom:{display:'block'}});
      }
      else if(responseData && responseData.message)
      {
        self.setState({errorValue:responseData.message});
        self.setState({showErrorDom:{display:'block'}});
      }
    })
    .catch(function (response) {
       console.log(response);
    });
  }
}  

export default Header;