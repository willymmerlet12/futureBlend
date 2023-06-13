import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import { Midjourney } from "./src";
import bodyParser from "body-parser";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import authMiddleware from "./auth-middleware";
import cors from "cors";
import jwt from 'jsonwebtoken';
import { appli } from "./Utlis/config";
import fs from "fs";
import timeout from "connect-timeout";
import { ref, getDownloadURL, uploadBytes} from "firebase/storage";
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).array('images', 2);
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(authMiddleware.decodeToken);

//ERROR HANDLING
app.use(function(err, req, res, next) {
  if(!err) return next(); // you also need this line
  console.log(err);
  let returnObj = {
    statusCode:err['statusCode'],
    message:err['message']
  }
  res.status(err['statusCode']);
  res.send(returnObj);
});



const payload = { userId: process.env.PAYLOAD || "4526821" };
const privateKey = fs.readFileSync('./private.key', 'utf8');
const token = jwt.sign(payload, privateKey, {algorithm: "RS256" });


const client = new Midjourney({
  ServerId: process.env.SERVER_ID || "1091356628743360562",
  ChannelId: process.env.CHANNEL_ID || "1091356628743360565",
  SalaiToken: process.env.SALAI_TOKEN || "MTA2Mzg3NTg2NDA0OTI0MjEyMg.GKwb6x.YIJMGc-feZUPLvU1rtun6lwW4rfiZDB-b-BNBY",
  HuggingFaceToken: process.env.HUGGINGFACE_TOKEN || "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",
  Debug: true,
  Ws: true,
});

const imageRequests = new Map();
let storedMsg: any[] = []

async function generateImage(description: string, imageBuffer: string[]): Promise<any> {
    try {
        console.log("ka");
      await client.init();
      console.log("boom");
      const prompt = `${imageBuffer[0]} ${imageBuffer[1]} "the future ${description} of those 2 persons. Ultra realistic, HD, 4K"`;
      const msg = await client.Imagine(prompt, (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      });
      storedMsg.push(msg)
      console.log(msg);
      return msg; // Return the response data
    } catch (err) {
      throw new Error("Error generating the image: " + err.message);
      console.log(err.message);
    }
  }


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/get-msg", (req, res) => {
    if (storedMsg) {
      console.log("getting results object");
      res.status(200).json({ msg: storedMsg });
    } else {
      res.status(404).json({ message: "Msg not found." });
    }
  });
  const imageQueue: any[] = [];

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
          const idd = uuidv4();
          const fileRef = ref(appli.storage().ref(), `${file.fieldname}-${i}${idd}`);
          const metadata = { contentType: 'image/jpeg' };
          await uploadBytes(fileRef, file.buffer, metadata);
          const downloadURL = await getDownloadURL(fileRef);
          imageUrls.push(downloadURL);
        }
      }
      
      const jobId = uuidv4();
  
      const job = {
        id: jobId,
        description,
        imageUrls,
        status: "queued",
        result: null,
        error: null,
      };
  
      // Add the job to the queue
      imageQueue.push(job);
  
      res.status(200).json({ message: "Image generation task enqueued.", jobId });
  
      // Process the job immediately if the queue is empty
      if (imageQueue.length === 1) {
        try {
          const generatedImage = await generateImage(description, imageUrls);
  
          // Update the job status to "completed" and store the result
          job.status = "completed";
          job.result = generatedImage;
  
          // Handle the generated image (e.g., save to storage, send notifications, etc.)
          // ...
  
          // Remove the job from the queue
          imageQueue.shift();
  
          // Update the client with the generated image
          res.status(200).json({ message: "Image generated successfully.", generatedImage });
        } catch (err) {
          // Update the job status to "failed" and store the error
          job.status = "failed";
          job.error = err.message;
  
          // Remove the job from the queue
          imageQueue.shift();
  
          res.status(500).send("Error generating the image.");
          console.log(err.message);
        }
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

 


app.listen(process.env.PORT || 3001, () => {
  console.log("Server started on port", process.env.PORT || 3001);
  console.log("hey", process.env.PORT);
  
});
