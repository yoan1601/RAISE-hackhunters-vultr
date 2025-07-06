import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, User, ShoppingCart, MapPin, Utensils, Plane, Package, Settings, MessageSquare, Camera, Image, X } from 'lucide-react';

const AgentEcommerceFrontend = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      content: "Hi! I'm your AI shopping assistant. I can help you with food ordering, travel booking, and product searches. What would you like to do today?",
      timestamp: new Date(),
      agent: 'main'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeAgent, setActiveAgent] = useState('main');
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    preferences: ['Italian Food', 'Budget Travel', 'Electronics'],
    location: 'New York, NY'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const agents = {
    main: { name: 'Main Assistant', icon: MessageSquare, color: 'bg-blue-500' },
    food: { name: 'Food Agent', icon: Utensils, color: 'bg-orange-500' },
    travel: { name: 'Travel Agent', icon: Plane, color: 'bg-green-500' },
    shopping: { name: 'Shopping Agent', icon: Package, color: 'bg-purple-500' }
  };

  const quickActions = [
    { icon: Utensils, text: 'Find Italian restaurants nearby', agent: 'food' },
    { icon: Plane, text: 'Plan weekend trip', agent: 'travel' },
    { icon: Package, text: 'Search for electronics', agent: 'shopping' },
    { icon: ShoppingCart, text: 'View my orders', agent: 'main' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInputText("Find Italian restaurants nearby and place an order for dinner");
        setIsListening(false);
      }, 3000);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() || selectedFile) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputText,
        timestamp: new Date(),
        file: selectedFile
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setSelectedFile(null);
      setIsTyping(true);

      // Simulate agent response
      setTimeout(() => {
        const agentResponse = getAgentResponse(inputText);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'agent',
          content: agentResponse.content,
          timestamp: new Date(),
          agent: agentResponse.agent,
          data: agentResponse.data
        }]);
        setActiveAgent(agentResponse.agent);
        setIsTyping(false);
      }, 2000);
    }
  };

  const getAgentResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('italian') || lowerInput.includes('restaurant') || lowerInput.includes('food')) {
      return {
        agent: 'food',
        content: "I found 5 Italian restaurants near you! Here are the top recommendations based on your preferences:",
        data: {
          restaurants: [
            { name: "Mama's Kitchen", rating: 4.8, price: "$$", cuisine: "Italian", distance: "0.3 miles" },
            { name: "Bella Vista", rating: 4.6, price: "$$$", cuisine: "Italian", distance: "0.5 miles" },
            { name: "Pizza Corner", rating: 4.4, price: "$", cuisine: "Italian", distance: "0.7 miles" }
          ]
        }
      };
    } else if (lowerInput.includes('travel') || lowerInput.includes('trip') || lowerInput.includes('vacation')) {
      return {
        agent: 'travel',
        content: "I'd love to help you plan your trip! Based on your profile, here are some weekend getaway suggestions:",
        data: {
          destinations: [
            { name: "Boston", price: "$299", duration: "2 days", highlights: ["Freedom Trail", "Museums"] },
            { name: "Philadelphia", price: "$199", duration: "2 days", highlights: ["Liberty Bell", "Historic Sites"] },
            { name: "Washington DC", price: "$249", duration: "3 days", highlights: ["Monuments", "Smithsonian"] }
          ]
        }
      };
    } else if (lowerInput.includes('electronics') || lowerInput.includes('shopping') || lowerInput.includes('product')) {
      return {
        agent: 'shopping',
        content: "Here are the trending electronics that match your interests:",
        data: {
          products: [
            { name: "Latest Smartphone", price: "$799", rating: 4.7, category: "Mobile" },
            { name: "Wireless Earbuds", price: "$149", rating: 4.5, category: "Audio" },
            { name: "Smart Watch", price: "$299", rating: 4.6, category: "Wearables" }
          ]
        }
      };
    }
    
    return {
      agent: 'main',
      content: "I understand you're looking for assistance. Could you specify if you'd like help with food ordering, travel planning, or product shopping?"
    };
  };

  const handleQuickAction = (action) => {
    setInputText(action.text);
    setActiveAgent(action.agent);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        type: file.type,
        size: file.size
      });
    }
  };

  const renderMessageContent = (message) => {
    if (message.data) {
      if (message.data.restaurants) {
        return (
          <div className="space-y-3">
            <p className="mb-3">{message.content}</p>
            {message.data.restaurants.map((restaurant, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.price} • {restaurant.distance}</p>
                    <p className="text-sm text-yellow-600">⭐ {restaurant.rating}</p>
                  </div>
                  <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      } else if (message.data.destinations) {
        return (
          <div className="space-y-3">
            <p className="mb-3">{message.content}</p>
            {message.data.destinations.map((dest, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{dest.name}</h4>
                    <p className="text-sm text-gray-600">{dest.duration} • {dest.highlights.join(', ')}</p>
                    <p className="text-sm text-green-600 font-medium">{dest.price}</p>
                  </div>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      } else if (message.data.products) {
        return (
          <div className="space-y-3">
            <p className="mb-3">{message.content}</p>
            {message.data.products.map((product, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm text-yellow-600">⭐ {product.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{product.price}</p>
                    <button className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600 mt-1">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }
    }
    
    return <p>{message.content}</p>;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        {/* User Profile */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold">{userProfile.name}</h3>
              <p className="text-sm opacity-90 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {userProfile.location}
              </p>
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="p-4 border-b">
          <h4 className="font-semibold text-gray-800 mb-3">Active Agents</h4>
          <div className="space-y-2">
            {Object.entries(agents).map(([key, agent]) => {
              const AgentIcon = agent.icon;
              return (
                <div 
                  key={key}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    activeAgent === key ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveAgent(key)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agent.color}`}>
                    <AgentIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{agent.name}</span>
                  {activeAgent === key && (
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* User Preferences */}
        <div className="p-4 border-b">
          <h4 className="font-semibold text-gray-800 mb-3">Your Preferences</h4>
          <div className="space-y-2">
            {userProfile.preferences.map((pref, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {pref}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="w-full flex items-center space-x-3 p-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ActionIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{action.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${agents[activeAgent].color}`}>
                {React.createElement(agents[activeAgent].icon, { className: "w-5 h-5 text-white" })}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{agents[activeAgent].name}</h2>
                <p className="text-sm text-gray-600">AI-powered assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white shadow-sm border'
                }`}
              >
                {message.type === 'agent' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${agents[message.agent].color}`}>
                      {React.createElement(agents[message.agent].icon, { className: "w-3 h-3 text-white" })}
                    </div>
                    <span className="text-xs font-medium text-gray-600">{agents[message.agent].name}</span>
                  </div>
                )}
                {renderMessageContent(message)}
                {message.file && (
                  <div className="mt-2 p-2 bg-gray-100 rounded flex items-center space-x-2">
                    <Image className="w-4 h-4" />
                    <span className="text-sm">{message.file.name}</span>
                  </div>
                )}
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Agent is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          {selectedFile && (
            <div className="mb-3 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
              <button onClick={() => setSelectedFile(null)}>
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-lg ${
                isListening ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-gray-600" />}
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening..." : "Type your message..."}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentEcommerceFrontend;