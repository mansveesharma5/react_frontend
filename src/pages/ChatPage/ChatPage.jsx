import React, { useState, useEffect } from 'react';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ChatService from '../../services/ChatService';

export default function ChatPage() {

  // =========================
  // STATE
  // =========================

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // LOAD CHAT HISTORY
  // =========================

  useEffect(() => {

    async function loadInitialData() {

      try {

        const data = await ChatService.loadHistory();

        if (data.status === 'success') {

          const defaultChat = {

            id: '1',

            title: 'Main Chat Room',

            messages: data.history.map((msg) => ({
              sender: msg.sender,
              text: msg.message,
            })),
          };

          setChats([defaultChat]);

          setActiveChatId('1');
        }

      } catch (error) {

        console.error(
          'Failed to load history:',
          error
        );

      } finally {

        setIsLoading(false);

      }
    }

    loadInitialData();

  }, []);

  // =========================
  // SELECT CHAT
  // =========================

  const handleSelectChat = (id) => {

    setActiveChatId(id);

  };

  // =========================
  // CREATE NEW CHAT
  // =========================

  const handleNewChat = () => {

    const newId = String(chats.length + 1);

    const newChat = {

      id: newId,

      title: `New Chat ${newId}`,

      messages: [],
    };

    setChats([
      ...chats,
      newChat,
    ]);

    setActiveChatId(newId);
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSendMessage = (messageText) => {

    // =====================
    // ADD USER MESSAGE
    // =====================

    setChats((prevChats) =>
      prevChats.map((chat) => {

        if (chat.id === activeChatId) {

          return {

            ...chat,

            messages: [

              ...chat.messages,

              {
                sender: 'user',
                text: messageText,
              },
            ],
          };
        }

        return chat;
      })
    );

    // =====================
    // BOT REPLY
    // =====================

    setTimeout(() => {

      setChats((prevChats) =>
        prevChats.map((chat) => {

          if (chat.id === activeChatId) {

            return {

              ...chat,

              messages: [

                ...chat.messages,

                {
                  sender: 'bot',

                  text: `Received your message: ${messageText}`,
                },
              ],
            };
          }

          return chat;
        })
      );

    }, 1000);
  };

  // =========================
  // ACTIVE CHAT
  // =========================

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  );

  // =========================
  // LOADING SCREEN
  // =========================

  if (isLoading) {

    return (

      <div
        style={{
          padding: '20px',
          color: '#fff',
        }}
      >

        Loading Your Chats...

      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (

    <div
      className="app-container"
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >

      {/* ===================== */}
      {/* SIDEBAR */}
      {/* ===================== */}

      <ChatHistory
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* ===================== */}
      {/* CHAT WINDOW */}
      {/* ===================== */}

      <ChatWindow
        activeChat={activeChat}
        onSendMessage={handleSendMessage}
      />

    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import ChatHistory from '../../components/ChatHistory/ChatHistory';
// import ChatWindow from '../../components/ChatWindow/ChatWindow';
// import ChatService from '../../services/ChatService';

// export default function ChatPage() {
//   const [chats, setChats] = useState([]);
//   const [activeChatId, setActiveChatId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load the initial chat list/history from the backend proxy
//   useEffect(() => {
//     async function loadInitialData() {
//       try {
//         const data = await ChatService.loadHistory();
//         if (data.status === 'success') {
//           // If your backend returns an array of chats, map it here.
//           // For now, if it returns a single history list, we create a default chat item:
//           const defaultChat = {
//             id: '1',
//             title: 'Main Chat Room',
//             messages: data.history.map((msg) => ({
//               sender: msg.sender,
//               text: msg.message,
//             })),
//           };
//           setChats([defaultChat]);
//           setActiveChatId('1');
//         }
//       } catch (error) {
//         console.error('Failed to load history in ChatPage:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadInitialData();
//   }, []);

//   const handleSelectChat = (id) => setActiveChatId(id);
//   const handleNewChat = () => {
//     const newId = String(chats.length + 1);
//     setChats([
//       ...chats,
//       { id: newId, title: `New Chat ${newId}`, messages: [] },
//     ]);
//     setActiveChatId(newId);
//   };

//   const activeChat = chats.find((c) => c.id === activeChatId);

//   if (isLoading)
//     return (
//       <div style={{ padding: '20px', color: '#fff' }}>
//         Loading Your Chats...
//       </div>
//     );

//   return (
//     <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
//       <ChatHistory
//         chats={chats}
//         activeChatId={activeChatId}
//         onSelectChat={handleSelectChat}
//         onNewChat={handleNewChat}
//       />
//       <ChatWindow activeChat={activeChat} />
//     </div>
//   );
// }