import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react';

export default function Tasks({token}) {
    const [previews, setPreviews] = useState([]);
    const [tasks, setTasks] = useState([])
    const [gender, setGender] = useState('boy');

const handleGenderChange = (event) => {
  const selectedGender = event.target.value;
  setGender(selectedGender);
};


    const handleChange = (event) => {
        const fileList = event.target.files;
        const imagePreviews = [];
      
        // Loop through each file
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const reader = new FileReader();
      
          // Read the file as a data URL
          reader.readAsDataURL(file);
      
          // Callback function when the file is loaded
          reader.onloadend = () => {
            // Add the image preview to the array
            imagePreviews.push(reader.result);
      
            // If all images have been processed, update the state with the previews
            if (imagePreviews.length === fileList.length) {
              setPreviews(imagePreviews);
            }
          };
        }
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('description', gender);
        for (let i = 0; i < previews.length; i++) {
          formData.append('images', previews[i]);
        }
        try {
            const response = await axios.post('https://futureblend.herokuapp.com/generate', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
              },
            });
      
            console.log(response.data);
            // Handle the response or perform any other necessary actions
          } catch (error) {
            console.error('Error generating the image:', error);
            // Handle the error or display an error message
          }
    };
  
  
    return (
      <>
      <div className="generate">
        <h1>Generate image now</h1>
        <h2>Your results may vary. We are working on fine tuning results for each style. Here are some tips to make better icons:    </h2>
            <ul>
            <li>Optimize Your Photos: Make sure to upload pictures that focus on the face structure and features.</li>
            <li>Select the Desired Gender: Choose between generating the appearance of a boy or a girl.</li>
            <li>Embrace Good Lighting: Adequate lighting plays a crucial role in enhancing the quality of the generated images.</li>
            </ul>
     
        <form enctype="multipart/form-data" onSubmit={handleSubmit}>
            <h3>1. Upload pictures</h3>
      <input type="file" id="images" name="images" multiple onChange={handleChange} />
      {previews.map((preview, index) => (
        <div className="preview">
      <img key={index} src={preview} alt={`Preview ${index + 1}`} className="preview-pics" />
      </div>
      ))}
      <h3 className="gender">2. Choose gender:</h3>
     <select id="gender" name="gender" onChange={handleGenderChange}>
       <option value="boy">Boy</option>
       <option value="girl">Girl</option>
     </select>
      <button type="submit">Generate Image</button>
        </form>
      </div>
      </>
    )
  }