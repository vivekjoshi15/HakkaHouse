import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';
import Select from "react-select";
import Moment from 'react-moment';

import { authHeader } from '../../_helpers/auth-header';
import  CONSTANTS from'../../_constants/constants';
import { userService, countryService, postService } from '../../_services';

import './index.css';

class dashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'',    
      isChange: false, 
      city_id: 0, 
      cityInfo:'',
      city: '',
      state: '',
      country: '', 
      users:[],
      countries: [],
      states: [],
      cities: []
    };
    this.handleChangeView=this.handleChangeView.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeCity = this.changeCity.bind(this);
  }

  componentDidMount() {
    //this.props.setBannerText(this.props.match.params.city + ' Dashboard');   
    this.props.setBannerText(' ');   
    this.getCity();
    this.getCountries(null);
    this.getUsers();
  }

  getUsers = () => {
    trackPromise(
      userService.getUsersByCSC(CONSTANTS.GET_USERS_CSC_URL+'/'+this.props.match.params.city+'/0/0')
        .then((result) => {
          this.setState({ users: result.user });
          this.getAllPosts(result.user);
        })
    );
  }

  getCity = async() => {
    await countryService.getCityByName(CONSTANTS.GET_CITY_URL+'/'+this.props.match.params.city)
      .then((result) => {
          this.setState({city_id: result.city.id});
          if(this.state.city_id !==0){
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
          this.setState({states: result.states});
        })    
    );
  }

  getCities = (id) => {
    trackPromise(
      countryService.getCities(CONSTANTS.CITIES_URL+"/"+id)
        .then((result) => {
          this.setState({cities: result.cities});
        })  
    );
  }

  getAllPosts = (users) => {
    trackPromise(
      postService.getAllPosts(CONSTANTS.GET_POSTS_URI)
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

  handleChangeView = () =>{
    this.setState({isChange: !this.state.isChange});
  }

  changeCountry = async(value) =>{
    this.setState({country: value.name});
    this.getStates(value.id);
  }

  changeState = async(value) =>{
    this.setState({state: value.name});
    this.getCities(value.id);
  }

  changeCity = async(value) =>{
    this.setState({city: value.name});
    this.setState({isChange: false});
    this.props.history.push('/city/'+value.name);
  }

  render() {
    const { i18n, t } = this.props;

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
                      required      
                      onChange={(value) => { this.changeCity(value); }}                
                    /> 
                </div>
              </div>   
             }     
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
      </div>
    );
  }
}
export default withRouter(withTranslation('profile')(dashboardView));