import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withTranslation, Trans } from 'react-i18next';

class PanelDashboardLeft extends Component {

  render() {
    return (
      <div class="col-2 panelDashboard1"> 
        <div class="row">
          <div class="col">
            <h3>{this.props.user.firstname} {this.props.user.lastname}</h3>
          </div>
        </div>    
        <div class="row">
          <div class="col">   
            {(this.props.user.profileimage !=='' )?<img src={this.props.user.profileimage}  alt="" class="profileimage" />:<img src="./blank-profile.jpg"  alt="" class="profileimage" />}
            {this.props.user.isOwner?<div class="title">(<Link to={'/profile/image/'+this.props.user.user_id}><Trans i18nKey='profile:view.update'>update image</Trans></Link>)</div>:""}
          </div>
        </div>   
        <div class="row">
          <div class="col leftLinks">
            <ul>
              {this.props.user.isOwner?<li className={`${this.props.page === 'editprofile'?"sel":""}`}><Link to={'/profile/edit/'+this.props.user.user_id}><Trans i18nKey='profile:view.edit'>edit profile</Trans></Link></li>:""}
              <li className={`${this.props.page === 'posts'?"sel":""}`}><Link to={'/'+this.props.user.username}><Trans i18nKey='profile:view.myposts'>Timeline</Trans></Link></li>
              <li className={`${this.props.page === 'viewprofile'?"sel":""}`}><Link to={'/profile/'+this.props.user.username}><Trans i18nKey='profile:view.about'>About</Trans></Link></li>
              <li className={`${this.props.page === 'photos'?"sel":""}`}><Link to={'/profile/photos/'+this.props.user.username}><Trans i18nKey='profile:view.photos'>Photos</Trans></Link></li>
              <li className={`${this.props.page === 'messages'?"sel":""}`}><Link to={'/profile/messages/'+this.props.user.username}><Trans i18nKey='profile:view.messages'>Messages</Trans></Link></li>
            </ul>
          </div>
        </div>           
      </div>
    );
  }
}
export default withRouter(withTranslation('profile')(PanelDashboardLeft));