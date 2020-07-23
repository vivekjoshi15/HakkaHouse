import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';
import Select from "react-select";
import Moment from 'react-moment';
import ReactPlayer from 'react-player';
import ModalImage from "react-modal-image";

import  CONSTANTS from'../../_constants/constants';
import { authHeader } from '../../_helpers/auth-header';
import { userService, countryService, postService, likeService, commentService } from '../../_services';

import { IoMdThumbsUp, IoIosChatboxes, IoIosShareAlt } from "react-icons/io";

import './index.css';

class dashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'',    
      isChange: false, 
      id: 0, 
      user_id: 0,
      city_id: 0, 
      cityInfo:'',
      postMessage: '', 
      firstname: '', 
      lastname: '', 
      username: '', 
      profileimage:'',
      city: '',
      state: '',
      selCity:{},
      selState:{},
      selCountry:{},
      user: {},
      country: '', 
      users:[],
      countries: [],
      states: [],
      cities: [],
      posts: [],
      selItem:{}
    };
    this.handleChangeView=this.handleChangeView.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.editPost = this.editPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.hidePost = this.hidePost.bind(this);
    this.privatePost = this.privatePost.bind(this);
    this.likePost = this.likePost.bind(this);
    this.showComment = this.showComment.bind(this);
    this.addComment = this.addComment.bind(this);
    this.handlePostComment=this.handlePostComment.bind(this);
    this.isUserLike=this.isUserLike.bind(this);
  }

  componentDidMount() {
    //this.props.setBannerText(this.props.match.params.city + ' Dashboard');   
    this.props.setBannerText(' ');   
    this.getUser();
    this.getCity();
    this.getCountries(null);
    this.getUsers();
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: user });
    
    this.setState({ id: user.id });
    this.setState({ user_id: user.id });
    this.setState({ firstname: user.firstname });
    this.setState({ lastname: user.lastname });
    this.setState({ username: user.username });
    this.setState({ profileimage: (user.profileimage !== '' && user.profileimage !== undefined && user.profileimage !== null)? user.profileimage : '' });  
  }

  getUsers = () => {
    trackPromise(
      userService.getUsersByCSC(CONSTANTS.GET_USERS_CSC_URL+'/'+this.props.match.params.city+'/0/0')
        .then((result) => {
          this.setState({ users: result.user });
          if(result.user.length > 0){
            const users=[];
            result.user.map((item, index) => {
              users.push(item.id);
            });
            this.getAllPosts(users);
          }
          else{
            this.setState({ posts: [] });
            this.setState({ message: "No Posts" });  
          }
        })
    );
  }

  getCity = async() => {

    await countryService.getCityByName(CONSTANTS.GET_CITY_URL+'/'+this.props.match.params.city)
      .then((result) => {
          this.setState({city_id: result.city.id});
          if(this.state.city_id !==0){
            this.setState({selCity: result.city});
            this.setState({selState: result.city.state});
            this.setState({selCountry: result.city.state.country});

            this.getStates(result.city.state.countryId);
            this.getCities(result.city.stateId);
            countryService.getCityInfo(CONSTANTS.GET_CITY_INFO_URL+'/'+this.state.city_id)
              .then((result) => {
                if(result.info)
                  this.setState({cityInfo: result.info.description});
            });
          }
      });
  }

  getCountries = async(inputValue) => {
    await countryService.getCountries(CONSTANTS.COUNTRIES_URL)
      .then((result) => {
        this.setState({countries: result.countries});
      });
  }

  getStates = (id) => {
    trackPromise(
      countryService.getStates(CONSTANTS.STATES_URL+"/"+id)
        .then((result) => {
          this.setState({ states: result.states });
        })    
    );
  }

  getCities = (id) => {
    trackPromise(
      countryService.getCities(CONSTANTS.CITIES_URL+"/"+id)
        .then((result) => {
          this.setState({ cities: result.cities });
        })  
    );
  }

  handleChangeView = () =>{
    this.setState({ isChange: !this.state.isChange });
  }

  changeCountry = async(value) =>{
    this.setState({ country: value.name });
    this.getStates(value.id);
  }

  changeState = async(value) =>{
    this.setState({ state: value.name });
    this.getCities(value.id);
  }

  changeCity = async(value) =>{
    this.setState({ city: value.name });
    this.setState({ isChange: false });
    this.props.history.push('/city/' + value.name);
  }

  getAllPosts = (users) => {
    const request={
      users: users
    }

    fetch(CONSTANTS.GET_USERS_POSTS_URI, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: authHeader()
      })
      .then(res => res.json())
      .then(
        (result) => {           
            if(result != null && result.posts != null) {
              this.setState({ posts: result.posts });
            }
            else
            {
              this.setState({ message: "No Posts" });            
            }
          },
          (error) => {
            this.setState({message: error});
          })    
        .catch(err => {
          console.error(err);
          this.setState({message: 'Error logging in please try again'+ err});
        })
  }

  getPost = (id) => {
    trackPromise(
      postService.getById(CONSTANTS.GET_POST_ID_URI+'/'+id)
        .then((result) => {     
          if(result != null && result.post != null) {
            //const newPosts = this.state.posts.splice(this.state.posts.indexOf(id, 0), 1); 
            const newPosts = [ ...this.state.posts.filter(p => p.id !== parseInt(id)), result.post];
            newPosts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            this.setState({ posts: newPosts }); 
          }
          else
          {
            this.setState({ message: "Invalid Post" });            
          }
        })
    );
  }

  //Post Functions 
  editPost = (e) =>{
    this.setState({ id: e.target.id });

    trackPromise(
      postService.getById(CONSTANTS.GET_POST_ID_URI + '/' + e.target.id)
        .then((result) => {   
          if(result != null) { 
            this.setState({postMessage: result.post.message});   
            this.setState({ showModel: true });     
          }
        },
        (error) => {
              this.setState({message: error});
        })
    );
  }

  deletePost= param => (e) => {
    const id = e.target.id;
    postService.removePost(CONSTANTS.REMOVE_POST_URI + '/' + id)
      .then((result) => { 
        this.setState({ posts: this.state.posts.filter(p => p.id !== parseInt(id)) });
      },
      (error) => {
        this.setState({message: error});
      })
  }

  hidePost = param => (e) =>{
    const request={
      isactive: 0,
    }
    const id = e.target.id;
    postService.updateIsPrivate(CONSTANTS.UPDATE_ISACTIVE_URI + "/" + id, request)
      .then((result) => {
        if (result.success === true) {   
          this.getPost(id);     
        } else {
          this.setState({message: result.error});
        }
      },
      (error) => {
          this.setState({message: error});
      })
  }

  privatePost= param => (e) => {
    const request={
      isprivate: (param === 0)?1:0,
    }
    const id = e.target.id;
    postService.updateIsPrivate(CONSTANTS.UPDATE_ISPRIVATE_URI + "/" + id, request)
      .then((result) => {
        if (result.success === true) {   
          this.getPost(id);            
        } else {
          this.setState({message: result.error});
        }
      },
      (error) => {
        this.setState({message: error});
      })
  }

  likePost = id => (e) =>{
    const request={
      userId: this.state.user_id,
      postId: id
    }
    
    likeService.createLike(CONSTANTS.CREATE_LIKE_URI, request)
      .then((result) => {
        if (result.success === true) {  
          this.getPost(id);     
          //this.getAllUserPosts(this.state.user_id);  
        } else {
          this.setState({message: result.error});
        }
      },
      (error) => {
          this.setState({message: error});
      })
  }

  isUserLike = (item) =>{
    const like= item.likes.filter((element) => { 
      return element.userId === this.state.user.id
    });

    if(like !== undefined && like !== null && like.length > 0){
      return true;
    }

    return false;
  }

  showComment = item => (e) =>{
    item.showComment=(item.showComment===undefined)?true:!item.showComment;
    this.setState({selItem:item});
  }

  handlePostComment = item => (e) =>{
    item.postComment=e.target.value;
    this.setState({selItem:item}); 
  }

  addComment = item => (e) =>{
    
    if(item.postComment !== "" && item.postComment.trim() !== ""){
      const request={
        userId: this.state.user_id,
        postId: item.id,
        message: item.postComment
      }
      
      commentService.createComment(CONSTANTS.CREATE_COMMENT_URI, request)
        .then((result) => {
          if (result.success === true) {   
            //item.showComment=!item.showComment;
            //this.setState({selItem:item}); 
            this.getPost(item.id);  
          } else {
            this.setState({message: result.error});
          }
        },
        (error) => {
            this.setState({message: error});
        })
    }
  }

  render() {
    const { t } = this.props;
    const selCountry={name: this.state.selCountry.name, label: this.state.selCountry.id};
    const selState={name: this.state.selState.name, label: this.state.selState.id};
    const selCity={name: this.state.selCity.name, label: this.state.selCity.id};

    return (    
      <div id="contentDashboard">
        <div class="row width100">
            <div class="col-2 panelDashboard1"> 
              <div class="row">
                <div class="col">
                  <div id="searchBox">
                    <svg class="btnSearch" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>                
                    <input type="text" id="txtSearch1" placeholder={t('header:search')} />
                  </div>
                  <ul id="memberList">
                  {this.state.users && this.state.users.map((item) => {
                      return(
                        <li>
                          {<Link to={'/'+item.username}>{(item.profileimage !=='' && item.profileimage !== undefined && item.profileimage !== null)?<img src={item.profileimage} alt="" border="0" />:<img src="./blank-profile.jpg" alt="" border="0" />} <h4>{item.firstname} {item.lastname}</h4> </Link>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>             
            </div>
            <div class="col-7 panelDashboard2 block">   
              <div class="row">
                <div class="col">
                  <h2>{this.props.match.params.city} (<a onClick={this.handleChangeView}>change</a>)</h2>
                </div>
              </div> 
              { this.state.isChange &&  
              <div class="row" >
                <div class="col-4">
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
                <div class="col-4">
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
                <div class="col-4">
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
             }     
             <div class="row">
                <div class="col-12">
                  <ul id="postList">
                  {this.state.posts && this.state.posts.map((item, index) => {
                      return(
                        <li key={index}>
                          {item.userId===this.state.user.id? 
                            <>
                            <div class="postMenuLink">
                              <img class="hu5pjgll lzf7d6o1" src="https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/-OQq3c6soLn.png" alt="" height="20" width="20" />
                              <div class="postMenu">
                                <ul>
                                  <li><div onClick={this.deletePost(index)} id={item.id}><Trans i18nKey='profile:view.deletepost'>Delete Post</Trans></div></li>
                                  <li><div onClick={this.hidePost(index)} id={item.id}><Trans i18nKey='profile:view.hidepost'>Hide Post</Trans></div></li>
                                  <li>
                                    <div onClick={this.privatePost(item.isprivate)} id={item.id}>
                                      {
                                        (item.isprivate===1)? 
                                        <Trans i18nKey='profile:view.publicpost'>Public Post</Trans>
                                      :
                                        <Trans i18nKey='profile:view.privatepost'>Private Post</Trans>
                                      }
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            </>
                          :""}
                          <div class="date">
                             <div class="logoImg">
                              { <Link to={'/'+item.user.username}>{(item.user.profileimage !=='' && item.user.profileimage !== undefined && item.user.profileimage !== null)?<img src={item.user.profileimage} alt="" border="0" />:<img src="./blank-profile.jpg" alt="" border="0" />}</Link> }
                             </div>
                             <div class="usrName">
                              <Link to={'/'+item.user.username}>{item.user.fullname}</Link>
                              <Moment format="MMM DD, YYYY">
                                  {item.createdAt}
                              </Moment>
                             </div>
                            {(item.isprivate===1)?<div class="private" title="This post is private and will not be publicly visible">Private</div>:""} 
                          </div>
                          <div class="postMessage">
                            {(item.type==="Text")?
                              item.message:
                              ((item.type==="Video")?
                                <ReactPlayer  
                                  url={item.message} 
                                  width="600px"
                                  height="300px"
                                  playing="false"
                                  controls="true"
                                  volume="0"
                                  muted
                                  style={{margin: '0 auto'}}
                                />:
                                <ModalImage
                                  small={item.message}
                                  large={item.message}
                                  className="postImage"
                                  alt="click to view large image"
                                  hideDownload="true"
                                  showRotate="true"
                                />)
                              }
                          </div>
                          <div class="row postFeatures">               
                            <div class="col-4">
                              {this.isUserLike(item)?
                                <div class="likeWrap" style={{color: "#b90900"}}>({item.likes.length})<div class="like" style={{color: "#b90900"}} title="You liked this post"><IoMdThumbsUp/></div><Trans i18nKey='profile:view.liked'>Liked</Trans></div>
                                :<div class="likeWrap" onClick={this.likePost(item.id)}>({item.likes.length})<div class="like" title="Like this post"><IoMdThumbsUp/></div><Trans i18nKey='profile:view.like'>Like</Trans></div>}
                            </div>                         
                            <div class="col-4 alignCenter">
                              <div class="commentWrap" onClick={this.showComment(item)}>({item.comments.length})<div class="comment" title="Write comment on this post"><IoIosChatboxes/></div><Trans i18nKey='profile:view.comment'>Comment</Trans></div>
                            </div>                         
                            <div class="col-4 alignRight">
                              <div class="shareWrap"><div class="share" title="Share this post"><IoIosShareAlt/></div><Trans i18nKey='profile:view.share'>Share</Trans></div>
                            </div>           
                          </div>
                          {this.state.selItem && this.state.selItem.id===item.id && this.state.selItem.showComment?
                            <>
                              <div class="addComment">
                                <div class="row">
                                  <div class="col" style={{paddingRight: "0px"}}>
                                    <textarea id="postComment" name="postComment" placeholder="Write a comment" onChange={this.handlePostComment(this.state.selItem)}></textarea>
                                  </div>
                                  <div class="col-2" style={{paddingLeft: "0px", display:"flex"}}>
                                    <button type="button" id="addCommentButton" onClick={this.addComment(this.state.selItem)}>Post Comment</button>
                                  </div>
                                </div>
                              </div>
                              <ul class="comments">
                                {item.comments && item.comments.map((comment, ind) => {
                                  return(
                                  <li key={index+ ' ' +ind}>
                                    <div class="date">
                                       <div class="logoImg">
                                        { <Link to={'/'+comment.user.username}>{(comment.user.profileimage !=='' && comment.user.profileimage !== undefined && comment.user.profileimage !== null)?<img src={comment.user.profileimage} alt="" border="0" />:<img src="./blank-profile.jpg" alt="" border="0" />}</Link> }
                                       </div>
                                       <div class="usrName">
                                        <Link to={'/'+comment.user.username}>{comment.user.fullname}</Link>
                                        <Moment fromNow>
                                          {comment.createdAt}
                                        </Moment>
                                       </div>
                                    </div>
                                    <div class="commentMessage">{comment.message}</div>
                                  </li>
                                );})}
                              </ul>
                            </>
                          :""}
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
      </div>
    );
  }
}
export default withRouter(withTranslation('profile')(dashboardView));