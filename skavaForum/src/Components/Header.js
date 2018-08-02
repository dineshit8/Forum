import React, { Component } from 'react';
import logo from './logo2.png';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './Header.css';
import Home from './Home';
import PostQuestion from './PostQuestion';
import Profile from './Profile';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import Search from './Search';
import Qa from './Qapage';
import ResetPassword from './ResetpasswordForm';

class Header extends Component {
  constructor(props)
  {
    super(props);
    this.state = {showMask : {display:"none"} , maskFlag : false , signinshowHide : {display:"none"} , userId : Cookies.get('userId'), searchTerm: ""};
    this.maskFunction = this.maskFunction.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.CheckSession = this.CheckSession.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.getSearchTerm = this.getSearchTerm.bind(this);
  }
  getSearchTerm(e)
  {
    this.setState({searchTerm:e.target.value})
  }
  render() {
    return (<Router>
      <div>
      <div className="mask" onClick={this.maskFunction} style={this.state.showMask}></div>
        <div className="header">
          <div className="leftcontent">
            <div className="h-icon"><Link to="/"><img className="h-image-icon" src={logo}></img></Link></div>
              <form id="search" className="s-bar" onSubmit={this.handleSearch}>
                <div className="searchBar">
                  <input type="text" name="searchinput" placeholder="Search" maxLength="60" className="in-search" onChange={this.getSearchTerm} />
                </div>
              </form>
          </div>
          <div className="rightContent">
            <div className="loginParent">
            { this.state.userId ? 
              <div className="profile"><Link to="/Profile">Profile</Link></div>
              : 
              <div className="login" onClick={this.handleLogin}> Login </div>
            }
            </div>
            { this.state.userId ? 
              <div className="QuestionParent">
                <div className="askQuestion">
                <Link to="/PostQuestion">Ask Question</Link>
                </div>
              </div>
            : ""}
          </div>
        </div>
        <div id = "signContainer" style={this.state.signinshowHide}></div>
          <div className="content" id="searchResults">
            <Route exact path="/" component={Home}/>
            <Route path="/Profile" component={Profile}/>
            <Route path="/PostQuestion" component={PostQuestion}/>
            <Route path="/Search" component={Search}/>
            <Route path="/reset" component={ResetPassword}/>
            <Route path="/qa" component={Qa}/>
          </div>
      </div>
      </Router>);
  }
  CheckSession(a)
  {
    console.log(a)
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
  handleSearch(event) {
    event.preventDefault();
    var searchTerm = this.state.searchTerm;
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
        //<Search searchData = {self.state.data}/>;
        ReactDOM.render(<Search searchData = {self.state.data}/>,document.getElementById('searchResults'));
      })
      .catch(function (response) {
         console.log(response);
      });
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
                      <input type="password" name="pwdInput" placeholder="Password" value={this.state.pwdInput} onChange={this.handlepwdchange} maxLength="60" className="in-pwd" />
                    </div>
                    <button type="submit" id="login_submitbtn">Sign In</button>
                  </div>
                </form>
                <div className="createaccnt_container">
                  <div className="dnttxt"> Don't have an account? </div>
                  <div className="createAccnt_link" onClick={this.handleCreateAccnt} > Create an Account</div>
                </div>
                <div className="orLabel"> Or </div>
                <div className="forgot_pwd">
                    <div className = "forgot_pwdTxt"> Forgot your Password ? </div>
                    <div className = "forgot_pwdHere" onClick = {this.handleForgotPwd}> Click Here </div>
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
          if(responseData.status && responseData.status === "Success")
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
  handleForgotPwd()
  {
    ReactDOM.render(<ForgotPwd/>,document.getElementById('signContainer'));
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
                      <input type="password" name="pwdInput" placeholder="Password" value={this.state.pwdInput} onChange={this.handlePwdchange} maxLength="60" className="in-pwd" />
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

class ForgotPwd extends Component
{
  constructor(props)
  {
      super(props);
      this.state = {emailValue : "",showErrorDom :{display:"none"} , errorValue : ""};
      this.forgotPwdfunction = this.forgotPwdfunction.bind(this);
      this.handlemail = this.handlemail.bind(this);
  }
  handlemail(e)
  {
    this.setState({emailValue : e.target.value});
  }
  render()
  {
    return(
      <div>
          <div className="forgeotPwdForm">
            <div className="forgotPwd_model">
              <div className="modal_header">
                <div className="headerText">Forgot Password Form</div>
              </div>
              <div id="errordom" style={this.state.showErrorDom}>{this.state.errorValue}</div>
              <div className="modal_container">
                <form id="forgotpwd_form" onSubmit={this.forgotPwdfunction}>
                  <div className="pwdResetformContainer"> 
                    <div className="emailid inputDiv">
                      <input type="text" name="email" placeholder="Email" value={this.state.emailValue} onChange={this.handlemail} maxLength="60" className="in-email" />
                    </div>
                  </div>
                  <button type="submit" id="forgotpwd_button">Send Email</button>
                </form>
              </div>
            </div>
          </div>
       </div>
    );
  }
  forgotPwdfunction(event)
  {
    event.preventDefault();
    var emailValue = this.state.emailValue;
    var _self = this;
    axios({
      method: 'post',
      url: 'http://localhost:4000/api/rest/forgotPassword',
      data: {"mailId":emailValue},
      config: { headers: {'Content-Type': 'application/json' }},
      credentials: 'same-origin'
      })
      .then(function (response) {
          if(response && response.data && response.data.status && response.data.status == "success")
          {
            window.location.reload();
          }
          else
          {
            var responseData = response && response.data ? response.data : "";
            if(responseData && responseData.message)
            _self.setState({errorValue: responseData.message});
            _self.setState({showErrorDom:{display:'block'}});
          }
      })
      .catch(function (response) {
          //handle error
          console.log(response);
      });
  }
}

export default Header;