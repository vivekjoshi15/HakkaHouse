import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';
import Moment from 'react-moment';

import PanelDashboardLeft from '../panel-dashboard-left';
import { authHeader } from '../../_helpers/auth-header';
import  CONSTANTS from'../../_constants/constants';
import { userService, postService } from '../../_services';

import '../dashboard/index.css';

class postsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      message:'',  
      isOwner:false,
      userid: 0, 
      postMessage: '', 
      firstname: '', 
      lastname: '', 
      username: '', 
      profileimage:'',
      users:[],
      user: {},
      posts: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePostModel = this.handlePostModel.bind(this);
    this.handlePost = this.handlePost.bind(this);
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

            this.getAllUserPosts(result.user.userid);              
          }
          else
          {            
            this.props.history.push('/404');
          } 
        })
    );
  }

  getAllUserPosts = (userid) => {
    trackPromise(
      postService.getAllUserPosts(CONSTANTS.GET_POSTS_USERS_URI+'/'+userid)
        .then((result) => {     
          if(result != null && result.posts != null) {
            this.setState({ posts: result.posts });
          }
          else
          {
            this.setState({ message: "No Posts" });            
          }
        })
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handlePostModel = () =>  this.setState({ showModel: !this.state.showModel });

  handlePost = (e) => { 
    this.setState({message: ''});

    if (!this.state.postMessage.length) {
      return;
    }

    const request={
      userid: this.state.userid,
      message: this.state.postMessage,
      isprivate: 0,
      isactive: 1     
    }

    trackPromise(
      fetch(CONSTANTS.CREATE_POST_URI, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: authHeader()
      })
      .then(res => res.json())
      .then(
          (result) => {
            console.log(result);
            if (result.success === true) {        
              this.setState({message: 'Your Post Inserted!!!'});
              this.setState({ showModel: !this.state.showModel });
              this.getAllUserPosts(this.state.userid);  
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
    const { i18n, t } = this.props;

    return (    
      <div id="contentDashboard">
        <div class="row width100">            
            <PanelDashboardLeft user={this.state} page="posts">
            </PanelDashboardLeft>
            <div class="col-7 panelDashboard2 block"> 
              {this.state.isOwner?  
                <div class="row">
                  <div class="col">
                    <div id="createPost" onClick={this.handlePostModel}>Create Post</div>
                  </div>
                </div> 
              :""}              
             <div class="row">
                <div class="col-12">
                  <ul id="postList">
                  {this.state.posts && this.state.posts.map((item) => {
                      return(
                        <li>
                          <div class="date">
                            <Moment format="MMM DD, YYYY">
                                {item.createddate}
                            </Moment>
                          </div>
                          <div>{item.message}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>               
            </div>
            <div class="col panelDashboard3">              
            </div>
        </div>
        { this.state.showModel &&  
          <div class="modelCityWrap">
            <div class="modelCityBack">
            </div> 
            <div class="modelPost"> 
              <form>                         
                <div class="row">
                  <div class="col">                            
                  </div>                
                  <div class="col-1 right">
                    <span class="close" onClick={this.handlePostModel}>X</span>
                  </div>
                </div>                                    
                <div class="row">
                  <div class="col"> 
                    <h2>Create Post</h2>                             
                  </div>       
                </div>                       
                <div class="row">
                  <div class="col"> 
                    <textarea id="postMessage" name="postMessage" class="txtPost" required onChange={this.handleInputChange}></textarea>                   
                  </div>
                </div>                     
                <div class="row">
                  <div class="col"> 
                    <button type="button" id="btnPost" onClick={this.handlePost}>Post</button>                       
                  </div>
                </div>
              </form>
            </div>
           </div>
        }       
      </div>
    );
  }
}
export default withRouter(withTranslation('profile')(postsView));