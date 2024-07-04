import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ToastContainer, toast } from 'react-toastify';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const FileUpload = ({setFormdetails}) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setDownloadURL('');
      setFile(null);
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.warn("Warning Notification !", {
        position: "bottom-left"
      });
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        toast.error(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          setFormdetails((formdetails) => ({
            ...formdetails,
            profilePic: downloadURL
          }));
          console.log('File available at', downloadURL);  
          // const sid = toast.success("Profile pic uploaded successfully!", {
          //   position: "bottom-right"
          // });
          // toast.dismiss(sid);
        });
      }
    );
  };

  return (
    <div>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onChange={handleChange}
      >
        Select file
        <VisuallyHiddenInput type="file" />
      </Button>
      {file && !downloadURL && <button onClick={handleUpload}>Uploade your profile pic</button>}
      {downloadURL && <img src={downloadURL} alt="profile pic" width={100} height={100}/>}
      {(progress > 0 && progress < 100) && <div>Progress: {progress}%</div>}
      {/* {downloadURL && <a href={downloadURL} target="_blank" rel="noopener noreferrer">Download File</a>} */}
      <ToastContainer />
    </div>
  );
};

export default FileUpload;
