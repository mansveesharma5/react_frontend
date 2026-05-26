import React, { useState, useEffect } from 'react';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ChatService from '../../services/ChatService';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the initial chat list/history from the backend proxy
  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await ChatService.loadHistory();
        if (data.status === 'success') {
          // If your backend returns an array of chats, map it here.
          // For now, if it returns a single history list, we create a default chat item:
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
        console.error('Failed to load history in ChatPage:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleSelectChat = (id) => setActiveChatId(id);
  const handleNewChat = () => {
    const newId = String(chats.length + 1);
    setChats([
      ...chats,
      { id: newId, title: `New Chat ${newId}`, messages: [] },
    ]);
    setActiveChatId(newId);
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (isLoading)
    return (
      <div style={{ padding: '20px', color: '#fff' }}>
        Loading Your Chats...
      </div>
    );

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      <ChatHistory
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <ChatWindow activeChat={activeChat} />
    </div>
  );
}