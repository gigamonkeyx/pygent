import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Brain, Dna, Search, Settings, Code, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChat, useUI } from '@/stores/appStore';
import { websocketService } from '@/services/websocket';
import { ChatMessage, ReasoningMode } from '@/types';
import { MessageList } from './MessageList';
import { AgentSelector } from './AgentSelector';
import { ReasoningPanel } from './ReasoningPanel';
import { cn } from '@/utils/cn';

export type AgentType = 'reasoning' | 'evolution' | 'search' | 'general' | 'coding' | 'research';

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [message, setMessage] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentType>('reasoning');
  const [isConnected, setIsConnected] = useState(false);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    activeConversation,
    typingUsers,
    addMessage,
    setTypingUser
  } = useChat();

  const { setLoading } = useUI();

  const currentMessages = conversations.get(activeConversation) || [];

  useEffect(() => {
    // Initialize WebSocket connection
    const initializeConnection = async () => {
      try {
        setLoading('chat', true);
        const connected = await websocketService.connect();
        setIsConnected(connected);
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
      } finally {
        setLoading('chat', false);
      }
    };

    // Check if already connected
    if (websocketService.isConnected()) {
      setIsConnected(true);
      setLoading('chat', false);
    } else {
      initializeConnection();
    }

    // Set up event listeners
    const unsubscribeResponse = websocketService.on('chat_response', (data: any) => {
      if (data.message) {
        addMessage(activeConversation, data.message);
      }
    });

    const unsubscribeTyping = websocketService.on('typing_indicator', (data: any) => {
      setTypingUser(data.user_id, data.typing);
    });

    const unsubscribeConnection = websocketService.on('connection_status', (data: any) => {
      setIsConnected(data.connected);
    });

    return () => {
      unsubscribeResponse();
      unsubscribeTyping();
      unsubscribeConnection();
    };
  }, [activeConversation, addMessage, setTypingUser, setLoading]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const sendMessage = async () => {
    if (!message.trim() || !isConnected) return;

    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
      metadata: {
        reasoning_mode: getReasoningModeForAgent(activeAgent)
      }
    };

    // Add user message immediately
    addMessage(activeConversation, chatMessage);

    try {
      // Send message via WebSocket
      websocketService.sendChatMessage({
        ...chatMessage,
        agentId: activeAgent
      });

      // Clear input
      setMessage('');

      // Show reasoning panel for reasoning agent
      if (activeAgent === 'reasoning') {
        setShowReasoningPanel(true);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Add error notification
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getReasoningModeForAgent = (agent: AgentType): ReasoningMode => {
    switch (agent) {
      case 'reasoning':
        return ReasoningMode.TOT_ENHANCED_RAG;
      case 'evolution':
        return ReasoningMode.ADAPTIVE;
      case 'search':
        return ReasoningMode.RAG_ONLY;
      case 'coding':
        return ReasoningMode.ADAPTIVE;
      case 'research':
        return ReasoningMode.RAG_ONLY;
      default:
        return ReasoningMode.ADAPTIVE;
    }
  };

  const getAgentIcon = (agent: AgentType) => {
    switch (agent) {
      case 'reasoning':
        return <Brain className="h-4 w-4" />;
      case 'evolution':
        return <Dna className="h-4 w-4" />;
      case 'search':
        return <Search className="h-4 w-4" />;
      case 'coding':
        return <Code className="h-4 w-4" />;
      case 'research':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getAgentDescription = (agent: AgentType) => {
    switch (agent) {
      case 'reasoning':
        return 'Advanced Tree of Thought reasoning with multi-path exploration';
      case 'evolution':
        return 'AI-guided recipe evolution and optimization';
      case 'search':
        return 'GPU-accelerated vector search and document retrieval';
      case 'coding':
        return 'Expert code generation, analysis, debugging, and optimization';
      case 'research':
        return 'Academic and historical research with literature review capabilities';
      default:
        return 'General AI assistant for various tasks';
    }
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <Card className="rounded-none border-x-0 border-t-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getAgentIcon(activeAgent)}
                  <CardTitle className="text-lg">
                    {activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)} Agent
                  </CardTitle>
                </div>
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                )} />
              </div>
              <div className="flex items-center space-x-2">
                <AgentSelector
                  value={activeAgent}
                  onChange={setActiveAgent}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReasoningPanel(!showReasoningPanel)}
                  className={cn(
                    activeAgent === 'reasoning' ? 'visible' : 'invisible'
                  )}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {getAgentDescription(activeAgent)}
            </p>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={currentMessages}
            typingUsers={typingUsers}
            className="h-full"
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <Card className="rounded-none border-x-0 border-b-0">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask the ${activeAgent} agent...`}
                disabled={false}
                className="flex-1"
                aria-label="Chat message input"
                data-testid="chat-input"
                id="chat-input"
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim() || !isConnected}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isConnected && (
              <p className="text-sm text-yellow-600 mt-2">
                ⚠️ Running in offline mode - real-time features unavailable
              </p>
            )}
            {typingUsers.size > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                AI agent is thinking...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reasoning Panel */}
      {showReasoningPanel && activeAgent === 'reasoning' && (
        <div className="w-96 border-l">
          <ReasoningPanel
            onClose={() => setShowReasoningPanel(false)}
          />
        </div>
      )}
    </div>
  );
};
