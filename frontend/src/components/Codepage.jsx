import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { SkipNext, Send } from '@mui/icons-material';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import axios from "axios";

const Container = styled(Box)`
  background-color: #1e1e2f;
  color: #ffffff;
  padding: 16px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuestionBox = styled(Paper)`
  padding: 16px;
  margin-bottom: 16px;
  background-color: #282a36;
  color: #f8f8f2;
  border-radius: 4px;
`;

const EditorBox = styled(Box)`
  flex-grow: 1;
  margin-bottom: 16px;
`;

const Footer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Timer = styled(Typography)`
  font-size: 1.5rem;
`;

const buttonStyle = css`
  margin-left: 8px;
`;

function CodeBattlePage() {
  const [code, setCode] = useState('// Write your code here...');
  const [question, setQuestion] = useState('Sample question will be displayed here.');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [score, setScore] = useState(0);
  const [skipCount, setSkipCount] = useState(3);

  const [defaultLanguage, setDefaultLanguage] = useState('cpp');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    try{
      alert('Code submitted!');
      console.log(code);
      const result = await axios.post("http://localhost:3000/app/codecombat/submit", {defaultLanguage, code, question});
      console.log(result.data);
    } catch(err){
      console.log(err);
    }
  };

  const handleSkip = () => {
    if (skipCount > 0) {
      setSkipCount(skipCount - 1);
      // Load next question logic here
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Container>
      <Header>
        <Typography variant="h4">Live Coding Battle</Typography>
        <Timer variant="h6">
          Time Left: {formatTime(timeLeft)}
        </Timer>
      </Header>
      <QuestionBox>
        <Typography variant="h6">Current Question:</Typography>
        <Typography>{question}</Typography>
      </QuestionBox>
      <EditorBox>
        <Editor
          height="60vh"
          defaultLanguage={defaultLanguage}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
      </EditorBox>
      <Footer>
        <Typography variant="h6">Score: {score}</Typography>
        <Box>
          <Tooltip title="Skip Question">
            <IconButton css={buttonStyle} color="secondary" onClick={handleSkip} disabled={skipCount <= 0}>
              <SkipNext />
            </IconButton>
          </Tooltip>
          <Button
            css={buttonStyle}
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={handleSubmit}
          >
            Submit Code
          </Button>
        </Box>
        <Typography variant="h6">Skips Left: {skipCount}</Typography>
      </Footer>
    </Container>
  );
}

export default CodeBattlePage;
