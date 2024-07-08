import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Typography, Paper, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SkipNext, Send } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e2f',
  color: '#ffffff',
  padding: '16px',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: '16px',
  borderRight: '1px solid #444',
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingLeft: '16px',
}));

const QuestionBox = styled(Paper)(({ theme }) => ({
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#282a36',
  color: '#f8f8f2',
  borderRadius: '8px',
}));

const EditorBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginBottom: '16px',
}));

const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '16px',
}));

const Timer = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
}));

const buttonStyle = {
  marginLeft: 8,
  color: '#fff',
  backgroundColor: '#3f51b5',
};

function CodeBattlePage() {
  const [code, setCode] = useState('// Write your code here...');
  const [question, setQuestion] = useState('Sample question will be displayed here.');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [score, setScore] = useState(0);
  const [skipCount, setSkipCount] = useState(3);
  const [output, setOutput] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('py');

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
    let jobid;
    try {
      setOutput('Running...');
      const result = await axios.post("http://localhost:3000/app/codecombat/submit", { lang: defaultLanguage, code, question });
      jobid = result.data.jobid;
      let jobIntervalId;
      jobIntervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get("http://localhost:3000/app/codecombat/status/?id=" + jobid);
        const { success, job } = dataRes;
        if (success && job.status === "completed") {
          setOutput(job.output);
          clearInterval(jobIntervalId);
        } else if (!success) {
          setOutput("error connecting to server");
          clearInterval(jobIntervalId);
        }
      }, 500);
    } catch ({ response }) {
      if (response) {
        setOutput(response.data.err.stderr);
      } else {
        setOutput("error connecting to server");
      }
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
      <MainContent>
        <LeftPanel>
          <QuestionBox>
            <Typography variant="h6">Current Question:</Typography>
            <Typography>{question}</Typography>
          </QuestionBox>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel style={{ color: '#fff' }}>Language</InputLabel>
            <Select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              label="Language"
              style={{ color: '#fff', borderColor: '#fff' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#282a36',
                    color: '#fff',
                  },
                },
              }}
            >
              <MenuItem value={"cpp"}>C++</MenuItem>
              <MenuItem value={"py"}>Python</MenuItem>
              <MenuItem value={"javascript"}>JavaScript</MenuItem>
            </Select>
          </FormControl>
          <EditorBox>
            <Editor
              height="60vh"
              defaultLanguage={defaultLanguage}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
            />
          </EditorBox>
        </LeftPanel>
        <RightPanel>
          <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#282a36', color: '#f8f8f2', height: '100%' }}>
            <Typography variant="h6">Output:</Typography>
            <Typography>{output}</Typography>
          </Paper>
        </RightPanel>
      </MainContent>
      <Footer>
        <Typography variant="h6">Score: {score}</Typography>
        <Button
          style={buttonStyle}
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit}
          className="relative bottom-10"
        >
          Submit Code
        </Button>
        <Box>
          <Tooltip title="Skip Question">
            <IconButton style={buttonStyle} onClick={handleSkip} disabled={skipCount <= 0} className="relative bottom-10">
              <SkipNext />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="h6">Skips Left: {skipCount}</Typography>
      </Footer>
    </Container>
  );
}

export default CodeBattlePage;
