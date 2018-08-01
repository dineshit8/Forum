import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
class ResetPassword extends Component {
    constructor(props)
    {
        super(props);
        this.state = {pwd : "" , RenterPwd : ""};
        this.handleResetPwd = this.handleResetPwd.bind(this);
        this.handlePwd = this.handlePwd.bind(this);
        this.handleReenterPwd = this.handleReenterPwd.bind(this);
    }
    handlePwd(e)
    {
        this.setState({pwd : e.target.value})
    }
    handleReenterPwd(e)
    {
        this.setState({RenterPwd : e.target.value})
    }
    render() {
        return (
            <div>
                <h2 className="sub-head">Reset Password</h2>  
                    <div className="sub-main">      
                        <form id="resetPassword" onSubmit={this.handleResetPwd}>  
                        <span className="senddata"></span><br/><br/>  
                        <input placeholder="Enter Password" name="password" className="password" type="password" required="" onChange ={this.handlePwd} /><br/><br/>  
                        <input placeholder="Confirm Password" name="confirmpassword" className="confirmpassword" type="password" required="" onChange={this.handleReenterPwd}/><br/><br/>  
                        <input type="submit" name ="submit" value="RESET PASSWORD"/>  
                        </form>  
                     </div>  
             </div>
        );
    }
    handleResetPwd(event)
    {
        event.preventDefault();
        var newPwd = this.state.pwd;
        var reenteredPwd = this.state.RenterPwd;
        var self = this;
        if(window.location.href && window.location.href.indexOf("reset") >=0 )
        {
            self.token = window.location.href.split("reset/").pop();
        }
        if(newPwd == reenteredPwd)
        {
            axios({
                method: 'post',
                url: 'http://localhost:4000/reset/updatePassword',
                data: {"PassWord":newPwd,"token":self.token},
                config: { headers: {'Content-Type': 'application/json' }}
                })
                .then(function (response) {
                  if(response && response.data && response.data.status && response.data.status == "success")
                  {
                    window.alert("Password Changed Successfully !.  Kindly login")
                    window.location.reload();
                  }
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
    }
}
export default ResetPassword;