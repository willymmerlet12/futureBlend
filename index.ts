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
import serviceAccount from "./credentials.json"
import { appli } from "./Utlis/config";
import fs from "fs";
import timeout from "connect-timeout";
import { ref, getDownloadURL, uploadBytes} from "firebase/storage";
import Stripe from "stripe";
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


const stripe = new Stripe(`sk_test_51NGmWwDI1bwWeEayVG8QqRDLRa4xTxUQDRK9mynoh0GQRqzKfDC3NDDu3GpXIKXEgDDbrWOSJTDMmmnqDFDYrkfQ00HhS7iyYP`, {
    apiVersion: "2022-11-15"
})
const domain = "https://futureblendai.com";
const payload = { userId: '4526821' };
const secretKey = 'letssee';
const privateKey = fs.readFileSync('./private.key', 'utf8');
const token = jwt.sign(payload, privateKey, {algorithm: "RS256" });


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

app.post("/generate", async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 

   /* if (!req.headers.authorization) {
        res.status(401).send("Unauthorized");
        return;
      } */
    
      // Retrieve the authorization token from the header
 // Extract the token from the Authorization header
 
  const publicKey = fs.readFileSync('./public.key', 'utf8');
  console.log(publicKey);
  jwt.verify(token, publicKey, { algorithms: ["RS256"]}, (err, decoded) => {
    if (err) {
      // Token verification failed
      console.error(err);
    } else {
      // Token verification successful
      console.log(decoded);
    }
  });

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

  app.post('/create-checkout-session', async (req, res) => {
    const {  priceId } = req.body;
  
    try {
      // Retrieve the product price from Stripe
      const price = await stripe.prices.retrieve(priceId);
  
      // Create a new checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3001/success`,
        cancel_url: `http://localhost:3001/cancel`,
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('An error occurred while creating the checkout session.');
    }
  });

 


app.listen(process.env.PORT || 3001, () => {
  console.log("Server started on port 3000");
});
