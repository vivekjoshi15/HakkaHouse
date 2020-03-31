import React, { Component } from 'react';
import { withRouter } from "react-router";
import Select from "react-select";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import { authHeader } from '../_helpers/auth-header';
import CONSTANTS from'../_constants/constants';
import { countryService } from '../_services';

class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleid: 1, 
      firstname: '', 
      lastname: '', 
      username: '',
      password: '', 
      cpassword: '', 
      email: '',  
      phonecode: '', 
      phone: '', 
      country: '', 
      state: '', 
      city: '',
      language: '',
      message:'',
      phonecodes: [],
      countries: [],
      states: [],
      cities: []
    };
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePhoneCode = this.changePhoneCode.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeCity = this.changeCity.bind(this);
  }

  componentDidMount() {
    this.props.setBannerText('New User Sign-in');    
    this.getCountries(null);
    this.getPhoneCodes(null);   
  }

  getCountries = async(inputValue) => {
    await countryService.getCountries(CONSTANTS.COUNTRIES_URL)
      .then((result) => {
        this.setState({countries: result.countries});
      });
  }

  getPhoneCodes = async(inputValue) => {
    await countryService.getPhoneCodes(CONSTANTS.PHONECODE_URL)
      .then((result) => {
        this.setState({phonecodes: result.phonecodes});
      })  
  }

  getStates = (id) => {
    trackPromise(
      countryService.getStates(CONSTANTS.STATES_URL+"/"+id)
        .then((result) => {
          this.setState({states: result.states});
        })    
    );
  }

  getCities = (id) => {
    trackPromise(
      countryService.getCities(CONSTANTS.CITIES_URL+"/"+id)
        .then((result) => {
          this.setState({cities: result.cities});
        })  
    );
  }

  changePhoneCode = async(value) =>{
    this.setState({phonecode: value.phonecode});
  }

  changeCountry = async(value) =>{
    this.setState({country: value.name});
    this.getStates(value.id);
  }

  changeState = async(value) =>{
    this.setState({state: value.name});
    this.getCities(value.id);
  }

  changeCity = async(value) =>{
    this.setState({city: value.name});
  }

  handleBackClick(e) {
    this.props.history.push("login");
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({message: ''});

    if (!this.state.firstname.length) {
      this.setState({message: 'firstname was not submitted'});
      return;
    }
    if (!this.state.lastname.length) {
      this.setState({message: 'lastname was not submitted'});
      return;
    }
    if (!this.state.password.length) {
      this.setState({message: 'password was not submitted'});
      return;
    }
    if (this.state.password !== this.state.cpassword) {
      this.setState({message: 'password and confirm password does not match'});
      return;
    }

    trackPromise(
      fetch(CONSTANTS.SIGNUP_URI, {
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
              result.user.authdata = result.token;
              localStorage.setItem('user', JSON.stringify(result.user));
              this.setState({message: 'Your account created successfully!!!. Please click confirmation email from your inbox.'});
              //this.props.history.push('/profile/view/'+result.user.userid);
            } else {
              this.setState({message: result.error});
            }
          },
          (error) => {
            this.setState({message: error});
          }
      )    
      .catch(err => {
        console.error(err);
        this.setState({message: 'Error logging in please try again'+ err});
    }));
  }

  render() {
    const { t } = this.props;
    const languages = [{name: "Chinese", label: "Chinese"},{name: "English", label: "English"}];

    return (
      <div class="containerContent">
        <div id="contentForm" class="Register">
          <form onSubmit={this.handleSubmit}>
            <div class="row">
              <div class="col">
                <Trans i18nKey='register:main.title'><h2>Create a new account</h2></Trans>
              </div>
            </div>          
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.preflang'><label>preferred language</label></Trans>
              </div>
              <div class="col-8">
                <Select
                  className ="selectbox"
                  classNamePrefix ="selectbox"
                  placeholder={t('register:placeholder.preflang')}
                  name="language"
                  isClearable={true}
                  isSearchable={true}
                  options={languages}
                  defaultValue={[]}
                  required
                  onChange={(value) => { this.setState({language: value.name})}}
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.firstname'><label>first name</label></Trans>
              </div>
              <div class="col-8">
                <input type="text" id="firstname" name="firstname" placeholder={t('register:placeholder.firstname')} maxlength="20" required onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.lastname'><label>last name</label></Trans>
              </div>
              <div class="col-8">
                <input type="text" id="lastname" name="lastname" placeholder={t('register:placeholder.lastname')} maxlength="20" required onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.username'><label>username</label></Trans>
              </div>
              <div class="col-8">
                <input type="text" id="username" name="username" placeholder={t('register:placeholder.username')} maxlength="20" required onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.password'><label>password</label></Trans>
              </div>
              <div class="col-8">
                <input type="password" id="password" name="password" placeholder={t('register:placeholder.password')} maxlength="30" required onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.cpassword'><label>confirm password</label></Trans>
              </div>
              <div class="col-8">
                <input type="password" id="cpassword" name="cpassword" placeholder={t('register:placeholder.cpassword')} maxlength="30" required onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.email'><label>email</label></Trans>
              </div>
              <div class="col-8">
                <input type="email" id="email" name="email" placeholder={t('register:placeholder.email')} maxlength="40" required onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.phone'><label>phone</label></Trans>
              </div>
              <div class="col-8">
                <Select
                      className ="selectbox1"
                      classNamePrefix ="selectbox1"
                      placeholder={t('register:placeholder.phonecode')}
                      name="phonecode"
                      getOptionLabel={option => (option.sortname + ' (+'+option.phonecode+')') }
                      getOptionValue={option => option }
                      isClearable={false}
                      isSearchable={true}
                      options={this.state.phonecodes}
                      required
                      onChange={(value) => { this.changePhoneCode(value); }}
                    />
                <input type="text" id="phone" name="phone" class="phonebox" placeholder={t('register:placeholder.phone')} maxlength="15" onChange={this.handleInputChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.country'><label>country</label></Trans>
              </div>
              <div class="col-8">
                <Select
                      className ="selectbox"
                      classNamePrefix ="selectbox"
                      placeholder={t('register:placeholder.country')}
                      name="country"
                      getOptionLabel={option => option.name }
                      getOptionValue={option => option }
                      isClearable={false}
                      isSearchable={true}
                      options={this.state.countries}
                      required
                      onChange={(value) => { this.changeCountry(value); }}
                    />              
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.state'><label>state</label></Trans>
              </div>
              <div class="col-8">
                <Select
                      className ="selectbox"
                      classNamePrefix ="selectbox"
                      placeholder={t('register:placeholder.state')}
                      name="state"
                      getOptionLabel={option => option.name }
                      getOptionValue={option => option}
                      isClearable={false}
                      isSearchable={true}
                      options={this.state.states}
                      required      
                      onChange={(value) => { this.changeState(value); }}                
                    />  
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <Trans i18nKey='register:main.city'><label>city</label></Trans>
              </div>
              <div class="col-8">
                <Select
                      className ="selectbox"
                      classNamePrefix ="selectbox"
                      placeholder={t('register:placeholder.city')}
                      name="city"
                      getOptionLabel={option => option.name }
                      getOptionValue={option => option}
                      isClearable={false}
                      isSearchable={true}
                      options={this.state.cities}
                      required      
                      onChange={(value) => { this.changeCity(value); }}                
                    />  
              </div>
            </div>
            <div class="row button">
              <div class="col-4">
              </div>
              <div class="col-8">
                <Trans i18nKey='register:main.register'><button type="submit" id="btnLogin" class="button">Register</button></Trans>
                <Trans i18nKey='register:main.back'><button id="btnBack" class="register button" onClick={this.handleBackClick}>Back</button></Trans>
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
export default withRouter(withTranslation('register')(register));