import React, { Component } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3030");

class App extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [] };
  }

  componentDidMount() {
    socket.on("chat message", ({msg }) => {
      this.setState({
        chat: [{ msg }]
      });
    });
  }


  onMessageSubmit = () => {

    //this.setState({ msg: 'ON' });
    socket.emit("chat message", 'ON');
    //this.setState({ msg: "" });
    console.log(this.state.msg)
  };
  updateMessage(){
    
    socket.on("chat message", (msg) => {
      this.setState({
        chat: [{ msg }]
      });
    });
    console.log(this.state.chat)
  }
  renderChat() {
    
    const { chat } = this.state;
    return chat.map(({ msg }, idx) => (
      <div key={idx}>
        <span style={{ color: "green", fontSize: 50  }}>Received:{msg} </span>
      </div>
    ));
  }

  render() {
    this.updateMessage();

    return (
      <div className='container' >
        
        <button ><img src={require("./assets/bt2.png")} alt='' onClick={this.onMessageSubmit} /></button>
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}

export default App;