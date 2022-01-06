import React, { Component } from 'react';

class Clock extends Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }

    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        3000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
        document.getElementById("animateOpacity").animate([
            // keyframes
            { opacity: '0' }
        ], {
            duration: 900
        });

        setTimeout(() => {
            document.getElementById("animateOpacity").style.opacity = 0;

            this.setState({
                date: new Date()
            });

        }, 900);

        setTimeout(() => {
            document.getElementById("animateOpacity").animate([
                // keyframes
                { opacity: '1' }
            ], {
                duration: 1000
            });
            setTimeout(() => {
                document.getElementById("animateOpacity").style.opacity = 1;
            }, 1000);          
        }, 1100);
    }
  
    render() {
      return (
        <div className='opacity-100' id="animateOpacity">
          <h1>Bonjour, monde !</h1>
          <h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
  }

export default Clock;