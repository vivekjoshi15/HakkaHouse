import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';
import Moment from 'react-moment';

import PanelDashboardLeft from '../panel-dashboard-left';
import { authHeader } from '../../_helpers/auth-header';
import  CONSTANTS from'../../_constants/constants';
import { userService, messageService } from '../../_services';

import '../dashboard/index.css';

class profileMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'',  
      isOwner:false,
      showAddMessage: false,
      userId: 0, 
      senderId: 0, 
      firstname: '', 
      lastname: '', 
      username: '', 
      profileimage:'',
      users:[],
      user: {},
      messages: [],
      messageDesc:'',
      id: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePostMessage = this.handlePostMessage.bind(this);
    this.handleMessage=this.handleMessage.bind(this);
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
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
            this.setState({ userId: result.user.id });
            this.setState({ firstname: result.user.firstname });
            this.setState({ lastname: result.user.lastname });
            this.setState({ username: result.user.username });
            this.setState({ profileimage: (result.user.profileimage !=='' && result.user.profileimage !== undefined && result.user.profileimage !== null)? result.user.profileimage:'' });  
            this.setState({ senderId: user.id}); 

            if(user != null && result.user.id === user.id){
              this.setState({ isOwner: true});
              this.getAllUserMessages(result.user.id);   
            }
            else
            {              
                this.setState({ showAddMessage: true });
            }              
          }
          else
          {            
            this.props.history.push('/404');
          } 
        })
    );
  }

  getAllUserMessages = (id) => {
    trackPromise(
      messageService.getUserMessages(CONSTANTS.GET_USER_MESSAGES_URI+'/'+id)
        .then((result) => {     
          if(result != null && result.messages != null) {
            this.setState({ messages: result.messages });
          }
          else
          {
            this.setState({ message: "No Messages" });            
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

  editMessage = (e) =>{
    this.setState({ id: e.target.id });

    messageService.getMessageById(CONSTANTS.GET_MESSAGE_ID_URI + '/' + e.target.id)
        .then((result) => {   
          if(result != null) { 
            this.setState({messageDesc: result.message.message});   
            this.setState({ showAddMessage: true });     
          }
        },
        (error) => {
          this.setState({message: error});
        })
  }

  deleteMessage= param => (e) => {
    const id = e.target.id;
    messageService.removeMessage(CONSTANTS.REMOVE_MESSAGE_URI + '/' + id)
        .then((result) => { 
          this.setState({ messages: this.state.messages.filter(p => p.id !== parseInt(id)) });
        },
        (error) => {
            this.setState({message: error});
        })
  }

  handlePostMessage =(e) =>{
    this.setState({ showAddMessage: !this.state.showAddMessage });
  }

  handleMessage = (e) => { 
    this.setState({messageDesc: ''});

    if (!this.state.messageDesc.length) {
      return;
    }

    if(this.state.id === 0){

      const request={
        userId: this.state.userId,
        sender_id: this.state.senderId,
        message: this.state.messageDesc,
        isread: 0,
        isactive: 1     
      }

      trackPromise(
        messageService.createMessage(CONSTANTS.CREATE_MESSAGE_URI, request)
          .then((result) => {   
            if (result.success) {        
              this.setState({messageDesc: ''});
              this.setState({message: 'Message Inserted!!!'});
              //this.setState({ showAddMessage: !this.state.showAddMessage });
              this.setState({ id: 0 });
            } else {
              this.setState({message: result.error});
            }
          },
          (error) => {
              this.setState({message: error});
          })
      );      
    }
    else
    {
      const request={
        message: this.state.messageDesc
      }

      trackPromise(
        messageService.updateMessage(CONSTANTS.UPDATE_MESSAGE_URI + '/' + this.state.id, request)
          .then((result) => {   
            if (result.success) {        
                this.setState({message: 'Message Updated!!!'});
                this.setState({ showAddMessage: !this.state.showAddMessage });
                this.setState({ id: 0 });
                this.getAllUserMessages(this.state.userId);   
              } else {
                this.setState({message: result.error});
              }
          },
          (error) => {
              this.setState({message: error});
          })
      );
    }
  }

  render() {
    const { i18n, t } = this.props;

    return (    
      <div id="contentDashboard">
        <div class="row width100">            
            <PanelDashboardLeft user={this.state} page="messages">
            </PanelDashboardLeft>
            <div class="col-7 panelDashboard2 block"> 
              {(this.state.isOwner && !this.state.showAddMessage) && 
                <>
                  <div class="row">
                    <div class="col-2">
                    </div>
                    <div class="col">
                      {this.state.isOwner && (
                        <h1><Trans i18nKey='profile:view.messages'>Messages</Trans></h1>
                      )}
                    </div>
                    <div class="col-2">
                    </div>
                  </div> 
                  <div class="row">
                    <div class="col-12">
                      <ul id="postList">
                        {this.state.messages && this.state.messages.map((item, index) => {
                          return(
                          <li key={index}>
                            <div class="postMenuLink">
                              <img class="hu5pjgll lzf7d6o1" src="https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/-OQq3c6soLn.png" alt="" height="20" width="20" />
                              <div class="postMenu">
                                <ul>
                                  <li><div onClick={this.editMessage} id={item.id}><Trans i18nKey='profile:view.editmessage'>Edit Message</Trans></div></li>
                                  <li><div onClick={this.deleteMessage(index)} id={item.id}><Trans i18nKey='profile:view.deletemessage'>Delete Message</Trans></div></li>
                                </ul>
                              </div>
                            </div>
                            <div class="date">
                              <div class="logoImg">
                                { <Link to={'/'+item.sender.username}>{(item.sender.profileimage !=='' && item.sender.profileimage !== undefined && item.sender.profileimage !== null)?<img src={item.sender.profileimage} alt="" border="0" />:<img src="./blank-profile.jpg" alt="" border="0" />}</Link> }
                              </div>
                              <div class="usrName">
                                <Link to={'/'+item.sender.username}>{item.sender.fullname}</Link>
                                <Moment format="MMM DD, YYYY">
                                    {item.createdAt}
                                </Moment>
                              </div>
                            </div>
                            <div class="postMessage">{item.message}</div>
                          </li>
                        );
                        })}               
                      </ul>                
                    </div>                
                  </div>
                </>  
                }            
                {this.state.showAddMessage && 
                <> 
                  <div class="row">
                    <div class="col">
                      <h2 class="alignCenter">Add Message</h2>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col"> 
                      <textarea id="messageDesc" name="messageDesc" class="messageDesc" placeholder="Add Message here..." required onChange={this.handleInputChange}>{this.state.messageDesc}</textarea>                   
                    </div>
                  </div>                     
                  <div class="row">
                    <div class="col alignCenter"> 
                      <button type="button" id="btnPostMessage" onClick={this.handleMessage}>Post</button>                       
                    </div>
                  </div>                   
                  <div class="row">
                    <div class="col alignCenter"> 
                      {this.state.message}                     
                    </div>
                  </div>
                </> 
              }
            </div>
            <div class="col panelDashboard3">              
            </div>
        </div>          
      </div>
    );
  }
}
export default withRouter(withTranslation('profile')(profileMessages));