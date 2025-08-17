import React, { useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useSidebarContext } from '../context/SidebarContext';

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    width: 100%;
  }
  .input {
    color: #fff;
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
    border-bottom: 2px solid #888;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .input-alt {
    font-size: 1.2rem;
    padding-inline: 1em;
    padding-block: 0.8em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .input-border-alt {
    position: absolute;
    background: linear-gradient(90deg, #FF6464 0%, #FFBF59 50%, #47C9FF 100%);
    width: 0%;
    height: 3px;
    bottom: 0;
    left: 0;
    transition: width 0.4s cubic-bezier(0.42, 0, 0.58, 1.00);
  }
  .input:focus {
    outline: none;
  }
  .input:focus + .input-border-alt {
    width: 100%;
  }
`;

export default function ChatInterface({ onTimestampClick, showVideoPanel }) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState([
    { sender: "agent", name: "Vlexa", text: "Hi. Upload your media and let's talk!", jumpTo: 0, sources: [] },
  ]);

  const scrollRef = useRef(null);
  const { videoMode } = useSidebarContext();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chat]);

  const formatSeconds = (s) => {
    const min = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleSend = async () => {
    if (!query.trim()) return;
    setChat(prev => [...prev, { sender: "user", name: "You", text: query, sources: [] }]);
    setQuery("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          multimode: videoMode === "multimodal"
        }),
      });
      const data = await res.json();

      setChat(prev => [
        ...prev,
        {
          sender: "agent",
          name: "Vlexa",
          text: data.answer || "No response from server.",
          sources: data.sources || [],
        },
      ]);

      if (data.sources?.length && showVideoPanel) showVideoPanel(true);
    } catch (err) {
      console.error(err);
      setChat(prev => [
        ...prev,
        { sender: "agent", name: "Vlexa", text: "⚠️ There was an error.", sources: [] },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        flex={1}
        ref={scrollRef}
        mb={2}
        overflow="auto"
        sx={{ scrollBehavior: "smooth" }}
      >
        <Stack spacing={2} px={1} py={2}>
          {chat.map((msg, i) => (
            <Box
              key={i}
              display="flex"
              flexDirection="column"
              alignItems={msg.sender === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                sx={{
                  bgcolor: msg.sender === "agent" ? "#3a3a3a" : "#5c5c5c",
                  color: "#e0e0e0",
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  maxWidth: "75%",
                  boxShadow: 3,
                }}
              >
                <Typography fontSize={15} whiteSpace="pre-line">
                  {msg.text}
                </Typography>
              </Box>
              {msg.sources?.length > 0 && (
                <Card
                  variant="outlined"
                  sx={{ mt: 1.5, maxWidth: "75%", bgcolor: "#2c2c2c", borderColor: "#444" }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography fontSize={13} fontWeight="bold" gutterBottom color="#FFBF59">
                      🎯 Sources
                    </Typography>
                    <Stack spacing={1.2}>
                      {msg.sources.map((src, idx) => (
                        <Typography
                          key={idx}
                          fontSize={12}
                          sx={{
                            cursor: "pointer",
                            color: "#ddd",
                            '&:hover': { color: '#fff', textDecoration: 'underline' },
                          }}
                          onClick={() => onTimestampClick(src.jumpTo)}
                        >
                          [{formatSeconds(src.jumpTo)}] {src.text}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Box>
          ))}
          {isTyping && (
            <Typography fontStyle="italic" fontSize={13} color="text.secondary">
              Vlexa is thinking...
            </Typography>
          )}
        </Stack>
      </Box>

      <Box display="flex" alignItems="center" p={1.5} gap={1.5}>
        <StyledWrapper style={{ flexGrow: 1 }}>
          <div className="form-control">
            <input
              className="input input-alt"
              placeholder="Ask a question about your video..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <span className="input-border-alt" />
          </div>
        </StyledWrapper>
        <Button
          onClick={handleSend}
          variant="contained"
          sx={{
            bgcolor: "#757575",
            color: "#f5f5f5",
            '&:hover': { bgcolor: '#616161' },
            borderRadius: 2,
            px: 3,
          }}
        >
          Ask
        </Button>
      </Box>
    </Box>
  );
}
