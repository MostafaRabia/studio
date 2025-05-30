
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEmployees } from '@/contexts/employee-context';
import type { Employee } from '@/lib/placeholder-data';
import { X, Paperclip, Send, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  senderId: string; // 'user' for the current user, or employee.id
  senderName: string;
  text: string;
  timestamp: Date;
  avatarUrl?: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const { employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  // Store chat history for all conversations
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentUser = { id: 'currentUser', name: 'You', avatarUrl: 'https://placehold.co/40x40.png?text=Me' }; // Mock current user

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatHistories, selectedEmployeeId]);


  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    if (!chatHistories[employeeId]) {
      // Initialize with a welcome message or load from storage in a real app
      setChatHistories(prev => ({ ...prev, [employeeId]: [] }));
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedEmployeeId) return;

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageInput,
      timestamp: new Date(),
      avatarUrl: currentUser.avatarUrl,
    };

    const updatedHistory = [...(chatHistories[selectedEmployeeId] || []), newMessage];
    setChatHistories(prev => ({ ...prev, [selectedEmployeeId]: updatedHistory }));
    setMessageInput('');

    // Simulate a reply
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedEmployee.id,
        senderName: selectedEmployee.name,
        text: `Thanks for your message! I'll get back to you. (This is an automated reply from ${selectedEmployee.name})`,
        timestamp: new Date(),
        avatarUrl: selectedEmployee.avatarDataUrl || selectedEmployee.avatarUrl || 'https://placehold.co/40x40.png',
      };
      setChatHistories(prev => ({
        ...prev,
        [selectedEmployeeId]: [...updatedHistory, replyMessage],
      }));
    }, 1000);
  };

  const handleAttachFile = () => {
    console.log("Attach file button clicked. Functionality not implemented in this prototype.");
    // In a real app, this would open a file picker
  };

  const currentChat = selectedEmployeeId ? chatHistories[selectedEmployeeId] || [] : [];
  const selectedEmployeeDetails = selectedEmployeeId ? employees.find(e => e.id === selectedEmployeeId) : null;


  if (!isOpen) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[28rem] shadow-xl z-50 flex flex-col rounded-lg border bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
            {selectedEmployeeDetails && (
                <Avatar className="h-7 w-7">
                    <AvatarImage src={selectedEmployeeDetails.avatarDataUrl || selectedEmployeeDetails.avatarUrl} alt={selectedEmployeeDetails.name} />
                    <AvatarFallback>
                        <UserCircle className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
            )}
            <CardTitle className="text-sm font-medium">
            {selectedEmployeeDetails ? `Chat with ${selectedEmployeeDetails.name}` : "Select Employee"}
            </CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="p-3 border-b">
          <Select onValueChange={handleEmployeeSelect} value={selectedEmployeeId || undefined}>
            <SelectTrigger className="w-full h-9 text-xs">
              <SelectValue placeholder="Select an employee to chat with" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id} className="text-xs">
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ScrollArea className="flex-grow p-3" ref={scrollAreaRef}>
          {currentChat.length === 0 && selectedEmployeeId && (
            <p className="text-xs text-muted-foreground text-center py-4">Start a conversation with {selectedEmployeeDetails?.name}.</p>
          )}
          {currentChat.length === 0 && !selectedEmployeeId && (
            <p className="text-xs text-muted-foreground text-center py-4">Select an employee to start chatting.</p>
          )}
          <div className="space-y-3">
            {currentChat.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2 text-xs max-w-[85%]",
                  msg.senderId === currentUser.id ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={msg.avatarUrl} />
                  <AvatarFallback>{msg.senderName.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "p-2 rounded-lg shadow-sm",
                    msg.senderId === currentUser.id
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none"
                  )}
                >
                  <p className="font-medium mb-0.5">{msg.senderId !== currentUser.id ? msg.senderName : null}</p>
                  <p>{msg.text}</p>
                  <p className="text-right text-[0.6rem] opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            rows={1}
            className="text-xs min-h-[2.25rem] max-h-20 resize-none flex-grow p-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!selectedEmployeeId}
          />
          <Button variant="ghost" size="icon" onClick={handleAttachFile} className="h-9 w-9" disabled={!selectedEmployeeId}>
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach File</span>
          </Button>
          <Button onClick={handleSendMessage} size="icon" className="h-9 w-9" disabled={!selectedEmployeeId || !messageInput.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
