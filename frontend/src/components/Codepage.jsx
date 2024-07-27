import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Typography, Paper, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SkipNext, Send } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/system';
import CancelIcon from '@mui/icons-material/Cancel';
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

  const [outexp, setoutexp] = useState({
    "testcase1": {
      input: "",
      output: "",
      expected: ""
    },
    "testcase2": {
      input: "",
      output: "",
      expected: ""
    },
    "testcase3": {
      input: "",
      output: "",
      expected: ""
    },
    "testcase4": {
      input: "",
      output: "",
      expected: ""
    },
    "testcase5": {
      input: "",
      output: "",
      expected: ""
    },

  });

  const [output, setOutput] = useState("");

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


  useEffect(() => {
    console.log(outexp);
  }, [outexp])

  const handleSubmit = async () => {
    // console.log("running")
    let jobids;
    setOutput("Testcase-1")
    try {
      setoutexp({
        testcase1: {
          ...outexp.testcase1,
          output: "Running...",
        },
        testcase2: {
          ...outexp.testcase2,
          output: "Running...",
        },
        testcase3: {
          ...outexp.testcase3,
          output: "Running...",
        },
        testcase4: {
          ...outexp.testcase4,
          output: "Running...",
        },
        testcase5: {
          ...outexp.testcase5,
          output: "Running...",
        }
      })

      if (!code) {
        alert("Please enter code");
      }

      let functioncall = "";

      console.log(defaultLanguage)
      if (defaultLanguage === "py") {
        functioncall = qd.pyfunctioncall;
      } else if (defaultLanguage === "cpp") {
        functioncall = qd.cppfunctioncall;
      } else if (defaultLanguage === "javascript") {
        functioncall = qd.jsfunctioncall;
      }
      console.log("functioncll", functioncall)

      const result = await axios.post("http://localhost:3000/app/codecombat/submit/" + qd.id, { lang: defaultLanguage, code, question, functioncall });
      let job = result.data.job;
      console.log(job)

      let jobIntervalId;
      jobIntervalId = setInterval(async () => {
        const datares = await axios.post("http://localhost:3000/app/codecombat/status/", { job });
        console.log(datares.data)
        const { success, completed } = datares.data;


        if (success) {
          if (completed) {
            console.log("datares", datares.data)
            let output = datares.data.job.output;
            let outputarray = output;
            console.log("output", outputarray)
            setoutexp({
              testcase1: {
                input: outputarray[0].input,
                output: outputarray[0].output,
                expected: outputarray[0].expected,
                passed: outputarray[0].passed
              },
              testcase2: {
                input: outputarray[1].input,
                output: outputarray[1].output,
                expected: outputarray[1].expected,
                passed: outputarray[1].passed
              },
              testcase3: {
                input: outputarray[2].input,
                output: outputarray[2].output,
                expected: outputarray[2].expected,
                passed: outputarray[2].passed
              },
              testcase4: {
                input: outputarray[3].input,
                output: outputarray[3].output,
                expected: outputarray[3].expected,
                passed: outputarray[3].passed
              },
              testcase5: {
                input: outputarray[4].input,
                output: outputarray[4].output,
                expected: outputarray[4].expected,
                passed: outputarray[4].passed
              }
            })


            clearInterval(jobIntervalId);
            let totpassed = 0;
            for (let i = 0; i < outputarray.length; i++) {
              if (outputarray[i].passed === true) {
                totpassed = totpassed + 1;
              }
            }

            if (totpassed == 5) {

              console.log("total passed", totpassed)

              setTimeout(() => {
                alert("Your score is " + (score + 100));
                setScore((score) => score + 100);
                getQuestion();
                setoutexp({
                  "testcase1": {
                    input: "",
                    output: "",
                    expected: ""
                  },
                  "testcase2": {
                    input: "",
                    output: "",
                    expected: ""
                  },
                  "testcase3": {
                    input: "",
                    output: "",
                    expected: ""
                  },
                  "testcase4": {
                    input: "",
                    output: "",
                    expected: ""
                  },
                  "testcase5": {
                    input: "",
                    output: "",
                    expected: ""
                  },
                })
              }, 1000)
            }
          } else {
            console.log("its running");
          }

        } else if (!success) {
          setoutexp({
            testcase1: {
              ...outexp.testcase1,
              output: "Some error",
            },
            testcase2: {
              ...outexp.testcase2,
              output: "Some error",
            },
            testcase3: {
              ...outexp.testcase3,
              output: "Some error",
            },
            testcase4: {
              ...outexp.testcase4,
              output: "Some error",
            },
            testcase5: {
              ...outexp.testcase5,
              output: "Some error",
            }
          })
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
          setQd(job);
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
    // console.log("qd",qd.data)
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
        <h1 className='font-bold text-xl ml-3'>Total Score:-{score}</h1>
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
          <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#282a36', color: '#f8f8f2', minHeight: '70%', marginTop: '26%', display: "flex", justifyContent: "space-between" }}>
            <div className='w-fit'>
              <div
                className={`py-3 border-2 my-2 rounded px-2 w-fit flex flex-col cursor-pointer ${output === "Testcase-1" ? "bg-green-800" : ""}`}
                onClick={() => setOutput("Testcase-1")}
              >
                Testcase-1 {outexp?.testcase1?.passed ? (
                  <CheckCircleIcon sx={{ color: 'green' }} />
                ) : (
                  outexp?.testcase1?.passed === false ? <CancelIcon sx={{ color: 'red' }} /> : ""
                )}
              </div>


              <div
                className={`py-3 border-2 my-2 rounded px-2 w-fit flex flex-col cursor-pointer ${output === "Testcase-2" ? "bg-green-800" : ""}`}
                onClick={() => setOutput("Testcase-2")}
              >
                Testcase-2 {outexp?.testcase2?.passed ? (
                  <CheckCircleIcon sx={{ color: 'green' }} />
                ) : (
                  outexp?.testcase2?.passed === false ? <CancelIcon sx={{ color: 'red' }} /> : ""
                )}

              </div>
              <div
                className={`py-3 border-2 my-2 rounded px-2 w-fit flex flex-col cursor-pointer ${output === "Testcase-3" ? "bg-green-800" : ""}`}
                onClick={() => setOutput("Testcase-3")}
              >
                Testcase-3 {outexp?.testcase3?.passed ? (
                  <CheckCircleIcon sx={{ color: 'green' }} />
                ) : (
                  outexp?.testcase3?.passed === false ? <CancelIcon sx={{ color: 'red' }} /> : ""
                )}

              </div>

              <div
                className={`py-3 border-2 my-2 rounded px-2 w-fit flex flex-col cursor-pointer ${output === "Testcase-4" ? "bg-green-800" : ""}`}
                onClick={() => setOutput("Testcase-4")}
              >Testcase-4 {outexp?.testcase4?.passed ? (
                <CheckCircleIcon sx={{ color: 'green' }} />
              ) : (
                outexp?.testcase4?.passed === false ? <CancelIcon sx={{ color: 'red' }} /> : ""
              )}
              </div>

              <div
                className={`py-3 border-2 my-2 rounded px-2 w-fit flex flex-col cursor-pointer ${output === "Testcase-5" ? "bg-green-800" : ""}`}
                onClick={() => setOutput("Testcase-5")}
              >Testcase-5 {outexp?.testcase5?.passed ? (
                <CheckCircleIcon sx={{ color: 'green' }} />
              ) : (
                outexp?.testcase5?.passed === false ? <CancelIcon sx={{ color: 'red' }} /> : ""
              )}
              </div>
            </div>
            <div className='w-10/12'>
              <div className='my-2'>Input:</div>
              <Paper style={{ backgroundColor: "gray", minHeight: "10%", maxHeight: "30%", padding: "10px" }}>
                <Typography variant="h6" style={{ color: "white" }}>
                  {output === "Testcase-1" ? outexp.testcase1.input.replace('"', '').replace('"', '') : ""}
                  {output === "Testcase-2" ? outexp.testcase2.input.replace('"', '').replace('"', '') : ""}
                  {output === "Testcase-3" ? outexp.testcase3.input.replace('"', '').replace('"', '') : ""}
                  {output === "Testcase-4" ? outexp.testcase4.input.replace('"', '').replace('"', '') : ""}
                  {output === "Testcase-5" ? outexp.testcase5.input.replace('"', '').replace('"', '') : ""}
                </Typography>
              </Paper>
              <div className='mt-2 mb-1'>Your output:</div>
              <div style={{ backgroundColor: "gray", minHeight: "20%", maxHeight: "40%" }} className='rounded'>
                <Typography
                  variant="h6"
                  style={{
                    color: "white",
                    wordWrap: "break-word", // Wrap text within the container
                    whiteSpace: "normal", // Allow normal white space handling
                    overflowY: "auto", // Show a vertical scrollbar if content overflows
                    padding: "10px",
                  }}
                >

                  {output === "Testcase-1" ? outexp.testcase1.output : ""}
                  {output === "Testcase-2" ? outexp.testcase2.output : ""}
                  {output === "Testcase-3" ? outexp.testcase3.output : ""}
                  {output === "Testcase-4" ? outexp.testcase4.output : ""}
                  {output === "Testcase-5" ? outexp.testcase5.output : ""}

                </Typography>
              </div>
              <div className='mt-2 mb-1'>Expected output:</div>
              <div style={{ backgroundColor: "gray", minHeight: "20%", maxHeight: "40%" }} className='rounded'>
                <Typography variant="h6" style={{
                  color: "white",
                  wordWrap: "break-word", // Wrap text within the container
                  whiteSpace: "normal", // Allow normal white space handling
                  overflowY: "auto", // Show a vertical scrollbar if content overflows
                  padding: "10px",
                }}>
                  {output === "Testcase-1" ? outexp.testcase1.expected : ""}
                  {output === "Testcase-2" ? outexp.testcase2.expected : ""}
                  {output === "Testcase-3" ? outexp.testcase3.expected : ""}
                  {output === "Testcase-4" ? outexp.testcase4.expected : ""}
                  {output === "Testcase-5" ? outexp.testcase5.expected : ""}
                </Typography>
              </div>

            </div>
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
