import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiMicOff, FiArrowLeft, FiGlobe } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

type Language = {
  code: string;
  name: string;
  voiceName?: string;
};

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English', voiceName: 'Google US English' },
  { code: 'hi-IN', name: 'Hindi', voiceName: 'Google हिन्दी' }
];

const StudentVoiceAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Create a reference to store the Web Speech API recognition object
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage.code;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    
    // Load voices and wait if needed
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // If voices aren't loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        setVoiceAndSpeak();
      };
    } else {
      setVoiceAndSpeak();
    }

    function setVoiceAndSpeak() {
      // Find appropriate voice for the selected language
      const preferredVoice = voices.find(voice => 
        voice.lang === selectedLanguage.code && 
        (!selectedLanguage.voiceName || voice.name.includes(selectedLanguage.voiceName))
      ) || voices.find(voice => 
        voice.lang.startsWith(selectedLanguage.code.split('-')[0])
      ) || voices[0];

      if (preferredVoice) {
        speech.voice = preferredVoice;
        speech.lang = selectedLanguage.code;
      }

      speech.rate = 1.0;
      speech.pitch = 1.0;
      speech.volume = 1.0;

      speech.onstart = () => {
        console.log('Started speaking in', selectedLanguage.name);
      };

      speech.onend = () => {
        console.log('Finished speaking');
      };

      speech.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };

      window.speechSynthesis.speak(speech);
    }
  };

  const handleVoiceInput = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text,
          language: selectedLanguage.code
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setResponse(data.response);
        if (data.shouldSpeak) {
          speakResponse(data.response);
        }
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = selectedLanguage.code.startsWith('hi') 
        ? 'माफ़ कीजिये, कोई त्रुटि हुई है। कृपया पुनः प्रयास करें।'
        : 'Sorry, I encountered an error. Please try again.';
      setResponse(errorMessage);
      speakResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageMenu(false);
    // Reset recognition with new language
    if (recognitionRef.current) {
      recognitionRef.current.lang = language.code;
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-ninja-black/80 via-ninja-black/70 to-ninja-black/60 backdrop-blur-lg z-0" />

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-4xl mx-auto h-full px-6">
          {/* Header */}
          <div className="flex items-center space-x-3 py-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-ninja-black/20 text-ninja-white hover:bg-ninja-black/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-ninja-purple/10 text-ninja-purple flex items-center justify-center backdrop-blur-sm">
              <FiMic className="w-6 h-6" />
            </div>
            <h1 className="font-monument text-ninja-white text-2xl">Voice Assistant</h1>
          </div>

          {/* Main Container */}
          <div className="flex flex-col h-full">
            {/* Conversation Area */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
              {transcript && (
                <div className="mb-4">
                  <div className="inline-block bg-ninja-green/10 text-ninja-white rounded-xl px-4 py-2">
                    {transcript}
                  </div>
                </div>
              )}
              {response && (
                <div className="mb-4">
                  <div className="inline-block bg-ninja-purple/10 text-ninja-white rounded-xl px-4 py-2">
                    {response}
                  </div>
                </div>
              )}
            </div>

            {/* Voice Control Area */}
            <div className="p-6 border-t border-ninja-white/10">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ninja-black/30 text-ninja-white/80 hover:bg-ninja-black/40 transition-colors"
                    >
                      <FiGlobe className="w-4 h-4" />
                      <span>{selectedLanguage.name}</span>
                    </button>

                    {/* Language Dropdown Menu */}
                    {showLanguageMenu && (
                      <div className="absolute bottom-full mb-2 w-48 bg-ninja-black/90 border border-ninja-white/10 rounded-xl overflow-hidden backdrop-blur-lg">
                        {SUPPORTED_LANGUAGES.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language)}
                            className={`w-full px-4 py-2 text-left hover:bg-ninja-purple/10 transition-colors ${
                              selectedLanguage.code === language.code 
                                ? 'text-ninja-purple bg-ninja-purple/5' 
                                : 'text-ninja-white/80'
                            }`}
                          >
                            {language.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mic Button */}
                  <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isListening 
                        ? 'bg-ninja-purple text-ninja-black animate-pulse' 
                        : 'bg-ninja-purple/10 text-ninja-purple hover:bg-ninja-purple hover:text-ninja-black'
                    }`}
                  >
                    {isListening ? (
                      <FiMicOff className="w-8 h-8" />
                    ) : (
                      <FiMic className="w-8 h-8" />
                    )}
                  </button>
                </div>
                <div className="text-center text-ninja-white/60">
                  {isListening ? 'Listening...' : 'Click to speak'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentVoiceAssistant; 