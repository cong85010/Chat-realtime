import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import dayjs from 'dayjs'
import { onValue, push, ref, set } from "firebase/database";
import { db } from './firebase'

function App() {
  const [conversations, setConversation] = useState([
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      date: Date.now(),
      unread: false
    }
  ])
  const [selectedRoom, setSelectedRoom] = useState({})
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const nameStore = localStorage.getItem('name')
    if (nameStore) {
      setName(nameStore)
    } else {
      const value = window.prompt('Enter your name')
      setName(value)
      localStorage.setItem('name', value)
    }
  }, [])

  useEffect(() => {
    const conversationsRef = ref(db, 'conversations');
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const conversations = Object.keys(data).map(key => {
          return {
            id: key,
            ...data[key]
          }
        })

        setConversation(conversations)
        if (!selectedRoom.id) {
          setSelectedRoom(conversations[0])
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!selectedRoom.id) return;

    const messagesRef = ref(db, `conversations/${selectedRoom.id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.keys(data).map(key => {
          return {
            id: key,
            ...data[key]
          }
        })
        setMessages(messages)
      } else {
        setMessages([])
      }

    })

    return () => {
      unsubscribe()
    }
  }, [selectedRoom])

  const handleCreateConversation = () => {
    try {

      const conversationId = Date.now();
      const newConversation = {
        id: conversationId,
        name: `Conversation ${conversations.length + 1}`,
        lastMessage: '',
        date: Date.now(),
        unread: false
      }
      console.log(newConversation);

      set(ref(db, 'conversations/' + conversationId), newConversation);
    } catch (error) {

      console.log('Error creating conversation', error);

    }
  }

  const handleSendMessage = () => {
    try {
      const newMessage = {
        name: name,
        content: message,
        date: Date.now(),
      }

      push(ref(db, `conversations/${selectedRoom.id}/messages`), newMessage)
      setMessage('')
    } catch (error) {
      console.log('Error sending message', error);
    }
  }

  const handleChangeRoom = (conversation) => {
    setSelectedRoom(conversation)
  }

  return (
    <div className='flex'>
      {/* Sidebar - list conversion */}
      <div className='w-[300px] p-3'>
        <h2 className='text-xl font-bold'>
          Conversations
        </h2>
        <button onClick={handleCreateConversation} className='bg-blue-500 text-white p-2 rounded-md mt-2'>
          Create
        </button>
        {
          conversations.map((conversation, index) => (
            <div onClick={() => handleChangeRoom(conversation)} key={conversation.id} className={`shadow-md rounded-md  p-2 ${conversation.id === selectedRoom.id && 'bg-blue-300'}`}>
              <h5>
                {conversation.name}
              </h5>
              <p>
                {conversation.lastMessage}
              </p>
              <span>
                {dayjs(conversation.date).format('HH:mm DD/MM/YYYY')}
              </span>
            </div>
          ))
        }
      </div>
      {/* Content */}
      <div className='p-3 border-2 flex-1 flex flex-col justify-between'>
        <div className='flex justify-between flex-col'>
          {
            messages?.map((message, index) => (
              <div key={index} className={`p-2 w-[200px] flex flex-col text-left ${message.name === name ? 'items-start self-end' : ''} rounded-md mt-2`}>
                <h5 className=''>
                  {message.name}
                </h5>
                <p>
                  {message.content}
                </p>
                <span>
                  {dayjs(message.date).format('HH:mm DD/MM/YYYY')}
                </span>
              </div>
            ))
          }
        </div>
        <div className='flex justify-between items-center'>
          <input type='text' className='border-2 p-2 rounded-md w-full' value={message} onChange={e => setMessage(e.target.value)} />
          <button onClick={handleSendMessage} className='bg-blue-500 text-white p-2 rounded-md'>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
