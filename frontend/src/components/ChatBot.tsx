import { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { IoLanguage } from 'react-icons/io5';

type Language = 'en' | 'hi';

interface FAQItem {
  question: {
    en: string;
    hi: string;
  };
  answer: {
    en: string;
    hi: string;
  };
}

const FAQ_DATA: FAQItem[] = [
  {
    question: {
      en: "What is this website about?",
      hi: "यह वेबसाइट किस बारे में है?"
    },
    answer: {
      en: "This is a comprehensive tech learning platform designed to help you master coding and technology skills. We offer structured courses, hands-on projects, and expert guidance to help you build a successful career in tech.",
      hi: "यह एक व्यापक तकनीकी शिक्षण प्लेटफॉर्म है जो आपको कोडिंग और तकनीकी कौशल में महारत हासिल करने में मदद करता है। हम संरचित पाठ्यक्रम, व्यावहारिक परियोजनाएं और विशेषज्ञ मार्गदर्शन प्रदान करते हैं।"
    }
  },
  {
    question: {
      en: "How do I create an account?",
      hi: "मैं अकाउंट कैसे बनाऊं?"
    },
    answer: {
      en: "Click the 'Sign Up' button in the navigation bar, fill in your details, and you'll be ready to start your learning journey. The process takes less than 2 minutes!",
      hi: "'साइन अप' बटन पर क्लिक करें, अपना विवरण भरें, और आप अपनी सीखने की यात्रा शुरू करने के लिए तैयार हो जाएंगे। प्रक्रिया 2 मिनट से भी कम समय लेती है!"
    }
  },
  {
    question: {
      en: "Will this website help me grow my knowledge?",
      hi: "क्या यह वेबसाइट मेरे ज्ञान को बढ़ाने में मदद करेगी?"
    },
    answer: {
      en: "Absolutely! Our platform offers interactive courses, real-world projects, and expert mentorship. We cover everything from basic programming to advanced tech skills, ensuring continuous learning and growth.",
      hi: "बिल्कुल! हमारा प्लेटफॉर्म इंटरैक्टिव कोर्स, वास्तविक प्रोजेक्ट्स और एक्सपर्ट मेंटरशिप प्रदान करता है। हम बेसिक प्रोग्रामिंग से लेकर एडवांस्ड टेक स्किल्स तक सब कुछ कवर करते हैं।"
    }
  },
  {
    question: {
      en: "What technologies can I learn here?",
      hi: "यहां मैं कौन सी तकनीकें सीख सकता/सकती हूं?"
    },
    answer: {
      en: "We offer courses in React, Node.js, Python, TypeScript, MongoDB, AWS, Docker, GraphQL, and many more. Our curriculum is regularly updated to include the latest tech trends.",
      hi: "हम React, Node.js, Python, TypeScript, MongoDB, AWS, Docker, GraphQL और बहुत कुछ में कोर्स प्रदान करते हैं। हमारा पाठ्यक्रम नवीनतम तकनीकी ट्रेंड्स को शामिल करने के लिए नियमित रूप से अपडेट किया जाता है।"
    }
  },
  {
    question: {
      en: "Do you provide certificates?",
      hi: "क्या आप सर्टिफिकेट प्रदान करते हैं?"
    },
    answer: {
      en: "Yes! Upon completing each course, you'll receive a verified certificate that you can share on your LinkedIn profile or with potential employers.",
      hi: "हाँ! प्रत्येक कोर्स पूरा करने पर, आपको एक वेरिफाइड सर्टिफिकेट मिलेगा जिसे आप अपनी LinkedIn प्रोफाइल या संभावित नियोक्ताओं के साथ शेयर कर सकते हैं।"
    }
  },
  {
    question: {
      en: "Is there a community of learners?",
      hi: "क्या यहां सीखने वालों का एक समुदाय है?"
    },
    answer: {
      en: "Yes! We have a vibrant community of tech enthusiasts. You can collaborate on projects, participate in discussions, and network with fellow learners through our community forum.",
      hi: "हाँ! हमारे पास टेक एन्थुसिअस्ट्स का एक जीवंत समुदाय है। आप हमारे कम्युनिटी फोरम के माध्यम से प्रोजेक्ट्स पर सहयोग कर सकते हैं, चर्चाओं में भाग ले सकते हैं।"
    }
  },
  {
    question: {
      en: "Can I learn at my own pace?",
      hi: "क्या मैं अपनी गति से सीख सकता/सकती हूं?"
    },
    answer: {
      en: "Absolutely! All our courses are self-paced, allowing you to learn according to your schedule. You can access the content 24/7 and progress at a speed that suits you.",
      hi: "बिल्कुल! हमारे सभी कोर्स सेल्फ-पेस्ड हैं, जो आपको अपनी सुविधा के अनुसार सीखने की अनुमति देते हैं। आप 24/7 कंटेंट एक्सेस कर सकते हैं।"
    }
  },
  {
    question: {
      en: "Is there a mobile app available?",
      hi: "क्या मोबाइल ऐप उपलब्ध है?"
    },
    answer: {
      en: "Yes! Our mobile app is available for both iOS and Android, allowing you to learn on the go. You can download it from the respective app stores.",
      hi: "हाँ! हमारा मोबाइल ऐप iOS और Android दोनों के लिए उपलब्ध है, जो आपको चलते-फिरते सीखने की सुविधा देता है। आप इसे संबंधित ऐप स्टोर से डाउनलोड कर सकते हैं।"
    }
  },
  {
    question: {
      en: "Do you provide mentorship?",
      hi: "क्या आप मेंटरशिप प्रदान करते हैं?"
    },
    answer: {
      en: "Yes! Our expert mentors provide regular code reviews, feedback, and guidance. You can schedule 1-on-1 sessions to discuss your progress and get help with challenges.",
      hi: "हाँ! हमारे एक्सपर्ट मेंटर्स नियमित कोड रिव्यू, फीडबैक और मार्गदर्शन प्रदान करते हैं। आप अपनी प्रगति पर चर्चा करने और चुनौतियों में मदद पाने के लिए 1-on-1 सेशन शेड्यूल कर सकते हैं।"
    }
  },
  {
    question: {
      en: "How long does it take to complete a course?",
      hi: "एक कोर्स पूरा करने में कितना समय लगता है?"
    },
    answer: {
      en: "Course duration varies depending on the complexity and your dedication. On average, beginner courses take 4-6 weeks, while advanced courses might take 8-12 weeks to complete.",
      hi: "कोर्स की अवधि जटिलता और आपके समर्पण पर निर्भर करती है। औसतन, बिगिनर कोर्स 4-6 सप्ताह लेते हैं, जबकि एडवांस्ड कोर्स पूरा होने में 8-12 सप्ताह लग सकते हैं।"
    }
  },
  {
    question: {
      en: "Can I switch between different courses?",
      hi: "क्या मैं विभिन्न कोर्स के बीच स्विच कर सकता/सकती हूं?"
    },
    answer: {
      en: "Yes! With our flexible learning system, you can switch between different courses and create your own learning path based on your interests and career goals.",
      hi: "हाँ! हमारी फ्लेक्सिबल लर्निंग सिस्टम के साथ, आप विभिन्न कोर्स के बीच स्विच कर सकते हैं और अपनी रुचि और करियर लक्ष्यों के आधार पर अपना खुद का लर्निंग पाथ बना सकते हैं।"
    }
  }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const handleQuestionClick = (index: number) => {
    setSelectedQuestion(index);
  };

  const handleBack = () => {
    setSelectedQuestion(null);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      {/* Chat Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center w-14 h-14 rounded-full bg-ninja-green text-ninja-black shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce-subtle`}
      >
        <FaRobot className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col w-96 h-[500px] bg-ninja-black border border-ninja-green/20 rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ninja-green/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaRobot className="w-6 h-6 text-ninja-green" />
              <span className="font-monument text-ninja-white">FAQ Assistant</span>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-ninja-white/80 hover:text-ninja-white"
            >
              <IoLanguage className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedQuestion(null);
            }}
            className="text-ninja-white/60 hover:text-ninja-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedQuestion === null ? (
            // Questions List
            <div className="space-y-2">
              {FAQ_DATA.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(index)}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-ninja-white/80 hover:text-ninja-white"
                >
                  {faq.question[language]}
                </button>
              ))}
            </div>
          ) : (
            // Answer View
            <div className="space-y-4">
              <button
                onClick={handleBack}
                className="text-ninja-green hover:text-ninja-green/80 transition-colors flex items-center gap-2"
              >
                {language === 'en' ? '← Back to Questions' : '← प्रश्नों पर वापस जाएं'}
              </button>
              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="font-monument text-ninja-green mb-2">{FAQ_DATA[selectedQuestion].question[language]}</h3>
                <p className="text-ninja-white/80 leading-relaxed">{FAQ_DATA[selectedQuestion].answer[language]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
