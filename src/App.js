import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Please enter postcode,suburb and state ",
      bgColor: 'black'
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    var component = this;
    var suburb = this.suburb.value.toUpperCase();
    var states = this.states.value.toUpperCase();
    var postcode = this.postcode.value;
    var results = {}
    // used cors anywhere deployed to
    //https://ancient-spire-39579.herokuapp.com 
    // to proxy data as auspost did not allow cors from browser
    var proxyUrl = 'https://ancient-spire-39579.herokuapp.com/';
    var targetUrl = 'https://digitalapi.auspost.com.au/postcode/search.json?q=' + postcode + '&excludePostBoxFlag=true';
    fetch(proxyUrl + targetUrl, {
      method: 'get',
      headers: {
        'auth-key': 'bf864311-c5b6-4844-9b98-54b2eb084b44'
      }
    }).then((response) => {
      results = response.json();

      return results
    }).catch(function () {
      console.log("error");
    })
      .then((json) => {
        component.setState({
          data: json
        })
        console.log(json)
        var target = json.localities.locality;
        for (var i = 0; i < target.length; i++) {
          if (target[i].state === states && target[i].location === suburb) {

            this.setState({ message: 'Your postcode,suburb and state match,congrats', bgColor: 'green' });
            return
          }
          else if (target[i].location === suburb) {
            if (target[i].state != states) {
              this.setState({ message: 'Your state is wrong,' + states + ', does not match ' + target[i].state + ' as the correct state', bgColor: 'red' });
            }
          } else if (target[i].state == states) {
            if (target[i].location != suburb)
              this.setState({ message: '' + suburb + ' suburb does not belong to ' + postcode + ' postcode', bgColor: 'red' });

          }

        }
      })
      .catch((ex) => {
        console.log('parsing failed', ex)
        this.setState({ message: 'An error occured' + ex });
      })
    console.log("done");
    { this.state.message }
  };



  render(props) {
    return (

      <div id="search">

        <form onSubmit={this.handleSubmit}>

          <input placeholder="postcode" className="input" type="number" ref={input => this.postcode = input} />
          <input placeholder="suburb" className="input" type="text" ref={input => this.suburb = input} />
          <input placeholder="state" className="input" type="text" ref={input => this.states = input} />
          <br />
          <input type="submit" value="Search" />
        </form>
        <h2 style={{ color: this.state.bgColor }} id="msg">{this.state.message}.</h2>
      </div>
    );
  }
}
export default App;
