import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.scss';
import Test from './Components/Test';

function Hello() {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const createHubConnection = async (teamName: string) => {
    try {
      const hubConnection = new HubConnectionBuilder()
        .withUrl('https://localhost:7221/gamehub')
        .configureLogging(LogLevel.Information)
        .build();

      hubConnection.on('ReceiveMessage', (message) => {
        console.log(message);
      });

      console.log('starting connection: ', hubConnection.state);

      await hubConnection.start();

      console.log('connection should be started: ', hubConnection.state);

      setConnection(hubConnection);
      await hubConnection.invoke('RegisterTeam', teamName);

      // console.log('send test message invoked:', connection.state);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>Show master</h1>
      <Test onConnectClickAsync={createHubConnection} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
