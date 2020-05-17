import React, { Component } from 'react';
import { withRouter } from "react-router";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { trackPromise } from 'react-promise-tracker';

import { authHeader } from '../../_helpers/auth-header';
import  CONSTANTS from'../../_constants/constants';
import { userService } from '../../_services';

import "react-datepicker/dist/react-datepicker.css";

class postEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      user_id: 0, 
      role_id: 2, 
      message:'', 
      firstname: '', 
      lastname: '', 
      username: '', 
      password: '', 
      cpassword: '', 
      email: '', 
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
      user: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('user')) {
      this.setState({ user: JSON.parse(localStorage.getItem('user')) });
      this.getUser();
    }
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user'));

    trackPromise(
      userService.getById(CONSTANTS.GET_USER_URL+'/'+user.id)
        .then((result) => {  
          this.fillUser(result.user);
        })
    );
  }

  fillUser = (user) =>{
    this.setState({ user_id: user.id });
    this.setState({ firstname: user.firstname });
    this.setState({ lastname: user.lastname });
    this.setState({ email: user.email });
    this.setState({ phone: user.phone });
    this.setState({ username: user.username });
    this.setState({ address: user.address });
    this.setState({ address2: user.address2 });
    this.setState({ state: user.state });
    this.setState({ country: user.country });
    this.setState({ city: user.city });
    this.setState({ zipcode: user.zipcode });
    this.setState({ language: user.language });
    this.setState({ birthday: (user.birthday)? new Date(user.birthday): user.birthday });
    this.setState({ startdate: (user.birthday)? new Date(user.birthday): new Date() });
    this.setState({ gender: user.gender });
    this.setState({ profileimage: user.profileimage });        
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

  handleCancel = (e) => {
    this.props.history.push('/profile/view/'+this.state.user.user_id);
  }

  handleInputChange = (e) => {
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
      return;
    }
    if (!this.state.lastname.length) {
      return;
    }
    if (!this.state.email.length) {
      return;
    }
    if (this.state.password.length !== 0 && this.state.password !== this.state.cpassword) {
      this.setState({message: 'password and confirm password does not match'});
      return;
    }
    if(this.state.password.length === 0 || this.state.password === ''){
      this.setState({password: this.state.user.password});
    }

    trackPromise(
      fetch(CONSTANTS.UPDATE_URI + '/' + this.state.user.user_id, {
        method: 'PUT',
        body: JSON.stringify(this.state),
        headers: authHeader()
      })
      .then(res => res.json())
      .then(
          (result) => {
            if (result.success === true) {        
              this.setState({message: 'Your Profile Updated!!!'});
              this.props.history.push('/profile/view/'+this.state.user.user_id);
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
    const languages= [{name: "Chinese", label: "Chinese"}, {name: "English", label: "English"}];
    const selLanguage={name: this.state.language, label: this.state.language};
    const genders= [{name: "Male", label: "Male"}, {name: "Female", label: "Female"}];
    const selGender={name: this.state.gender, label: this.state.gender};
    const selCountry={name: this.state.country, label: this.state.country};

    return (
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
                  <input type="text" id="phone" name="phone" placeholder="phone" value={this.state.phone} maxlength="15" onChange={this.handleInputChange} />
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <label>gender</label>
                </div>
                <div class="col-8">
                  <Select
                    placeholder="select gender"
                    name="gender"
                    isClearable={true}
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
                    placeholder="select country"
                    name="country"
                    isClearable={true}
                    isSearchable={true}
                    value={selCountry}
                    required
                    onChange={(value) => { this.setState({country: value.label});}}
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <label>state</label>
                </div>
                <div class="col-8">
                  <input type="text" id="state" name="state" placeholder="state" value={this.state.state} maxlength="30" onChange={this.handleInputChange} />
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <label>city</label>
                </div>
                <div class="col-8">
                  <input type="text" id="city" name="city" placeholder="city" value={this.state.city} maxlength="30" onChange={this.handleInputChange} />
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
                    placeholder="select preferred language"
                    name="language"
                    isClearable={true}
                    isSearchable={true}
                    options={languages}
                    value={selLanguage}
                    onChange={(value) => { this.setState({language: value.label});}}
                  />
                </div>
              </div>  
              <div class="row">
                <div class="col-4">
                  <label>profile image</label>
                </div>
                <div class="col-8">
                  <input type="file" id="profileimage" name="profileimage" placeholder="Profile Image" onChange={this.handleInputChange} />
                </div>
              </div>
            </div>            
          </div>
          <div class="row button center">
            <div class="col-12">
              <input type="submit" id="btnRegister" value="Update Profile" />
              <input type="button" id="btnCancel" value="Cancel" onClick={this.handleCancel} />
            </div>
          </div>          
          <div class="row button error">
            <div class="col-12">
              <span>{this.state.message}</span>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default withRouter(postEdit);