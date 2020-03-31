import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class page404 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  componentDidMount() {
    this.props.setBannerText(' ');
    if (this.props.match.params.message) {
      this.setState({ message: this.props.match.params.message });
    }
  }

  render() {
    return (
      <div id="contentMain">
        {this.state.message?this.state.message: "404 - Not found"}
        <p style={{textAlign:"center"}}>
           <Link to="/">Go to Home </Link>
        </p>
      </div>
    );
  }
}
export default page404;