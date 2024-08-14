import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import gptLogo from './assets/chatgpt1.png';
import addBtn from './assets/add-30.png';
import sendBtn from './assets/send.svg';
import userIcon from './assets/my-face.jpg';
import gptImgLogo from './assets/chat_bot_icon.jpeg';
import { saveChatToCache, saveCacheToDb, fetchChatFromDb, fetchChats } from './services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const msgEnd = useRef(null);
  const mapContainer = useRef(null);
  const [input, setInput] = useState("");
  const [option, setOption] = useState("generation");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [similarQuestion, setSimilarQuestion] = useState("");
  const [previousResponses, setPreviousResponses] = useState([]);
  const [mappingData, setMappingData] = useState(null);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chats = await fetchChats();
        setPreviousChats(chats);
      } catch (error) {
        console.error('Error loading chats', error);
      }
    };
    loadChats();
  }, []);

  useEffect(() => {
    if (mappingData && mapContainer.current) {
      plotMap(mappingData);
    }
  }, [mappingData]);

  const clearSimilarQuestion = () => {
    setSimilarQuestion("");
  };

  const handleSend = async () => {
    const text = input;
    setInput('');

    const userMessage = { text, isBot: false, option };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setPreviousResponses(prevResponses => [...prevResponses, userMessage]);

    try {
      const response = await saveChatToCache([userMessage], option);

      console.log('API Response:', response);

      if (option === 'mapping') {
        const mappingData = response.data.response_data;
        console.log(mappingData);

        if (!mappingData || !Array.isArray(mappingData)) {
          throw new Error('Unexpected mapping data format');
        }

        setMappingData(mappingData);

      } else {
        if (!response.data.chat_data || !Array.isArray(response.data.chat_data)) {
          throw new Error('Unexpected API response format');
        }

        const chatData = response.data.chat_data;
        const similarQ = response.data.similar_question || "";

        setSimilarQuestion(similarQ);

        const botResponses = chatData.filter(msg => msg.isBot);
        if (botResponses.length > 0) {
          const botMessages = botResponses.map(botResponse => ({
            text: botResponse.text,
            isBot: true,
            option
          }));
          setMessages(prevMessages => [...prevMessages, ...botMessages]);
          setPreviousResponses(prevResponses => [...prevResponses, ...botMessages]);
        } else {
          console.error('No bot response found');
        }
      }
    } catch (error) {
      console.error('Error during chat processing:', error.message);

      const errorMessage = { text: "Error processing message", isBot: true, option };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setPreviousResponses(prevResponses => [...prevResponses, errorMessage]);

      clearSimilarQuestion();
    }
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') await handleSend();
  };

  const handleNewChat = async () => {
    try {
      if (messages.length > 0) {
        await saveCacheToDb(chatId);
      }
    } catch (error) {
      console.error('Error saving cache to db', error);
    }

    setMessages([]);
    setChatId(null);
    setSimilarQuestion("");
    setPreviousResponses([]);

    try {
      const updatedChats = await fetchChats();
      setPreviousChats(updatedChats);
    } catch (error) {
      console.error('Error loading updated chats', error);
    }
  };

  const loadPreviousChat = async (id) => {
    try {
      const chatData = await fetchChatFromDb(id);
      setMessages(chatData);
      setPreviousResponses(chatData);
      setChatId(id);
      setSimilarQuestion("");
    } catch (error) {
      console.error('Error fetching chat from db', error);
    }
  };

  // Function to plot the map using Leaflet.js
  // Function to plot the map using Leaflet.js
  const plotMap = (mappingData) => {
    if (mapContainer.current) {
      // Clear any existing map
      if (mapContainer.current._leaflet_id) {
        mapContainer.current._leaflet_id = null;
        mapContainer.current.innerHTML = '';
      }

      // Create a new map instance
      const map = L.map(mapContainer.current).setView([51.505, -0.09], 13); // Centering on a default location

      // Add a tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add polygons to the map
      mappingData.forEach((item, index) => {
        try {
          if (item.coordinates && Array.isArray(item.coordinates)) {
            // Extract coordinates for the polygon
            const latLngs = item.coordinates.map(coordPair => {
              if (Array.isArray(coordPair) && coordPair.length === 2) {
                return [coordPair[1], coordPair[0]]; // Convert to [lat, lng]
              } else {
                console.error(`Invalid coordinate format at index ${index}: ${coordPair}`);
                return null; // Return null for invalid coordinates
              }
            }).filter(coord => coord !== null); // Filter out any null coordinates

            // Check if there are valid coordinates to create a polygon
            if (latLngs.length > 0) {
              L.polygon(latLngs, { color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }).addTo(map);
            } else {
              console.error(`No valid coordinates found for polygon at index ${index}`);
            }
          } else {
            console.error(`Missing or invalid coordinates at index ${index}:`, item);
          }
        } catch (error) {
          console.error(`Error processing item at index ${index}:`, error);
        }
      });
    } else {
      console.error('Map container not found');
    }
  };



  return (
    <div className="App">
      <div className="sidebar">
        <div className="fixedContent">
          <img src={gptLogo} alt='logo' className='logo' /><span className='brand'></span>
          <button className='midBtn' onClick={handleNewChat}><img src={addBtn} alt='new chat' className='addBtn' />New Chat</button>
        </div>
        <div className="scrollableContent">
          {previousChats.map((chat) => (
            <button key={chat.id} className='query' onClick={() => loadPreviousChat(chat.id)}>
              Chat {chat.id} - {new Date(chat.created_at).toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className='main'>
        <div className='chats scrollableContent'>
          {previousResponses.map((message, i) =>
            <div key={i} className={message.isBot ? 'chat bot' : 'chat'}>
              <img className='chatImg' src={message.isBot ? gptImgLogo : userIcon} alt='' />
              <p className='txt'>{message.text}</p>
            </div>
          )}
          <div ref={msgEnd}></div>
        </div>

        <div className='chatFooter'>
          {similarQuestion && (
            <div className='similarQuestion' onClick={() => setInput(similarQuestion)}>
              Similar Question: {similarQuestion}
            </div>
          )}
          <div className='inp'>
            <select value={option} onChange={(e) => setOption(e.target.value)}>
              <option value="generation">Generation</option>
              <option value="retrieval">Retrieval</option>
              <option value="comparative">Comparative</option>
              <option value="mapping">Mapping</option>
            </select>
            <input
              type='text'
              placeholder='Send a message'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
            />
            <button className='send' onClick={handleSend}><img src={sendBtn} alt='send' /></button>
          </div>
        </div>

        {/* Map Container */}
        {option === 'mapping' && (
          <div
            className="mapContainer"
            ref={mapContainer}
            style={{ height: '500px', width: '100%' }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default App;
