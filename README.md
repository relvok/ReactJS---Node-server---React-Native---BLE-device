# ReactJS---Node-server---React-Native---BLE-device
Sending a command from a React web app to a Node server, which is received by a React mobile app which operates a BLE peripheral device and sends the data back to the server. 

1. User clicks bluetooth button on React web app.
2. Command is sent to the initialized Node server.
3. Command is pulled by the React native mobile app.
4. If it's the right command, BLE device scanning and connecting commences.
5. Whenever the BLE device manages to connect and send its characteristic value, that data is sent back to the web app (via the server) for display. 
