import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';
import Moment from 'react-moment';

import PanelDashboardLeft from '../panel-dashboard-left';
import { authHeader } from '../../_helpers/auth-header';
import CONSTANTS from'../../_constants/constants';
import { userService, postService, likeService, commentService } from '../../_services';

import { IoMdThumbsUp, IoIosChatboxes, IoIosShareAlt } from "react-icons/io";

import '../dashboard/index.css';

class postsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      message:'',  
      isOwner:false,
      id: 0, 
      user_id: 0, 
      postMessage: '', 
      firstname: '', 
      lastname: '', 
      username: '', 
      profileimage:'',
      users:[],
      user: {},
      posts: [],
      selItem:{}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePostModel = this.handlePostModel.bind(this);
    this.handlePost = this.handlePost.bind(this);
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
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: user });

    trackPromise(
      userService.getByUsername(CONSTANTS.GET_USERNAME_URL+'/'+this.props.match.params.username)
        .then((result) => {     
          if(result != null && result.user != null) {
            this.setState({ id: result.user.id });
            this.setState({ user_id: result.user.id });
            this.setState({ firstname: result.user.firstname });
            this.setState({ lastname: result.user.lastname });
            this.setState({ username: result.user.username });
            this.setState({ profileimage: (result.user.profileimage !=='' && result.user.profileimage !== undefined && result.user.profileimage !== null)? result.user.profileimage:'' });  

            if(user != null && result.user.id === user.id){
              this.setState({ isOwner: true});
            }    

            this.getAllUserPosts(result.user.id);              
          }
          else
          {            
            this.props.history.push('/404');
          } 
        })
    );
  }

  getAllUserPosts = (user_id) => {
    trackPromise(
      postService.getAllUserPosts(CONSTANTS.GET_POSTS_USERS_URI+'/'+user_id)
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

  getPost = (id) => {
    trackPromise(
      postService.getById(CONSTANTS.GET_POST_ID_URI+'/'+id)
        .then((result) => {     
          if(result != null && result.post != null) {           
            /*this.setState({
              posts: this.state.posts.filter(i => i !== index)
            });*/
            const newPosts = this.state.posts.splice(this.state.posts.indexOf(id, 0), 1); 
            this.setState({posts: [ ...newPosts, result.post]}); 
          }
          else
          {
            this.setState({ message: "Invalid Post" });            
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

  handlePostModel = () => { 
    this.setState({ showModel: !this.state.showModel });    
    this.setState({ id: 0 });
  }

  handlePost = (e) => { 
    this.setState({message: ''});

    if (!this.state.postMessage.length) {
      return;
    }

    if(this.state.id === 0){

      const request={
        userId: this.state.user_id,
        message: this.state.postMessage,
        isprivate: 0,
        isactive: 1,
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
            if (result.success === true) {        
              this.setState({message: 'Your Post Inserted!!!'});
              this.setState({ showModel: !this.state.showModel });
              this.setState({ id: 0 });
              this.getAllUserPosts(this.state.user_id);  
            } else {
              this.setState({message: result.error});
            }
          },
          (error) => {
            this.setState({message: error});
          })    
        .catch(err => {
          console.error(err);
          this.setState({message: 'Error logging in please try again'+ err});
        })
      )
    }
    else
    {
      const request={
        message: this.state.postMessage
      }

      trackPromise(
        postService.updatePost(CONSTANTS.UPDATE_POST_URI + '/' + this.state.id, request)
          .then((result) => {   
            if (result.success) {        
                this.setState({message: 'Your Post Updated!!!'});
                this.setState({ showModel: !this.state.showModel });
                this.setState({ id: 0 });
                this.getAllUserPosts(this.state.user_id);  
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
    trackPromise(
      postService.removePost(CONSTANTS.REMOVE_POST_URI + '/' + e.target.id)
        .then((result) => { 
          const newPosts = this.state.posts.splice(param, 1); //this.state.posts.indexOf(e.target.id)
          this.setState({posts: newPosts}); 
          //this.getAllUserPosts(result.user.user_id);  
        },
        (error) => {
            this.setState({message: error});
        })
    );
  }

  hidePost = param => (e) =>{
    const request={
      isactive: 0,
    }

    trackPromise(
      postService.updateIsPrivate(CONSTANTS.UPDATE_ISACTIVE_URI + "/" + e.target.id, request)
      .then((result) => {
        if (result.success === true) {        
          //const newPosts = this.state.posts.splice(param, 1);
          //this.setState({posts: newPosts});
          this.getAllUserPosts(this.state.user_id);  
        } else {
          this.setState({message: result.error});
        }
      },
      (error) => {
          this.setState({message: error});
      })
    );
  }

  privatePost= param => (e) => {
    const request={
      isprivate: (param === 0)?1:0,
    }

    trackPromise(
      postService.updateIsPrivate(CONSTANTS.UPDATE_ISPRIVATE_URI + "/" + e.target.id, request)
      .then((result) => {
        if (result.success === true) {   
          this.getPost(e.target.id);           
          //this.getAllUserPosts(this.state.user_id);  
        } else {
          this.setState({message: result.error});
        }
      },
      (error) => {
        this.setState({message: error});
      })
    );   
  }

  likePost = id => (e) =>{
    const request={
      userId: this.state.user_id,
      postId: id
    }
    trackPromise(
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
    );
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

    const request={
      userId: this.state.user_id,
      postId: item.id,
      message: item.postComment
    }

    trackPromise(
      commentService.createComment(CONSTANTS.CREATE_COMMENT_URI, request)
      .then((result) => {
        if (result.success === true) {   
          item.showComment = !item.showComment;
          this.setState({selItem:item}); 
          this.getPost(item.id);  
        } else {
          this.setState({message: result.error});
        }
      },
      (error) => {
          this.setState({message: error});
      })
    );
  }

  render() {
    const { t } = this.props;

    return (    
      <div id="contentDashboard">
        <div class="row width100">            
            <PanelDashboardLeft user={this.state} page="posts">
            </PanelDashboardLeft>
            <div class="col-7 panelDashboard2 block"> 
                <div class="row">
                  <div class="col-2">
                    {this.state.isOwner?  
                      <div id="createPost" onClick={this.handlePostModel}>Create Post</div>
                    :""}       
                  </div>
                  <div class="col">
                    <h1><Trans i18nKey='profile:view.posts'>Posts</Trans></h1>
                  </div>
                  <div class="col-2">
                    {this.state.isOwner?  
                      <div></div>
                    :""}       
                  </div>
                </div>        
             <div class="row">
                <div class="col-12">
                  <ul id="postList">
                  {this.state.posts && this.state.posts.map((item, index) => {
                      return(
                        <li key={index}>
                          {this.state.isOwner? 
                            <>
                            <div class="postMenuLink">
                              <img class="hu5pjgll lzf7d6o1" src="https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/-OQq3c6soLn.png" alt="" height="20" width="20" />
                              <div class="postMenu">
                                <ul>
                                  <li><div onClick={this.editPost} id={item.id}><Trans i18nKey='profile:view.editpost'>Edit Post</Trans></div></li>
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
                          <div class="postMessage">{item.message}</div>
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
                                    <Moment fromNow>
                                      {comment.createdAt}
                                    </Moment><br/>
                                    {comment.message}
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
                    <h2>
                    {
                      (this.state.id > 0)?
                        <Trans i18nKey='profile:view.editpost'>Edit Post</Trans>
                        :
                        <Trans i18nKey='profile:view.createpost'>Create Post</Trans>
                      }
                    </h2>                             
                  </div>       
                </div>                       
                <div class="row">
                  <div class="col"> 
                    <textarea id="postMessage" name="postMessage" class="txtPost" required onChange={this.handleInputChange}>{this.state.postMessage}</textarea>                   
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