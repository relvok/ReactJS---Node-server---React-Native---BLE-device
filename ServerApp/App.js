import React, {Component} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import io from "socket.io-client";
import {BleManager} from 'react-native-ble-plx';
export default class App extends Component {
  constructor() {
    super();
    this.uri = "http://10.0.0.5:3030"//Change to your ipv4 adress and desired port
    this.manager = new BleManager();
    this.button_value = '0';
    this.state = {
      chatMessage: "",
      chatMessages: []
    }
  }
  componentWillMount() {
    this.socket = io(this.uri);
    this.socket.on("chat message", msg => {
          this.setState({ chatMessages: [msg]   
     });
    });
    
    const subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);
  }
 
  scanAndConnect() {
    console.log(this.state.chatMessages)
    this.instruct = this.state.chatMessages;
    if (this.instruct == 'ON'){

      console.log("Scanning")
        this.serv_uuid = '00001523-1212-efde-1523-785feabcd123'
        this.charac_uuid = '00001524-1212-efde-1523-785feabcd123'
        this.manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.log(error)
            // Handle error (scanning will be stopped automatically)
            return;
          }
            
                  // Check if it is a device you are looking for based on advertisement data
                  // or other criteria.
                  if (device.id == 'E3:73:08:B6:5A:09') {
                    console.log(device.name);
                    // Stop scanning as it's not necessary if you are scanning for one device.
                    this.manager.stopDeviceScan();
 
                    device.connect()
                      .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                      })
                      .then((device) => {
                        device.readCharacteristicForService(this.serv_uuid, this.charac_uuid)
                          .then((characteristic) => {
                            console.log(characteristic.value);
                            this.button_value = characteristic.value;
                            this.submitCharacteristicValue();
                            return 
                          })
                      })
                      .catch((error) => {
                        console.log(error.message)
                        if (error.message=='Device E3:73:08:B6:5A:09 was disconnected'){
                          this.scanAndConnect();
                        }
                      })
                  }
                  else {
                    console.log("other device detected")
                  }
    });
  }
    }
  submitCharacteristicValue() {
    console.log(this.button_value);
    this.socket.emit('chat message', this.button_value);
    this.setState({chatMessage: ''});
  }
  render() {
    var add = String(Math.random);
    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text style={{alignContent: "center", fontSize: 20, top: 300}} key = {chatMessage + add}>Scanning for device and acquiring data...</Text>
    ));
    return (
      <View>
        <View>
          {chatMessages}
          {this.scanAndConnect()}
        </View>
        <View>
          {/*Button for manual scanning*/}
          
          <TouchableHighlight onPress={() => this.scanAndConnect()}>
            <Image source={require("./assets/bt2.png")}></Image>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 400,
    flex: 1,
    margin: -20,
    paddingHorizontal: 100,
    backgroundColor: '#F5FCFF',
  },
});