import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withTranslation, Trans } from 'react-i18next';

class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
    //this.setState({ counter: this.props.from || 0 });
  }

  componentWillUnmount() {
  }

  render() {
    return (
		    <footer>          
          <div class="containerContent">
            <div class="copyright"><Trans i18nKey='header:copyright'>© 2020 Hakka.House</Trans></div>
          </div>
        </footer>
        );
  }
}

export default withRouter(withTranslation('header')(Footer));