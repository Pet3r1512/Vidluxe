import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  createContext,
  createRef,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const SocketRef = createRef();

const useSocketContext = () => useContext(SocketContext);

const socket = io("http://localhost:8080");

function ContextProvider({ children }) {
  // useState
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [name, setName] = useState("");
  const [call, setCall] = useState(null);
  const [getCall, setGetCall] = useState(false);
  const [endCall, setEndCall] = useState(false);

  //useRef
  const myVid = useRef();
  const userVid = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVid.current.srcObject = currentStream;
      });
    socket.on("me", (id) => {
      setMe(id);
    });
    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isRecievedCall: true, from, name: callerName, signal });
    });
  }, []);

  const repCall = () => {
    setGetCall(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVid.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = () => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVid.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setGetCall(true);

      peer.signal(signal);
    });
  };

  const leaveCall = () => {
    setEndCall(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const contextProviderValues = {
    call,
    getCall,
    myVid,
    userVid,
    stream,
    name,
    setName,
    endCall,
    me,
    callUser,
    leaveCall,
    repCall,
  };

  return (
    <SocketContext.Provider value={contextProviderValues}>
      {children}
    </SocketContext.Provider>
  );
}

export { ContextProvider, SocketContext, useSocketContext };
