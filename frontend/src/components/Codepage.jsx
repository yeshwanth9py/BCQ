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

  const [output1, setOutput1] = useState('');
  const [output2, setOutput2] = useState('');
  const [output3, setOutput3] = useState('');
  const [output4, setOutput4] = useState('');
  const [output5, setOutput5] = useState('');

  const [defaultLanguage, setDefaultLanguage] = useState('py');
  const [qd, setQd] = useState("");

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
    // console.log("running")
    let jobids;
    try {
      setOutput1('Running...');
      setOutput2('Running...');
      setOutput3('Running...');
      setOutput4('Running...');
      setOutput5('Running...');

      if(!code) {
        alert("Please enter code");
      }

      let functioncall = "";

      console.log(defaultLanguage)
      if(defaultLanguage === "py") {
        functioncall = qd.pyfunctioncall;
      }else if(defaultLanguage === "cpp") {
        functioncall = qd.cppfunctioncall;
      }else if(defaultLanguage === "javascript") {
        functioncall = qd.jsfunctioncall;
      }
      console.log("functioncll", functioncall)

      const result = await axios.post("http://localhost:3000/app/codecombat/submit/"+qd.id, { lang: defaultLanguage, code, question, functioncall });
      let job = result.data.job;
      console.log(job)

      let jobIntervalId;
      jobIntervalId = setInterval(async () => {
        const datares = await axios.post("http://localhost:3000/app/codecombat/status/", {job});
        console.log(datares.data) 
        const { success, completed } = datares.data;


        if (success) {
          if (completed) {
            let output = datares.data.job.output;
            let outputarray = output.split("\n");
            console.log("output", outputarray)
            setOutput1(outputarray[0]);
            setOutput2(outputarray[1]);
            setOutput3(outputarray[2]);
            setOutput4(outputarray[3]);
            setOutput5(outputarray[4]);
            clearInterval(jobIntervalId);
          } else{
            console.log("its running");
          }
          
        } else if (!success) {
          setOutput1("error connecting to server");
          setOutput2("error connecting to server");
          setOutput3("error connecting to server");
          setOutput4("error connecting to server");
          console.log(datares)
          
          clearInterval(jobIntervalId);
        }
      }, 500);
    } catch (err) {
      console.log(err);
      
    }
  };


  const handleRun = async () => {
    let jobid;
    try {
      setOutput('Running...');
      const result = await axios.post("http://localhost:3000/app/codecombat/submit/", { lang: defaultLanguage, code, question });
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
        setOutput(response);
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

  async function getQuestion() {
    const qd = await axios.get("http://localhost:3000/app/codecombat/getrandom");
    console.log(qd.data)
    setQuestion(qd.data.question);
    setQd(qd.data);
    if (defaultLanguage == "py") {
      setCode(qd.data.pystubFile);
    } else if (defaultLanguage == "cpp") {
      setCode(qd.data.cppstubFile);
    } else if (defaultLanguage == "js") {
      setCode(qd.data.jsstubFile);
    }
  }

  useEffect(() => {
    getQuestion();
  }, [])

  useEffect(() => {
    if (defaultLanguage == "py") {
      setCode(qd.pystubFile);
    } else if (defaultLanguage == "cpp") {
      setCode(qd.cppstubFile);
    } else if (defaultLanguage == "js") {
      setCode(qd.jsstubFile);
    }
  }, [defaultLanguage])

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
            <Typography>{output1}</Typography>
            <Typography>{output2}</Typography>
            <Typography>{output3}</Typography>
            <Typography>{output4}</Typography>
            <Typography>{output5}</Typography>
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
