import React, { Component } from 'react';
import logo from './logo2.png';
import ReactDOM from 'react-dom';
import './Header.css';
import axios from 'axios';
class Header extends Component {
  render() {
    return (
      <div>
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
          </div>
        </div>
        <div id = "signContainer"></div>
      </div>
    );
  }
  handleLogin() {
      ReactDOM.render(<Login/>,document.getElementById('signContainer'));
  };
 
}
class Login extends Component {
  constructor(props)
  {
    super(props);
    this.state = {emailInput:"",pwdInput:""};
    this.handleEmailchange = this.handleEmailchange.bind(this);
    this.handlepwdchange = this.handlepwdchange.bind(this);
    this.signinFunction = this.signinFunction.bind(this);
  }
  handleEmailchange(e)
  {
    this.setState({emailInput:e.target.value})
  }
  handlepwdchange(e)
  {
    this.setState({pwdInput:e.target.value})
  }
  signinFunction(event)
  {
    event.preventDefault();
    var enteredEmailValue = this.state.emailInput;
    var enteredPwdValue = this.state.pwdInput;
    axios({
      method: 'post',
      url: 'http://localhost:4000/api/rest/login',
      data: {"mailId":enteredEmailValue,"passWord":enteredPwdValue},
      config: { headers: {'Content-Type': 'application/json' }}
      })
      .then(function (response) {
        console.log(response);
        var paragraph = document.getElementById("errordom");
        paragraph.value="";
        if(response && response.data && response.data[0] && response.data[0].msg)
        {
         var manipulatedText = response.data[0].msg;
        }
        var text = document.createTextNode(manipulatedText);
        paragraph.appendChild(text);
        paragraph.style.display = 'block';
      })
      .catch(function (response) {
         console.log(response);
      });
    console.log(this.state.emailInput);
  }
  render() {
    return (
      <div>
         <div className="loginContainer">
            <div className="signin_modal">
              <div className="modal_header">
                <div className="headerText">Sign in or Create an Account</div>
              </div>
              <div id="errordom"></div>
              <div className="modal_container">
                <form id="loginform" onSubmit={this.signinFunction}>
                  <div className="formContainer"> 
                    <div className="email">
                      <input type="text" name="emailInput" placeholder="Email" value={this.state.emailInput} onChange={this.handleEmailchange} maxLength="60" className="in-email" />
                    </div>
                    <div className="pwd">
                      <input type="text" name="pwdInput" placeholder="Password" value={this.state.pwdInput} onChange={this.handlepwdchange} maxLength="60" className="in-pwd" />
                    </div>
                    <button type="submit" id="login_submitbtn">Sign In</button>
                  </div>
                </form>
                <div className="createaccnt_container">
                  <div className="dnttxt"> Don't have an account? </div>
                  <div className="createAccnt_link" onClick={this.handleCreateAccount} > Create an Account</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
export default Header;