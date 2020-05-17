import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import  CONSTANTS from'../../_constants/constants';
import { userService } from '../../_services';

class postView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 0, 
      role_id: 1, 
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
      birthday: '', 
      isactive: 1,
      profileimage:'',
      user: {}
    };
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
            this.setState({ user_id: result.user.id });
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
            this.setState({ birthday: result.user.birthday });
            this.setState({ gender: result.user.gender });
            this.setState({ profileimage: result.user.profileimage });          
        })
    );
  }

  render() {

    return (
      <div id="contentProfile">
        <div class="row">
            <div class="col-3">
              <div class="row">
                <div class="col">
                  <img src="./blank-profile.jpg"  alt="" class="profileimage" />
                  <div class="title">(<Link to={'/profile/image/'+this.state.user_id}><Trans i18nKey='profile:view.update'>update image</Trans></Link>)</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="title">&nbsp;</label>
                </div>
              </div>      
              <div class="row">
                <div class="col">
                  <label class="title"><Trans i18nKey='profile:view.activities'>ACTIVITIES</Trans></label>
                </div>
              </div>              
              <div class="row">
                <div class="col">                  
                  <div><Link to={'/post/'+this.state.user_id}><Trans i18nKey='profile:view..myposts'>My Posts</Trans></Link></div>
                  <div><Link to={'/hobbies/'+this.state.user_id}><Trans i18nKey='profile:view.myhobbies'>My Hobbies</Trans></Link></div>
                  <div><Link to={'/work/'+this.state.user_id}><Trans i18nKey='profile:view.mywork'>My Work</Trans></Link></div>
                  <div><Link to={'/interests/'+this.state.user_id}><Trans i18nKey='profile:view.interests'>My Interests</Trans></Link></div>
                </div>
              </div>
            </div>
            <div class="col-9">
              <div class="row">
                <div class="col">
                  <h2>{this.state.firstname} {this.state.lastname} (<Link to={'/profile/edit/'+this.state.user_id}><Trans i18nKey='profile:view.edit'>edit profile</Trans></Link>)</h2>
                </div>
              </div> 
              <div class="row">
                <div class="col-12">
                  <label class="title"><Trans i18nKey='profile:view.contactinfo'>CONTACT INFORMATION</Trans></label>
                </div>
              </div>
              <div class="row">
                <div class="col-3">
                  <label><Trans i18nKey='profile:view.email'>email</Trans></label>
                </div>
                <div class="col-9">
                  <span class="bold"><a href="{'mailto:'+this.state.email}">{this.state.email}</a></span>
                </div>
              </div>
              <div class="row">
                <div class="col-3">
                  <label><Trans i18nKey='profile:view.phone'>phone</Trans></label>
                </div>
                <div class="col-9">
                  <span class="bold">{this.state.phone}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-3">
                  <label><Trans i18nKey='profile:view.address'>address</Trans></label>
                </div>
                <div class="col-9">
                  <span class="bold">
                      {this.state.address}, 
                      {(this.state.address2)? " "+this.state.address2+", ":""}
                      <br/>{this.state.city+", "+this.state.state}
                      <br/>{this.state.country+", "+this.state.zipcode}
                  </span>
                </div>
              </div>     
              <div class="row">
                <div class="col-12">
                  &nbsp;
                </div>
              </div>   
              <div class="row">
                <div class="col-12">
                  <label class="title"><Trans i18nKey='profile:view.basicinfo'>BASIC INFORMATION</Trans></label>
                </div>
              </div>       
              <div class="row">
                <div class="col-3">
                  <label><Trans i18nKey='profile:view.gender'>gender</Trans></label>
                </div>
                <div class="col-9">
                  <span class="bold">{this.state.gender}</span>
                </div>
              </div>       
              <div class="row">
                <div class="col-3">
                  <label><Trans i18nKey='profile:view.birthday'>birthday</Trans></label>
                </div>
                <div class="col-9">
                  <span class="bold">{this.state.birthday}</span>
                </div>
              </div>       
              <div class="row">
                <div class="col-3">
                  <label><Trans i18nKey='profile:view.preflang'>preferred language</Trans></label>
                </div>
                <div class="col-9">
                  <span class="bold">{this.state.language}</span>
                </div>
              </div> 
            </div>
        </div>          
      </div>
    );
  }
}
export default withRouter(withTranslation('profile')(postView));