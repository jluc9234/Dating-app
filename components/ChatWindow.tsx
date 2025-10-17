import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Match, Message } from '../types';
import { usePremium } from '../contexts/PremiumContext';
import { useAuth } from '../contexts/AuthContext';
import { getConversationSuggestions } from '../services/geminiService';
import { SparklesIcon, InfoIcon } from '../constants';
import { apiService } from '../services/apiService';
import AiSuggestionModal from './AiSuggestionModal';

interface ChatWindowProps {
  match: Match;
  onBack: () => void;
  onPremiumClick: () => void;
}

const getTimeRemaining = (expiry: string): string => {
    const total = Date.parse(expiry) - Date.now();
    if (total <= 0) return "Expired";
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return "Expires soon";
}

const ChatWindow: React.FC<ChatWindowProps> = ({ match: initialMatch, onBack, onPremiumClick }) => {
    const [match, setMatch] = useState(initialMatch);
    const [messages, setMessages] = useState<Message[]>(match.messages);
    const [inputText, setInputText] = useState('');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const { isPremium } = usePremium();
    const { currentUser } = useAuth();
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    // Derived state for chat logic
    const { isDateInterest, isExpired, isCurrentUserAuthor, isInputDisabled, bannerMessage } = useMemo(() => {
        const isDateInterest = match.interestType === 'date';
        if (!isDateInterest || !currentUser) {
            return { isDateInterest: false, isExpired: false, isCurrentUserAuthor: false, isInputDisabled: false, bannerMessage: null };
        }

        const isExpired = match.interestExpiresAt ? new Date(match.interestExpiresAt) < new Date() : false;
        const isCurrentUserAuthor = currentUser.id === match.dateAuthorId;
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

        let isInputDisabled = false;
        let bannerMessage = null;

        if (isExpired) {
            if (isCurrentUserAuthor) {
                isInputDisabled = false;
                bannerMessage = "Initial chat window expired. Send a message to re-engage.";
            } else { // Interested user
                isInputDisabled = lastMessage?.senderId !== match.dateAuthorId;
                bannerMessage = `Chat expired. Respond to ${match.user.name} to continue the conversation.`;
            }
        } else if (match.interestExpiresAt) {
            isInputDisabled = false;
            bannerMessage = `This chat is open for a limited time: ${getTimeRemaining(match.interestExpiresAt)}`;
        }

        return { isDateInterest, isExpired, isCurrentUserAuthor, isInputDisabled, bannerMessage };
    }, [match, messages, currentUser]);


    const handleSend = async () => {
        if (inputText.trim() === '' || !currentUser) return;
        
        const newMessage = await apiService.sendMessage(match.id, currentUser.id, inputText);
        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        if (isExpired && !isCurrentUserAuthor) {
            setMatch(prev => ({...prev, interestExpiresAt: null}));
        }
    };
    
    const handleAiBuddyClick = async () => {
        if (!isPremium) {
            onPremiumClick();
            return;
        }

        setIsSuggestionModalOpen(true);
        setIsLoadingSuggestions(true);
        setSuggestions([]);

        try {
            if (!currentUser) throw new Error("User not found");
            const newSuggestions = await getConversationSuggestions(messages, currentUser, match.user);
            setSuggestions(newSuggestions);
        } catch (error) {
            console.error("Failed to get AI suggestions", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };
    
    const handleSendVoice = async () => {
        if (!currentUser) return;
        
        // For demo, simulate sending a voice message
        const voiceMessage = '🎤 Voice message (demo)';
        const newMessage = await apiService.sendMessage(match.id, currentUser.id, voiceMessage);
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setInputText(suggestion);
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-40 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center p-4 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
                <button onClick={onBack} className="text-slate-300 mr-4">&larr;</button>
                <img src={match.user.images[0]} alt={match.user.name} className="w-10 h-10 rounded-full object-cover" />
                <h2 className="ml-3 text-lg font-bold text-white">{match.user.name}</h2>
                <button 
                    onClick={handleVideoCall}
                    className="ml-auto p-2 bg-green-600 rounded-full text-white disabled:opacity-50 transition-all hover:bg-green-500"
                    title="Start video call"
                    >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   </svg>
                </button>
            </div>
            
            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto flex flex-col">
                <div className="space-y-4 mt-auto">
                    {messages.map((msg, index) => {
                        const isSent = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id} className={`flex items-end ${isSent ? 'justify-end' : 'justify-start'}`}>
                                {!isSent && (
                                    <img src={match.user.images[0]} alt={match.user.name} className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0" />
                                )}
                                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${isSent ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 'bg-slate-700 text-white'} ${isSent ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                {isSent && (
                                    <img src={currentUser?.images[0]} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ml-2 flex-shrink-0" />
                                )}
                            </div>
                        );
                    })}
                    <div ref={endOfMessagesRef} />
                </div>
            </div>
            
            {/* Banner */}
            {bannerMessage && (
                <div className="flex-shrink-0 px-4 py-2 bg-slate-800/70 text-center text-xs text-yellow-300 flex items-center justify-center gap-2">
                    <InfoIcon className="w-4 h-4" />
                    {bannerMessage}
                </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800">
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleAiBuddyClick}
                        disabled={isLoadingSuggestions || isInputDisabled}
                        className="p-2 bg-purple-600 rounded-full text-white disabled:opacity-50 transition-all hover:bg-purple-500"
                        title={isPremium ? "Get AI conversation suggestions" : "Upgrade to Premium for AI Buddy"}
                        >
                       <SparklesIcon className="w-6 h-6"/>
                    </button>
                    <button 
                        onClick={handleSendVoice}
                        disabled={isInputDisabled}
                        className="p-2 bg-gray-600 rounded-full text-white disabled:opacity-50 transition-all hover:bg-gray-500"
                        title="Send voice message"
                        >
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                       </svg>
                    </button>
                    <input 
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isInputDisabled ? "Waiting for a response..." : "Type a message..."}
                        className="flex-grow bg-slate-800 border border-slate-700 rounded-full px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-60"
                        disabled={isInputDisabled}
                    />
                    <button onClick={handleSend} disabled={isInputDisabled} className="bg-pink-600 text-white rounded-full p-3 disabled:opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </div>
             <AiSuggestionModal 
                isOpen={isSuggestionModalOpen}
                onClose={() => setIsSuggestionModalOpen(false)}
                isLoading={isLoadingSuggestions}
                suggestions={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
            />
        </div>
    );
};

export default ChatWindow;