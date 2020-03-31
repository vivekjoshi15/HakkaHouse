import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withTranslation, Trans } from 'react-i18next';

class home extends Component {

  componentDidMount() {
    this.props.setBannerText('Hakka.House');
  }

  render() {
    return (
      <div class="containerContent">
        <div id="content">
          <div id="video">
            <iframe title="Hakka House" src="https://player.vimeo.com/video/380389285" frameborder="0" allow="autoplay; fullscreen" allowfullscreen=""></iframe>          
          </div>
          <div id="buy">
            <div><a class="buylink" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZFPSBVCQB68C8" target="_blank" rel="noopener noreferrer"><Trans i18nKey='header:buy'>Buy Book</Trans> <br/>$25</a></div>
            <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZFPSBVCQB68C8" target="_blank" rel="noopener noreferrer"><img src="./book-cover.png" border="0" alt="Buy" /></a>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(withTranslation('header')(home));