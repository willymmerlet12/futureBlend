import dotenv from 'dotenv'
dotenv.config()
import axios, { AxiosResponse } from 'axios';
import express from "express";
import { Midjourney } from "./src";
import bodyParser from "body-parser";
import multer from "multer";
import { appli } from "./Utlis/config";
import { ref, getDownloadURL, uploadBytesResumable, uploadBytes} from "firebase/storage";

const uploadMiddleware = multer({ storage: multer.memoryStorage() }).array('images', 2);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const client = new Midjourney({
  ServerId: process.env.SERVER_ID || "1091356628743360562",
  ChannelId: process.env.CHANNEL_ID || "1091356628743360565",
  SalaiToken: process.env.SALAI_TOKEN || "MTA2Mzg3NTg2NDA0OTI0MjEyMg.GKwb6x.YIJMGc-feZUPLvU1rtun6lwW4rfiZDB-b-BNBY",
  HuggingFaceToken: process.env.HUGGINGFACE_TOKEN,
  Debug: true,
  Ws: true,
});

const imageResults: any[] = []

async function generateImage(description: string, imageBuffer: string[]): Promise<any> {
    try {
      await client.init();
      const prompt = `${imageBuffer[0]} ${imageBuffer[1]} ${description}`;
      const msg = await client.Imagine(prompt, (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      });
      imageResults.push(msg);
      console.log(msg);
      return msg; // Return the response data
    } catch (err) {
      throw new Error("Error generating the image: " + err);
      console.log(err.message);
    }
  }
  

/*async function generateImage(description: string, imageUrls: string[]): Promise<any> {
  const url = 'https://futureblend.herokuapp.com/generate';
  
  const formData = new FormData();
  formData.append('description', description);
  
  imageUrls.forEach((imageUrl, index) => {
    formData.append(`image${index}`, imageUrl);
  });
  
  try {
    const response: AxiosResponse<any> = await axios.post(url, formData);
    const responseData: any = response.data;
    
    // Additional processing
    await client.init();
    const prompt = `${imageUrls[0]} ${imageUrls[1]} ${description}`;
    const msg = await client.Imagine(prompt, (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    });
    console.log(responseData);
    
    return responseData;
  } catch (error) {
    throw new Error('Error generating the image.');
  }
} */


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", async (req, res) => {
  /* uploadMiddleware(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error uploading files.");
      return;
    }

    const { description } = req.body;
    const imageUrls: string[] = [];

    if (Array.isArray(req.files)) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const fileRef = ref(appli.storage().ref(), `${file.fieldname}-${i}`);
          const metadata = { contentType: 'image/jpeg' };
          await uploadBytes(fileRef, file.buffer, metadata);
          const downloadURL = await getDownloadURL(fileRef);
          imageUrls.push(downloadURL);
        }
      }
      

    console.log(description);
    console.log(imageUrls); */

    const { description, imageUrls } = req.body; 

    try {
      // Call generateImage function passing the image URLs
      console.log("akii");
      
      const msg = await generateImage(description, imageUrls);
      res.status(200).json({ message: "Image generated successfully.", msg });
    } catch (err) {
      res.status(500).send("Error generating the image.");
      console.log(err.message);
    }
 /* }); */
});

app.get("/result/:id", (req, res) => {
    const { id } = req.params;
  
    // Find the image result in the imageResults array based on the provided ID
    const result = imageResults.find((result) => result.id === id);
  
    if (result) {
      // If the image result is found, send it as the response
      res.status(200).json(result);
    } else {
      // If the image result is not found, send an error response
      res.status(404).json({ message: "Image result not found." });
    }
  });




app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
