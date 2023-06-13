import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


export default function Tasks({ token, credits, setCredits }) {
  const [previews, setPreviews] = useState([]);
  const [gender, setGender] = useState('boy');
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([])
  const [filesToSend, setFilesToSend] = useState([]);
  const navigate = useNavigate();

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
        timeout: 3 * 60 * 1000, // Set the timeout to 2 minutes (in milliseconds)
      });
      console.log("response", response);
  
      const { message, msg } = response.data;
  
      fetchResults();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled due to timeout');
      } else {
        console.error('Error generating the image:', error);
      }
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

        {token && credits > 0 ? (
          <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        ) : (
          <Link to="/buy">
          <button className="logout-generate">Generate Image</button>
          </Link>
        )}
        <p>Image generation takes approximately 1 to 2 minutes.</p>
        {error ? (
           <p>An error occured, please try again.</p>
        ) : (
            <p></p>
        )}
      </form>
    </div>
  );
}
