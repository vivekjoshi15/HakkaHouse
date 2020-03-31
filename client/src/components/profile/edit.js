import React, { Component } from 'react';
import { withRouter } from "react-router";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import PanelDashboardLeft from '../panel-dashboard-left';
import { authHeader } from '../../_helpers/auth-header';
import  CONSTANTS from'../../_constants/constants';
import { userService, countryService } from '../../_services';

import "react-datepicker/dist/react-datepicker.css";

class profileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOwner:false,
      userid: 0, 
      roleid: 1, 
      message:'', 
      firstname: '', 
      lastname: '', 
      username: '', 
      password: '', 
      cpassword: '', 
      email: '', 
      phonecode: '', 
      phone: '', 
      address: '', 
      address2: '', 
      country: '', 
      state: '', 
      city: '',
      zipcode: '',
      language: '',
      gender: '', 
      birthday: new Date(), 
      isactive: 1,
      profileimage:'',
      startdate: new Date(), 
      user: {},
      phonecodes: [],
      countries: [],
      states: [],
      cities: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changePhoneCode = this.changePhoneCode.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.props.setBannerText(' ');
    this.getUser();
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: user });

    trackPromise(
      userService.getById(CONSTANTS.GET_USER_URL+'/'+this.props.match.params.userId)
        .then((result) => {
          if(result != null && result.user != null) {
            this.setState({ userid: result.user.userid });

            if(user != null && result.user.userid !== user.userid){
              this.props.history.push('/404?message=not authroized to view this page');
            }

            const birthday=(result.user.birthday)?new Date(result.user.birthday.toString().split('T')[0]): result.user.birthday;

            this.setState({ firstname: result.user.firstname });
            this.setState({ lastname: result.user.lastname });
            this.setState({ email: result.user.email });
            this.setState({ phone: result.user.phone });
            this.setState({ username: result.user.username });
            this.setState({ address: result.user.address });
            this.setState({ address2: result.user.address2 });
            this.setState({ state: result.user.state });
            this.setState({ country: result.user.country });
            this.setState({ city: result.user.city });
            this.setState({ zipcode: result.user.zipcode });
            this.setState({ language: result.user.language });
            this.setState({ birthday: birthday });
            this.setState({ startdate: (result.user.birthday)? new Date(result.user.birthday.toString().split('T')[0]): new Date() });
            this.setState({ gender: result.user.gender });
            this.setState({ profileimage: result.user.profileimage }); 

            if(user != null && result.user.userid === user.userid){
              this.setState({ isOwner: true});
            }

            this.getCountries(null);
            this.getPhoneCodes(null);   
            this.getStates(231); 
          }
          else
          {            
            this.props.history.push('/404');
          }       
        })
    );
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

  handleChange = date => {
    if(date){
      var day = date.getDate();
      var monthIndex = date.getMonth()+1;
      var year = date.getFullYear();

      const dt= monthIndex + '/' + day + '/' + year;
      
       this.setState({ birthday: dt });
       this.setState({ startdate: date });
    }
  };

  handleCancel(event) {    
    this.props.history.push('/profile/'+this.state.username);
  }

  handleInputChange(event) {
    const target = event.target;
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
      return;
    }
    if (!this.state.lastname.length) {
      return;
    }
    if (!this.state.email.length) {
      return;
    }
    if (this.state.password !== null && this.state.password !== '' && this.state.password.length !== 0 && this.state.password !== this.state.cpassword) {
      this.setState({message: 'password and confirm password does not match'});
      return;
    }
    if(this.state.password.length === 0 || this.state.password === ''){
      this.setState({password: this.state.user.password});
    }

    trackPromise(
      fetch(CONSTANTS.UPDATE_URI + '/' + this.state.user.userid, {
        method: 'PUT',
        body: JSON.stringify(this.state),
        headers: authHeader()
      })
      .then(res => res.json())
      .then(
          (result) => {
            if (result.success === true) {        
              this.setState({message: 'Your Profile Updated!!!'});
              if(this.state.city !== null && this.state.city !== undefined && this.state.city !== undefined){
                if(this.state.city.toString().toLowerCase() === 'toronto')
                  this.props.setBannerTop('./'+this.state.city.toString().toLowerCase() + '.jpg');
                else if(this.state.city.toString().toLowerCase() === 'seattle')
                  this.props.setBannerTop('./'+this.state.city.toString().toLowerCase() + '.jpg');
                else if(this.state.city.toString().toLowerCase() === 'vancouver')
                  this.props.setBannerTop('./'+this.state.city.toString().toLowerCase() + '.jpg');
              }
              this.props.history.push('/profile/'+this.state.user.username);
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
    const languages= [{name: "Chinese", label: "Chinese"}, {name: "English", label: "English"}];
    const selLanguage={name: this.state.language, label: this.state.language};
    const genders= [{name: "Male", label: "Male"}, {name: "Female", label: "Female"}];
    const selGender={name: this.state.gender, label: this.state.gender};
    const selCountry={name: this.state.country, label: this.state.country};
    const selState={name: this.state.state, label: this.state.state};
    const selCity={name: this.state.city, label: this.state.city};
    const selPhoneCode={phonecode: this.state.phonecode, label: this.state.phonecode};

    return (
      <div id="contentDashboard">
        <div class="row width100">            
            <PanelDashboardLeft user={this.state} page="editprofile">
            </PanelDashboardLeft>
            <div class="col panelDashboard2 block">  
              <div id="contentProfile" class="Register">
                <form onSubmit={this.handleSubmit}>
                  <div class="row">
                    <div class="col">
                      <h2>Update Profile</h2>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <div class="row">
                        <div class="col-4">
                          <label>first name</label>
                        </div>
                        <div class="col-8">
                          <input type="text" id="firstname" name="firstname" placeholder="first name" value={this.state.firstname} maxlength="20" required onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>last name</label>
                        </div>
                        <div class="col-8">
                          <input type="text" id="lastname" name="lastname" placeholder="last name" value={this.state.lastname} maxlength="20" required onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>username</label>
                        </div>
                        <div class="col-8">
                          <input type="text" id="username" name="username" placeholder="username" value={this.state.username} maxlength="20" required onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>password</label>
                        </div>
                        <div class="col-8">
                          <input type="password" id="password" name="password" placeholder="password" maxlength="30" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>confirm password</label>
                        </div>
                        <div class="col-8">
                          <input type="password" id="cpassword" name="cpassword" placeholder="confirm password" maxlength="30" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>email</label>
                        </div>
                        <div class="col-8">
                          <input type="email" id="email" name="email" placeholder="email" value={this.state.email} maxlength="40" required onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>phone</label>
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
                            value={selPhoneCode}
                            required
                            onChange={(value) => { this.changePhoneCode(value); }}
                          />
                          <input type="text" id="phone" name="phone" class="phonebox" placeholder="phone" value={this.state.phone} maxlength="15" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>gender</label>
                        </div>
                        <div class="col-8">
                          <Select
                            className ="selectbox"
                            classNamePrefix ="selectbox"
                            placeholder="select gender"
                            name="gender"
                            isClearable={false}
                            isSearchable={true}
                            options={genders}
                            value={selGender}
                            onChange={(value) => { this.setState({gender: value.label});}}
                          />
                        </div>
                      </div>  

                      <div class="row">
                        <div class="col-4">
                          <label>birthday</label>
                        </div>
                        <div class="col-8">
                          <DatePicker
                            placeholderText="select birthday"
                            showPopperArrow={false}
                            dateFormat="MM/d/yyyy"
                            isClearable
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                            selected={this.state.startdate}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div> 
                    </div>
                    <div class="col-6">
                      <div class="row">
                        <div class="col-4">
                          <label>address</label>
                        </div>
                        <div class="col-8">
                          <input type="text" id="address" name="address" placeholder="address" value={this.state.address} maxlength="80" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>address 2</label>
                        </div>
                        <div class="col-8">
                          <input type="text" id="address2" name="address2" placeholder="address 2" value={this.state.address2} maxlength="80" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>country</label>
                        </div>
                        <div class="col-8">
                          <Select
                            className ="selectbox"
                            classNamePrefix ="selectbox"
                            placeholder="select country"
                            name="country"
                            getOptionLabel={option => option.name }
                            getOptionValue={option => option }
                            isClearable={false}
                            isSearchable={true}
                            options={this.state.countries}
                            value={selCountry}
                            required
                            onChange={(value) => { this.changeCountry(value); }}
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>state</label>
                        </div>
                        <div class="col-8"> 
                          <Select
                            className ="selectbox"
                            classNamePrefix ="selectbox"
                            placeholder="select state"
                            name="state"
                            getOptionLabel={option => option.name }
                            getOptionValue={option => option}
                            isClearable={false}
                            isSearchable={true}
                            options={this.state.states}
                            value={selState}
                            required      
                            onChange={(value) => { this.changeState(value); }}                
                          />  
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>city</label>
                        </div>
                        <div class="col-8">
                          <Select
                            className ="selectbox"
                            classNamePrefix ="selectbox"
                            placeholder="select city"
                            name="city"
                            getOptionLabel={option => option.name }
                            getOptionValue={option => option}
                            isClearable={false}
                            isSearchable={true}
                            options={this.state.cities}
                            value={selCity}
                            required      
                            onChange={(value) => { this.changeCity(value); }}                
                          />  
                         </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <label>zipcode</label>
                        </div>
                        <div class="col-8">
                          <input type="text" id="zipcode" name="zipcode" placeholder="zipcode" value={this.state.zipcode} maxlength="30" onChange={this.handleInputChange} />
                        </div>
                      </div>          
                      <div class="row">
                        <div class="col-4">
                          <label>preferred language</label>
                        </div>
                        <div class="col-8">
                          <Select
                            className ="selectbox"
                            classNamePrefix ="selectbox"
                            placeholder="select preferred language"
                            name="language"
                            isClearable={false}
                            isSearchable={true}
                            options={languages}
                            value={selLanguage}
                            onChange={(value) => { this.setState({language: value.label});}}
                          />
                        </div>
                      </div> 
                    </div>            
                  </div>
                  <div class="row button center">
                    <div class="col-12">
                      <Trans i18nKey='register:main.update'><button type="submit" id="btnRegister" class="button">Update Profile</button></Trans>
                      <Trans i18nKey='register:main.cancel'><button id="btnCancel" class="register button" onClick={this.handleCancel}>Cancel</button></Trans>
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
        </div>          
      </div>      
    );
  }
}
export default withRouter(withTranslation('profileedit')(profileEdit));