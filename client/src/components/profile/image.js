import React, { Component } from 'react';
import { withRouter } from "react-router";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';

import PanelDashboardLeft from '../panel-dashboard-left';
import  CONSTANTS from'../../_constants/constants';
import { userService } from '../../_services';

import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

import '../dashboard/index.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class profileImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOwner:false,
      userid: 0, 
      firstname: '', 
      lastname: '', 
      username: '', 
      message:'', 
      profileimage:'',
      user: {},
      imgCollection: '',
      client: '',
      section: 'Section'
    };
    this.fileChange = this.fileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.props.setBannerText(' ');
    this.getUser();
  }

  getUser = () => {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: user });

    trackPromise(
      userService.getById(CONSTANTS.GET_USER_URL+'/'+this.props.match.params.userId)
        .then((result) => {  
          if(result != null && result.user != null) {
            this.setState({ userid: result.user.userid });
            this.setState({ firstname: result.user.firstname });
            this.setState({ lastname: result.user.lastname });
            this.setState({ username: result.user.username });
            this.setState({ profileimage: (result.user.profileimage !=='' && result.user.profileimage !== undefined && result.user.profileimage !== null)? result.user.profileimage:'' });  

            if(user != null && result.user.userid !== user.userid){
              this.props.history.push('/404?message=not authroized to view this page');
            }  
            if(user != null && result.user.userid === user.userid){
              this.setState({ isOwner: true});
            }
            this.setState({ profileimage: (result.user.profileimage !=='' && result.user.profileimage !== undefined && result.user.profileimage !== null)? result.user.profileimage:'' });            
          }
          else
          {            
            this.props.history.push('/404');
          }  
        })
    );
  }

  fileChange = (files) => {
    let items = files.map(fileItem => fileItem.file);
    this.setState({ imgCollection: items }); 
  }

  handleCancel = (e) => {  
    this.props.history.push('/profile/'+this.state.username);
  }

  handleSubmit = (e) => {
    e.preventDefault()

    var formData = new FormData()

    //for (let img in this.state.imgCollection[0]) {
    //  formData.append('files', this.state.imgCollection[0][img])
    //}
    formData.append('file', this.state.imgCollection[0])
    formData.append('folder', 'assets');
    formData.append('userid', this.state.userid);

    trackPromise(
      fetch(CONSTANTS.UPLOADIMAGE_URI, {
        method: 'POST',
        body: formData,
        headers: {
        }
      })
      .then(res => res.json())
      .then(
          (result) => {
            if (result.success === true) {        
              this.setState({message: 'Success'});
              this.setState({ profileimage: (result.image !== '' && result.image !== null)? result.image:'' });  
              this.props.history.push('/profile/'+this.state.username);
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
    const { t } = this.props;

    return (
      <div id="contentDashboard">
        <div class="row width100">
            <PanelDashboardLeft user={this.state} page="image">
            </PanelDashboardLeft>
            <div class="col-7 panelDashboard2 block">  
              <div id="contentProfile">
                <div class="row">
                  <div class="col">
                    <h2>Update Profile Image</h2>
                  </div>
                </div>
                <div class="row">
                    <div class="col-3">
                      <div class="row">
                        <div class="col">
                          {(this.state.profileimage !=='' )?<img src={this.state.profileimage} alt="" class="profileimage" />:<img src="./blank-profile.jpg"  alt="" class="profileimage" />}
                        </div>
                      </div>
                    </div>
                    <div class="col-9">
                      <form onSubmit={this.handleSubmit}>
                        <div class="row">
                          <div class="col-9">
                            <FilePond 
                                files={this.state.imgCollection}
                                allowMultiple={false}
                                maxFiles={1} 
                                server={null}
                                instantUpload={false}
                                onupdatefiles={(fileItems) => this.fileChange(fileItems)}>
                            </FilePond>
                          </div>
                        </div>          
                        <div class="row button error">
                          <div class="col-12">
                            <span>&nbsp;</span>
                          </div>
                        </div>
                        <div class="row button">
                          <div class="col-12">
                            <input type="submit" id="btnRegister" value="Update" />
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

export default withRouter(profileImage);