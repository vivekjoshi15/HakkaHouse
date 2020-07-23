import React, { Component } from 'react';
import { withRouter } from "react-router";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import  CONSTANTS from'../../_constants/constants';
import { userService } from '../../_services';

import PanelDashboardLeft from '../panel-dashboard-left';

import '../dashboard/index.css';

class profileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOwner:false,
      id: 0, 
      user_id: 0, 
      roleId: 2, 
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
      birthday: '', 
      isactive: 1,
      profileimage:'',
      user: {}
    };
  }

  componentDidMount() {
      //this.props.setBannerText('Welcome '+ this.state.firstname + ' ' + this.state.lastname);
    this.props.setBannerText('');
    this.getUser();
  }

  componentDidUpdate() {
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: user });

    trackPromise(
      userService.getByUsername(CONSTANTS.GET_USERNAME_URL+'/'+this.props.match.params.username)
        .then((result) => {    
          if(result != null && result.user != null) {
            const birthday=(result.user.birthday)?result.user.birthday.toString().split('T')[0]: result.user.birthday;

            this.setState({ roleId: result.user.roleId });
            this.setState({ id: result.user.id });
            this.setState({ user_id: result.user.id });
            this.setState({ firstname: result.user.firstname });
            this.setState({ lastname: result.user.lastname });
            this.setState({ email: result.user.email });
            this.setState({ phonecode: result.user.phonecode });
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
            this.setState({ gender: result.user.gender });
            this.setState({ profileimage: (result.user.profileimage !=='' && result.user.profileimage !== undefined && result.user.profileimage !== null)? result.user.profileimage:'' });                    

            if(user != null && result.user.id === user.id){
              this.setState({ isOwner: true});
            }
          }
          else
          {            
            this.props.history.push('/404');
          }
        })
    );
  }

  render() {

    return (       
      <div id="contentDashboard">
        <div class="row width100">
            <PanelDashboardLeft user={this.state} page="viewprofile">
            </PanelDashboardLeft>
            <div class="col-7 panelDashboard2 block">   
              <div id="contentProfile">
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
                    <span class="bold">(+{this.state.phonecode}) {this.state.phone}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">
                    <label><Trans i18nKey='profile:view.address'>address</Trans></label>
                  </div>
                  <div class="col-9">
                    <span class="bold">
                      {(this.state.address)?(this.state.address +","):""}
                      {(this.state.address2)? (" "+this.state.address2+", "):""}
                      <br/>{this.state.city+", "+this.state.state}
                      <br/>{(this.state.country !== null)?this.state.country:""} {(this.state.zipcode !== null && this.state.zipcode !== "null")?(", "+this.state.zipcode):""}
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
            <div class="col panelDashboard3">              
            </div>
        </div>          
      </div>      
    );
  }
}
export default withRouter(withTranslation('profile')(profileView));