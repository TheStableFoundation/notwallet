"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const faqData = [
  {
    question: "What is The Stable Foundation?",
    answer:
      "The Stable Foundation is a decentralized organization focused on creating stable, accessible financial infrastructure built on blockchain technology. Our mission is to provide transparent, community-driven financial tools that empower users worldwide.",
  },
  {
    question: "What is cryptocurrency?",
    answer:
      "Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. It operates independently of traditional banking systems and enables peer-to-peer transactions without intermediaries.",
  },
  {
    question: "What is a blockchain?",
    answer:
      "A blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block.",
  },
  {
    question: "How do I keep my wallet secure?",
    answer:
      "Never share your private keys or seed phrases with anyone. Store your backup phrase in a secure, offline location. Use strong passwords and enable two-factor authentication when possible. Always verify transaction details before signing.",
  },
  {
    question: "What are transaction fees?",
    answer:
      "Transaction fees are small amounts paid to network validators for processing and confirming transactions on the blockchain. These fees help secure the network and prevent spam transactions.",
  },
  {
    question: "What is a DAO?",
    answer:
      "A DAO (Decentralized Autonomous Organization) is an organization governed by smart contracts and community voting rather than traditional management structures. Members can propose and vote on decisions that affect the organization.",
  },
  {
    question: "How do I participate in governance?",
    answer:
      "You can participate in governance by holding governance tokens, reviewing proposals, and casting votes on important decisions. Active participation helps shape the future direction of the foundation.",
  },
  {
    question: "What is DeFi?",
    answer:
      "DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks. This includes lending, borrowing, trading, and earning yield on digital assets.",
  },
];

export default function LearnPage() {
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello! I'm here to help you learn about cryptocurrency and The Stable Foundation. Ask me anything!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response (in a real app, you'd call an AI API here)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("stable foundation")) {
      return "The Stable Foundation is building the future of decentralized finance with a focus on stability and accessibility. We're committed to creating transparent, community-driven financial infrastructure.";
    }

    if (
      lowerQuestion.includes("wallet") ||
      lowerQuestion.includes("security")
    ) {
      return "Wallet security is crucial! Always keep your seed phrase private, never share it with anyone, and store it securely offline. Use strong passwords and be cautious of phishing attempts.";
    }

    if (lowerQuestion.includes("dao") || lowerQuestion.includes("governance")) {
      return "Our DAO allows community members to participate in decision-making. Hold governance tokens to vote on proposals and help shape the future of The Stable Foundation.";
    }

    if (lowerQuestion.includes("defi") || lowerQuestion.includes("finance")) {
      return "DeFi represents the future of finance - permissionless, transparent, and accessible to everyone. It eliminates traditional intermediaries and gives users full control over their assets.";
    }

    if (
      lowerQuestion.includes("cryptocurrency") ||
      lowerQuestion.includes("crypto")
    ) {
      return "Cryptocurrency is digital money secured by cryptography. It enables peer-to-peer transactions without banks or governments as intermediaries, offering financial freedom and privacy.";
    }

    return "That's a great question! I'd recommend checking our FAQ section above for more detailed information. You can also explore our documentation or reach out to our community for more specific guidance.";
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageChildrenTitleBar title="Learn" />

      <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
        {/* AI Chat Section */}
        <Card
          sx={{
            mb: 3,
            boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
            border: "1px solid rgba(153, 50, 204, 0.05)",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#333",
                fontWeight: 600,
                mb: 2,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <SmartToyIcon sx={{ color: "#9932CC" }} />
              AI Assistant
            </Typography>

            {/* Chat Messages */}
            <Paper
              sx={{
                height: 300,
                overflowY: "auto",
                p: 2,
                mb: 2,
                bgcolor: "#fafbfc",
                border: "1px solid rgba(153, 50, 204, 0.1)",
              }}
            >
              <Stack spacing={2}>
                {chatMessages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      flexDirection: message.isUser ? "row-reverse" : "row",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: message.isUser ? "#9932CC" : "#e3f2fd",
                        color: message.isUser ? "#fff" : "#1565c0",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {message.isUser ? (
                        <PersonIcon fontSize="small" />
                      ) : (
                        <SmartToyIcon fontSize="small" />
                      )}
                    </Box>
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: "75%",
                        bgcolor: message.isUser ? "#9932CC" : "#fff",
                        color: message.isUser ? "#fff" : "#333",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                        {message.text}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                {isLoading && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1565c0",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Box>
                    <Paper sx={{ p: 2, bgcolor: "#fff" }}>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Thinking...
                      </Typography>
                    </Paper>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Stack>
            </Paper>

            {/* Chat Input */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me about crypto or The Stable Foundation..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                sx={{
                  bgcolor: "#9932CC",
                  "&:hover": { bgcolor: "#7d1a99" },
                  minWidth: 48,
                  borderRadius: 2,
                }}
              >
                <SendIcon />
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: "#999",
                fontSize: "0.7rem",
                textAlign: "center",
                display: "block",
              }}
            >
              This is a demo AI assistant. Responses are simulated for
              educational purposes.
            </Typography>
          </Box>
        </Card>

        {/* FAQ Section */}
        <Card
          sx={{
            boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
            border: "1px solid rgba(153, 50, 204, 0.05)",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#333",
                fontWeight: 600,
                mb: 2,
                textAlign: "center",
              }}
            >
              Frequently Asked Questions
            </Typography>

            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 1,
                  "&:before": { display: "none" },
                  boxShadow: "none",
                  border: "1px solid rgba(153, 50, 204, 0.1)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: "#fafbfc",
                    "&:hover": { bgcolor: "#f5f6fa" },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "#fff" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
