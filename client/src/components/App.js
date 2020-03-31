import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withTranslation, Trans } from 'react-i18next';

import './App.css';

import { Spinner } from '../_helpers/spinner';
import Header from './header';
import Footer from './footer';
import Routes from './routes';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      bannerTop: './bannerTop.jpg',
      bannerText: 'Hakka.House'
    };
    this.setBannerTop = this.setBannerTop.bind(this);
    this.setBannerText = this.setBannerText.bind(this);
  }

  setBannerTop = (data) =>{
    this.setState({ bannerTop: data})
  }

  setBannerText = (data) =>{
    if(this.state.bannerText !== data)
      this.setState({ bannerText: data})
  }

  componentDidMount() {
    if (localStorage.getItem('user')) {
      this.setState({ user: JSON.parse(localStorage.getItem('user')) });
      let user = JSON.parse(localStorage.getItem('user'));
      if(user !== null){
        if(user.city !== null && user.city !== undefined && user.city !== undefined){
          this.setState({ bannerText: user.city})
          if(user.city.toString().toLowerCase() === 'toronto')
            this.setState({ bannerTop: './'+user.city.toString().toLowerCase() + '.jpg' });
          else if(user.city.toString().toLowerCase() === 'seattle')
            this.setState({ bannerTop: './'+user.city.toString().toLowerCase() + '.jpg' });
          else if(user.city.toString().toLowerCase() === 'vancouver')
            this.setState({ bannerTop: './'+user.city.toString().toLowerCase() + '.jpg' });
        }
      }
    }
  }

  render() {
    const App = (props) => (
      <div id="containerMain">
        <Header setBannerTop={this.setBannerTop} setBannerText={this.setBannerText} />
        <div class="containerContent">
          <div class="catTop">
            <div class="arrowLeft text-left">
                <span id="aLeft" class="fa fa-chevron-left">&lt;</span>
            </div>
            <div class="ticker-wrap">
                <div class="ticker">                
                  <div class="tickerItem"><Link to={'#'}><Trans i18nKey='header:links.about'>ABOUT HAKKA.HOUSE INTL.</Trans></Link></div>
                  <div class="tickerItem"><Link to={'#'}><Trans i18nKey='header:links.business'>HAKKA.HOUSE BUSINESS PLAN</Trans></Link></div>
                  <div class="tickerItem"><Link to={'#'}><Trans i18nKey='header:links.publications'>PUBLICATIONS</Trans></Link></div>
                  <div class="tickerItem"><Link to={'#'}><Trans i18nKey='header:links.crowd'>HAKKA.HOUSE HUI CROWD OFFERING</Trans></Link></div>
                  <div class="tickerItem"><Link to={'#'}><Trans i18nKey='header:links.donate'>PARTICIPATE/DONATE</Trans></Link></div>
                </div>
            </div>
            <div class="arrowRight text-right">
                <span id="aRight" class="fa fa-chevron-right">&gt;</span>
            </div>
          </div>
        </div>
        <div class="topBanner">
          <Link to={'/'}><img src={this.state.bannerTop} alt="" border="0" /></Link>
          <div class="background"></div>
          <span>{this.state.bannerText}</span>
        </div>
        <div id="panelContent">
          <Spinner />
          <Routes setBannerTop={this.setBannerTop} setBannerText={this.setBannerText} />
        </div>        
        <Footer/>
      </div>
    )
    return (
      <Suspense fallback="loading">
        <App/>
      </Suspense>
    );
  }
}

export default withRouter(withTranslation('header')(App));