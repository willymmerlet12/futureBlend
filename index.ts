import dotenv from 'dotenv'
dotenv.config()
import firebase from 'firebase-admin';
import express from "express";
import { Midjourney } from "./src";
import bodyParser from "body-parser";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import authMiddleware from "./auth-middleware";
import cors from "cors";
import serviceAccount from "./credentials.json"
import { appli } from "./Utlis/config";
import { ref, getDownloadURL, uploadBytesResumable, uploadBytes} from "firebase/storage";
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).array('images', 2);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://futureblend.herokuapp.com')
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.set("view engine", "ejs");

app.use(authMiddleware.decodeToken);


const client = new Midjourney({
  ServerId: process.env.SERVER_ID || "1091356628743360562",
  ChannelId: process.env.CHANNEL_ID || "1091356628743360565",
  SalaiToken: process.env.SALAI_TOKEN || "MTA2Mzg3NTg2NDA0OTI0MjEyMg.GKwb6x.YIJMGc-feZUPLvU1rtun6lwW4rfiZDB-b-BNBY",
  HuggingFaceToken: process.env.HUGGINGFACE_TOKEN,
  Debug: true,
  Ws: true,
});

const imageRequests = new Map();
let storedMsg: any[] = []

async function generateImage(description: string, imageBuffer: string[]): Promise<any> {
    try {
      await client.init();
      const prompt = `${imageBuffer[0]} ${imageBuffer[1]} "the future ${description} of those 2 persons. Ultra realistic, HD, 4K -testp"`;
      const msg = await client.Imagine(prompt, (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      });
      storedMsg.push(msg)
      console.log(msg);
      return msg; // Return the response data
    } catch (err) {
      throw new Error("Error generating the image: " + err);
      console.log(err.message);
    }
  }


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/get-msg", (req, res) => {
    if (storedMsg) {
      res.status(200).json({ msg: storedMsg });
    } else {
      res.status(404).json({ message: "Msg not found." });
    }
  });

app.post("/generate", async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
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
    console.log(imageUrls);  

  /*  const { description, imageUrls } = req.body; */

    try {

    // Generate unique ID for the image generation request
      const id = uuidv4();
      const imageResults: any[] = []

    // Store the image generation request in the map
      imageRequests.set(id, { description, imageUrls });
      // Call generateImage function passing the image URLs
      console.log("akii");
      
      const msg = await generateImage(description, imageUrls);
      imageRequests.delete(id);
      res.status(200).json({ message: "Image generated successfully.", msg });
    } catch (err) {
      res.status(500).send("Error generating the image.");
      console.log(err.message);
    }
 });
});

app.get("/result/:id", async (req, res) => {
    const id = req.params.id;
    
    // Check if the ID exists in the map
    if (imageRequests.has(id)) {
      // Get the image generation request associated with the ID
      const { description, imageUrls } = imageRequests.get(id);
  
      try {
        // Call generateImage function passing the image URLs
        const result = await generateImage(description, imageUrls);
  
        // Remove the image generation request from the map
        imageRequests.delete(id);
  
        res.status(200).json({ message: "Image generated successfully.", result });
      } catch (err) {
        res.status(500).send("Error generating the image.");
        console.log(err.message);
      }
    } else {
      res.status(404).send("Image generation request not found.");
    }
  });



app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
