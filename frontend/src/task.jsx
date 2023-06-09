import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { app} from "./config/firebaseauth";
import { getAuth} from "firebase/auth"

const db = app.firestore()

export default function Tasks({ token, credits, setCredits }) {
  const [previews, setPreviews] = useState([]);
  const [gender, setGender] = useState('boy');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([])
  const [filesToSend, setFilesToSend] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
  };

  const handleChange = (event) => {
    const fileList = event.target.files;
    const imagePreviews = [];
    const filesToSend = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        imagePreviews.push(reader.result);

        if (imagePreviews.length === fileList.length) {
          setPreviews(imagePreviews);
        }
      };

      filesToSend.push(file);
    }

    setFilesToSend(filesToSend);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit in progress");
    const formData = new FormData();
    formData.append('description', gender);
    for (let i = 0; i < filesToSend.length; i++) {
      formData.append('images', filesToSend[i]);
    }

    try {
      setLoading(true);

      const response = await axios.post('https://futureblend.herokuapp.com/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);

      const { message, msg } = response.data;

      fetchResults()
    } catch (error) {
      console.error('Error generating the image:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get('https://futureblend.herokuapp.com/get-msg', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      console.log("response results", response);
      setResults(response.data.msg);
    navigate('/results', { state: { result: response.data.msg } });
    } catch (error) {
      console.error('Error fetching the results:', error);
    }
  };

    useEffect(() => {
      // Fetch the user's credits from Firestore
      const fetchCredits = async () => {
        try {
          const user = auth.currentUser;
          console.log("user", user);
          if (user) {
            console.log("aki");
            const userSnapshot = await db.collection("users").doc(user.uid).get();
            console.log(userSnapshot);
            if (userSnapshot.exists) {
              console.log("laa");
              const userData = userSnapshot.data();
              let userCredits = userData.credits || 0;
              userCredits -= 1;
              console.log(userCredits);
              setCredits(userCredits);
              console.log("userCredits", userCredits);
              console.log("credits", credits);
      
              // Update Firestore document
              await db.collection("users").doc(user.uid).update({
                credits: userCredits,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching credits:", error);
          // Handle the error gracefully
        }
      };
      
  
      // Listen for changes in the authorizedUser state
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("User is signed in");
          fetchCredits();
        } else {
          console.log("User is signed out");
          setCredits(0);
        }
      });
  
      // Clean up the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }, []);




  return (
    <div className="generate">
      <h1>Generate image now</h1>
      <h2>Your results may vary. We are working on fine-tuning results for each style. Here are some tips to generate better images:</h2>
      <ul>
        <li>Optimize Your Photos: Make sure to upload pictures that focus on the face structure and features.</li>
        <li>Select the Desired Gender: Choose between generating the appearance of a boy or a girl.</li>
        <li>Embrace Good Lighting: Adequate lighting plays a crucial role in enhancing the quality of the generated images.</li>
      </ul>

      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <h3>1. Upload pictures</h3>
        <input type="file" id="images" name="images" multiple onChange={handleChange} />
        {previews.map((preview, index) => (
          <div className="preview" key={index}>
            <img src={preview} alt={`Preview ${index + 1}`} className="preview-pics" />
          </div>
        ))}
        <h3 className="gender">2. Choose gender:</h3>
        <div className="select">
          <select id="gender" name="gender" onChange={handleGenderChange}>
            <option value="boy">Boy</option>
            <option value="young woman">Girl</option>
          </select>
        </div>
        {token ? (
          <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        ) : (
          <Link to="/buy">
          <button className="logout-generate">Generate Image</button>
          </Link>
        )}
        
      </form>
    </div>
  );
}
