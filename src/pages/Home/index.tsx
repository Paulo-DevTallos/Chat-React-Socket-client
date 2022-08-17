import React, { useEffect, useState } from "react"
import * as uuid from 'uuid'

import { io } from "socket.io-client"
import { Container } from "./styles"

interface Message {
  id: string;
  name: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

const socket = io('http://localhost:4002') 

const Home: React.FC = () => {
  const [title] = useState('Chat Web')
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => { 
    function receivedMessage(message: Payload) {
      const newMessage: Message = {
        id: uuid.v4(),
        name: message.name,
        text: message.text,
      }

      setMessages([...messages, newMessage])
    } 
    socket.on('msgToClient', (message: Payload) => {
      receivedMessage(message)
    })
  }, [messages, name, text])
  
  function validateInput() {
    return name.length > 0 && text.length > 0
  }

  function sendMessage() {
    if (validateInput()) {
      const message: Payload = {
        name,
        text,
      }

      socket.emit('msgToServer', message)
      setText('')
    }  
  }

  return(
    <Container>
      <div>
        <h1>{title}</h1>
        <input 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter name..."
        />
        <div>
          <ul>
            {
              messages.map(message => {
                if(message.name === name) {
                  return(
                    <li key="message.id">
                      <span>
                        {message.name}
                        {'diz...'}
                      </span>
                      <p>{message.text}</p>
                    </li>
                  )
                }

                return(
                  <li key={message.id}>
                    <span>
                      {message.name}
                    </span>
                    <p>{message.text}</p>
                  </li>
                )
              })
            }
          </ul>
          <input 
            type="text" 
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter message ..."
          />
          <button type="button" onClick={() => sendMessage()}>
            send
          </button>
        </div>
      </div>
    </Container>
  )
}

export default Home