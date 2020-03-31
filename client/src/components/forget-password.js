import React, { Component } from 'react';
import { withRouter } from "react-router";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import  CONSTANTS from'../_constants/constants';

class forgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
      isLoading: false
    }
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.setBannerText('Forget Password');
  }

  handleInputChange(e){
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleBackClick(e) {
    this.props.history.push("login");
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({message: ''});
    this.setState({isLoading: true});

    if (!this.state.email.length) {
      this.setState({isLoading: false});
      return;
    }

    trackPromise(
      fetch(CONSTANTS.FORGET_PASSWORD_URL, {
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
              this.setState({message: 'email send with password successfully'});
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
                <Trans i18nKey='forgetpassword:title'><h2>Forget Password</h2></Trans>
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <Trans i18nKey='forgetpassword:username'><label>username/email</label></Trans>
              </div>
              <div class="col-9">
                <input type="text" id="txtName" name="email" maxlength="40" placeholder={t('forgetpassword:pusername')} required value={this.state.email} onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row button">
              <div class="col-3">
              </div>
              <div class="col-9">  
                <Trans i18nKey='forgetpassword:submit'><button type="submit" id="btnLogin" class="button">Submit</button></Trans>     
                <Trans i18nKey='forgetpassword:back'><button id="btnBack" class="register button" onClick={this.handleBackClick}>Back</button></Trans>
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

export default withRouter(withTranslation('forgetpassword')(forgetPassword));