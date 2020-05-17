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

class postSingle extends Component {
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

    if(like != undefined && like != null && like.length > 0){
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
          item.showComment=!item.showComment;
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
    const { i18n, t } = this.props;

    return (    
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
                                  {item.createddate}
                              </Moment>
                             </div>
                            {(item.isprivate===1)?<div class="private" title="This post is private and will not be publicly visible">Private</div>:""} 
                          </div>
                          <div class="postMessage">{item.message}</div>
                          <div class="row postFeatures">               
                            <div class="col-4">
                              {this.isUserLike(item)?
                                <div class="likeWrap" style={{color: "#b90900"}}>({item.likes.length})<div class="like" style={{color: "#b90900"}} title="You liked this post"><IoMdThumbsUp/></div><Trans i18nKey='profile:view.liked'>Liked</Trans></div>
                                :<div class="likeWrap">({item.likes.length})<div class="like" title="Like this post" onClick={this.likePost(item.id)}><IoMdThumbsUp/></div><Trans i18nKey='profile:view.like'>Like</Trans></div>}
                            </div>                         
                            <div class="col-4 alignCenter">
                              <div class="commentWrap">({item.comments.length})<div class="comment" title="Write comment on this post" onClick={this.showComment(item)}><IoIosChatboxes/></div><Trans i18nKey='profile:view.comment'>Comment</Trans></div>
                            </div>                         
                            <div class="col-4 alignRight">
                              <div class="shareWrap"><div class="share" title="Share this post"><IoIosShareAlt/></div><Trans i18nKey='profile:view.share'>Share</Trans></div>
                            </div>           
                          </div>
                          {this.state.selItem && this.state.selItem.id==item.id && this.state.selItem.showComment?
                            <>
                              <ul class="comments">
                                {item.comments && item.comments.map((comment, ind) => {
                                  return(
                                  <li key={index+ ' ' +ind}>
                                    <Moment fromNow>
                                      {comment.createddate}
                                    </Moment><br/>
                                    {comment.message}
                                  </li>
                                );})}
                              </ul>
                              <div class="addComment">
                                <div class="row">
                                  <div class="col">
                                    <textarea id="postComment" name="postComment" onChange={this.handlePostComment(this.state.selItem)}></textarea>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col">
                                    <button type="button" id="addCommentButton" onClick={this.addComment(this.state.selItem)}>Post Comment</button>
                                  </div>
                                </div>
                              </div>
                            </>
                          :""}
                        </li>
                      );
        })}
      </ul>
    );
  }
}
export default withRouter(withTranslation('profile')(postSingle));