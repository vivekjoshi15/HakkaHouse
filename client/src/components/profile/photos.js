import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import PanelDashboardLeft from '../panel-dashboard-left';
import { authHeader } from '../../_helpers/auth-header';
import  CONSTANTS from'../../_constants/constants';
import { userService } from '../../_services';

import '../dashboard/index.css';

class profilePhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'',  
      isOwner:false,
      userid: 0, 
      firstname: '', 
      lastname: '', 
      username: '', 
      profileimage:'',
      users:[],
      user: {}
    };
  }

  componentDidMount() {
    //this.props.setBannerText(this.props.match.params.city + ' Dashboard');   
    this.props.setBannerText(' '); 
    this.getUser();
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: user });

    trackPromise(
      userService.getByUsername(CONSTANTS.GET_USERNAME_URL+'/'+this.props.match.params.username)
        .then((result) => {     
          if(result != null && result.user != null) {
            this.setState({ userid: result.user.userid });
            this.setState({ firstname: result.user.firstname });
            this.setState({ lastname: result.user.lastname });
            this.setState({ username: result.user.username });
            this.setState({ profileimage: (result.user.profileimage !=='' && result.user.profileimage !== undefined && result.user.profileimage !== null)? result.user.profileimage:'' });  

            if(user != null && result.user.userid === user.userid){
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
    const { i18n, t } = this.props;

    return (    
      <div id="contentDashboard">
        <div class="row width100">            
            <PanelDashboardLeft user={this.state} page="photos">
            </PanelDashboardLeft>
            <div class="col-7 panelDashboard2 block">   
              <div class="row">
                <div class="col">
                </div>
              </div>               
             <div class="row">
                <div class="col-12">
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
export default withRouter(withTranslation('profile')(profilePhotos));