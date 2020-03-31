import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import  CONSTANTS from'../_constants/constants';

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', 
      password: '', 
      message: '',
      isLoading: false
    }
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.setBannerText('Login');
  }

  handleInputChange(e){
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleRegisterClick(e) {
    this.props.history.push("register");
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({message: ''});
    this.setState({isLoading: true});

    if (!this.state.email.length) {
      this.setState({isLoading: false});
      return;
    }
    if (!this.state.password.length) {
      this.setState({isLoading: false});
      return;
    }

    trackPromise(
      fetch(CONSTANTS.LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(
          (result) => {
            if (result.success === true) {        
              this.setState({message: 'Success'});
              result.user.authdata = result.token;//window.btoa(result.user.username + ':' + result.user.password);
              localStorage.setItem('user', JSON.stringify(result.user));
              let user = result.user;
              if(user !== null){
                if(user.city !== null && user.city !== undefined && user.city !== undefined){
                  if(user.city.toString().toLowerCase() === 'toronto')
                    this.props.setBannerTop('./'+user.city.toString().toLowerCase() + '.jpg');
                  else if(user.city.toString().toLowerCase() === 'seattle')
                    this.props.setBannerTop('./'+user.city.toString().toLowerCase() + '.jpg');
                  else if(user.city.toString().toLowerCase() === 'vancouver')
                    this.props.setBannerTop('./'+user.city.toString().toLowerCase() + '.jpg');
                }
              }
              this.props.history.push('/'+result.user.username);
            } else {
              this.setState({message: result.error});
              this.setState({isLoading: false});
            }
          },
          (error) => {
            this.setState({message: error});
            this.setState({isLoading: false});
          }
      )    
      .catch(err => {
        console.error(err);
        this.setState({isLoading: false});
        this.setState({message: 'Error logging in please try again'+ err});
    }));
  }  
  
  render() {
    const { t } = this.props;

    return (      
      <div class="containerContent">
        <div id="contentForm" class="Login">
          <form onSubmit={this.handleSubmit}>
            <div class="row">
              <div class="col">
                <Trans i18nKey='login:title'><h2>Login</h2></Trans>
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <Trans i18nKey='login:username'><label>username</label></Trans>
              </div>
              <div class="col-9">
                <input type="text" id="txtName" name="email" maxlength="40" placeholder={t('login:placeholder.username')} required value={this.state.email} onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <Trans i18nKey='login:password'><label>password</label></Trans>
              </div>
              <div class="col-9">
                <input type="password" id="txtPassword" name="password" maxlength="30" placeholder={t('login:placeholder.password')} required value={this.state.password} onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row button">
              <div class="col-3">
              </div>
              <div class="col-9">  
                <Trans i18nKey='login:login'><button type="submit" id="btnLogin" class="button">Login</button></Trans>     
                <Trans i18nKey='login:register'><button id="btnRegister" class="register button" onClick={this.handleRegisterClick}>Register</button></Trans>
              </div>
            </div>
            <div class="row button">
              <div class="col-3">
              </div>
              <div class="col-9">  
                <Trans i18nKey='login:forget'><Link to={'./forgetpassword'}>forget password?</Link></Trans>
              </div>
            </div>
            <div class="row button error">
              <div class="col-12">
                <span>{this.state.message}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(withTranslation('login')(login));