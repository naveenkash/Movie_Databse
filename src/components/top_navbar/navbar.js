import React, { Component } from "react";
import "./navbar.css";
import { checkAuth,addSessionId } from "../../actions";
import { connect } from "react-redux";
// import {api_key } from '../../process.env'
var api_key = process.env.REACT_APP_API_KEY
export class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
      session_id: "",
      burgerClicked:false,
      tokenRequested:false,
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.setState({ session_id: localStorage.getItem("session_id") });
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    if (
      document.body.scrollTop > 45 ||
      document.documentElement.scrollTop > 45
    ) {
      this.setState({ scrolled: true });
    } else {
      this.setState({ scrolled: false });
    }
  };
  scroll = () => {
    if (this.state.scrolled) {
      return {
        background: "rgba(40, 40, 40,1)",
        // boxShadow: '0px 3px 5px 0px rgba(176, 176, 176, 0.19)'
      };
    }
  };
  scrollLink = () => {
    if (this.state.scrolled) {
      return {
        color: "white"
      };
    }
  };
  ScrollWrap = () => {
    if (this.state.scrolled) {
      return {
        padding: "15px 15px"
      };
    }
  };
  requestToken = () => {
    console.log("clicked");

    fetch(
      `https://api.themoviedb.org/3/authentication/token/new?api_key=${api_key}`
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        localStorage.setItem('request_token',data.request_token)
        window.open(
          `https://www.themoviedb.org/authenticate/${data.request_token}`,
          "_blank"
        );
        // this.props.tokenRequested(true);
        this.setState({ tokenRequested: true },()=>{    this.props.tokenRequested(this.state.tokenRequested)});
        console.log(this.state.tokenRequested);
        this.props.checkAuth();
        // localStorage.setItem('request_token',data.request_token);
        //   return  fetch(`https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=localhost:3000`)
      })
      .catch(err => {
        alert(err);
      });
  };
  requestGuestToken=()=>{
    
    fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${api_key}`
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        localStorage.setItem('session_id',data.guest_session_id);
        this.props.checkAuth();
      })
      .catch(err => {
        alert(err);
      });
  }
  logOut = () => {
    fetch(
      `https://api.themoviedb.org/3/authentication/session?api_key=${api_key}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset-UTF-8"
        },
        body: JSON.stringify({
          session_id: localStorage.getItem("session_id")
        })
      }
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        localStorage.removeItem("session_id");
        // this.setState({ session_id: "" });
        this.props.checkAuth();
      })
      .catch(err => {
        alert(err);
      });
  };
  burgerClicked=()=>{
    this.setState({ burgerClicked: true },()=>{   this.props.clicked(this.state.burgerClicked)})
    // this.props.clicked(true)
  }
  render() {
    return (
      <div className="navbar" style={this.scroll()}>
        <div className="navbar-wrapper">
          <div className="navbar-container">
            <div className="burger" onClick={this.burgerClicked}>
              <div className="burger_line"></div>
              <div className="burger_line"></div>
              <div className="burger_line"></div>
            </div>
            <ul>
              {/* {(() => {
                if (this.state.session_id) {
                  return null;
                }
                return (
                  <li style={this.ScrollWrap()}>
                    <span style={this.scrollLink()}>Log In</span>
                  </li>
                );
              })()} */}
              {(() => {
                if (this.props.auth) {
                  return null;
                }
                return (
                  <li style={this.ScrollWrap()}>
                    <span style={this.scrollLink()} onClick={this.requestToken}>
                      Sign up
                    </span>
                  </li>
                );
              })()}
              {(() => {
                if (this.props.auth) {
                  return null;
                }
                return (
                  <li style={this.ScrollWrap()}>
                    <span onClick={this.requestGuestToken} style={this.scrollLink()}>Guest Sign Up</span>
                  </li>
                );
              })()}

              {(() => {
                if (!this.props.auth) {
                  return null;
                }
                return (
                  <li style={this.ScrollWrap()}>
                    <span style={this.scrollLink()} onClick={this.logOut}>
                      Log Out
                    </span>
                  </li>
                );
              })()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth:state.auth
});
export default connect(
  mapStateToProps,
  { checkAuth,addSessionId }
)(navbar);
