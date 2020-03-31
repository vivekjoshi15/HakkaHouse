import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { trackPromise } from 'react-promise-tracker';
import { withTranslation, Trans } from 'react-i18next';
import { Fade } from 'react-slideshow-image';
import Select from "react-select";
import Headroom from "react-headroom";

import  CONSTANTS from'../_constants/constants';
import { userService, countryService } from '../_services';

import './header.css';

const adImages = [
  {url:'https://torontohakkaconference.com/thc2020/',image:'./ads/ad1.jpg'},
  {url:'https://torontohakkaconference.com/thc2020/',image:'./ads/ad2.jpg'}
];

const fadeProperties = {
  duration: 3000,
  transitionDuration: 500,
  infinite: true,
  indicators: false,
  arrows: false,
  onChange: (oldIndex, newIndex) => {
    //console.log(`fade transition from ${oldIndex} to ${newIndex}`);
  }
}

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      hidediv: true,
      showModel: false,
      isUser: false,
      profileimage:'',
      user: {},
      city_id: 0, 
      city: '',
      state: '',
      country: '', 
      countries: [],
      states: [],
      cities: []      
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeCity = this.changeCity.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem('user')) {
      this.getCountries(null);
      this.setState({ isUser : true });
      this.setState({ user: JSON.parse(localStorage.getItem('user')) || {} });
      const img=JSON.parse(localStorage.getItem('user')).profileimage;
      this.setState({ profileimage: (img !=='' && img !== undefined && img !== null)? img:'' });  
    }
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  handleLogout() {
    this.setState({ isUser : false });
    userService.logout();
    this.props.setBannerText('Hakka.House');
    this.props.setBannerTop('./bannerTop.jpg');
    this.props.history.push("/login");
  }

  handleClick = () =>  this.setState({ hidediv: !this.state.hidediv });

  handleChangeCity = () =>  this.setState({ showModel: !this.state.showModel });

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
      <>      
      <Headroom>
      	<header>
            <div class="container">
              <div id="headerLeft">
                <div id="logoImg">
                  { (this.state.isUser) ?<Link to={'/'+this.state.user.username}>{(this.state.profileimage !=='' && this.state.profileimage !== undefined && this.state.profileimage !== null)?<img src={this.state.profileimage} alt="" border="0" />:<img src="./logoIcon.png" alt="" border="0" />}</Link>:<Link to={'/login'}><img src="./logoIcon.png" alt="" border="0" /></Link> }
                  <br/>
                  { (this.state.isUser) ? <Link onClick={this.handleLogout}><Trans i18nKey='header:logout'>Logout</Trans></Link>:<Link to={'/login'}><Trans i18nKey='header:login'>Login</Trans></Link> }
                </div>
                <div id="logo">
                  <Link to={'/'}><img src="./logo.png" alt="" border="0" /></Link>
                  { (this.state.isUser) ? (
                  <div id="topCityState">
                    <Link to={'/city/'+this.state.user.city} class="left">{this.state.user.city}, {this.state.user.state.substring(0, 3)}</Link>
                    <Link to={'/country/'+this.state.user.country} class="right">{this.state.user.country}</Link><br/>
                    <span class="center" onClick={this.handleChangeCity}>(Change City)</span>                  
                  </div>
                ): (<></>) }
                </div>
              </div>
              <div id="headerCenter">
                <div className="slide-container">
                  <Fade {...fadeProperties}>
                    {adImages && adImages.map((item) => {
                        return(
                          <div className="each-fade">
                            <div className="image-container">
                              <a href={item.url} target="_blank" border="0" rel="noopener noreferrer"><img src={item.image} alt="" border="0" /></a>
                            </div>
                          </div>
                        );
                      })}
                  </Fade>
                </div>              
              </div>
              <div id="headerRight">
                <nav class="navcl navbar navbar-inverse">
                  <div class="container-fluid">
                      <div class="navbar-header">
                          <button type="button" class="navbar-toggle" onClick={this.handleClick}>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                          </button>
                      </div>
                      <div class="collapse navbar-collapse" id="myNavbar" hidden = {!this.state.hidediv}>
                        <ul class="nav navbar-nav">
                          <Trans i18nKey='header:eat'><li><Link to={'/eat'}>Eat/Entertain</Link></li></Trans>
                          <Trans i18nKey='header:shop'><li><Link to={'/shop'}>Shop</Link></li></Trans>
                          <Trans i18nKey='header:places'><li><Link to={'/places'}>Places</Link></li></Trans>
                          <Trans i18nKey='header:connect'><li><Link to={'/connect'}>Connect</Link></li></Trans>
                          <Trans i18nKey='header:learn'><li><Link to={'/learn'}>Learn</Link></li></Trans>
                          <Trans i18nKey='header:spiritual'><li><Link to={'/spiritual'}>Spiritual</Link></li></Trans>
                          <Trans i18nKey='header:share'><li><Link to={'/share'}>Share</Link></li></Trans>
                          <Trans i18nKey='header:hui'><li><Link to={'/hui'}>Hui</Link></li></Trans>
                          <Trans i18nKey='header:cooking'><li><Link to={'/cooking'}>Cooking</Link></li></Trans>
                        </ul>
                      </div>
                  </div>
                </nav>
                <div id="searchBox">
                  <svg class="btnSearch" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                  </svg>                
                  <input type="text" id="txtSearch" placeholder={t('header:search')} />
                </div>
                <div id="langBox">
                  <Link onClick={() => i18n.changeLanguage('en')} title="Change language">English</Link>&nbsp;&nbsp;
                  <Link onClick={() => i18n.changeLanguage('zh')} title="Change language">中文</Link>
                </div>
              </div> 
            </div>
        </header>
      </Headroom> 
          { this.state.showModel &&  
            <div class="modelCityWrap">
              <div class="modelCityBack">
              </div> 
              <div class="modelCity">
                <div class="row">
                  <div class="col-4">
                  </div>
                  <div class="col-4">
                    <h2>Change City</h2>
                  </div>
                  <div class="col-4 right">
                    <span class="close" onClick={this.handleChangeCity}>X</span>
                  </div>
                </div>
                <div class="row">
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
              </div>
            </div>
          }
      </>
      );
  }
}

export default withRouter(withTranslation('header')(Header));