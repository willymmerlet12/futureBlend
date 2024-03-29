import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import { Midjourney } from "./src";
import bodyParser from "body-parser";
import multer from "multer";
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import authMiddleware from "./auth-middleware";
import cors from "cors";
import {sign, verify } from 'jsonwebtoken';
import { appli } from "./Utlis/config";
import fs from "fs";
import{ createServer } from "http";
import Stripe from "stripe";
import { Server as SocketIO } from 'socket.io';
import { fileURLToPath } from 'url';
import { ref, getDownloadURL, uploadBytes} from "firebase/storage";

const PORT = process.env.PORT || 3001; 

const HOST = PORT === 3001 
                ? 'localhost'
                : '0.0.0.0'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMiddleware = multer({ storage: multer.memoryStorage() }).array('images', 2);

const app = express();

const serverKey = fs.readFileSync("./server.key", "utf8");
const certificate = fs.readFileSync("./server.cert", "utf8");

const httpsServer = createServer(app);

const corsOptions = {
  origin: 'https://futureblendai.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
  allowedHeaders: ['Authorization'],
  credentials: true
};

const io = new SocketIO(httpsServer, {
  cors: {
      origin: "https://futureblendai.com",
      credentials: true,
  }
})

app.use(cors({
  origin: 'https://futureblendai.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(authMiddleware.decodeToken);

//ERROR HANDLING
app.use(function(err, req, res, next) {
  if(!err) return next(); 
  console.log(err);
  let returnObj = {
    statusCode:err['statusCode'],
    message:err['message']
  }
  res.status(err['statusCode']);
  res.send(returnObj);
});

const extendTimeoutMiddleware = (req, res, next) => {
  // Only extend the timeout for the /generate route
  if (req.url !== '/generate') {
    next();
    return;
  }

  const space = ' ';
  let isDataSent = false;

  res.once('finish', () => {
    isDataSent = true;
  });

  res.once('end', () => {
    isDataSent = true;
  });

  res.once('close', () => {
    isDataSent = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      console.log("receiving data");
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't sent any data back....
      if (!isDataSent) {
        console.log("whitespace");

        // Write the whitespace to the response
        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

app.use(extendTimeoutMiddleware);

const stripe = new Stripe(`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`, {
  apiVersion: "2022-11-15"
})


const payload = { userId: '4526821' };
const secretKey = 'letssee';
const privateKey = fs.readFileSync('./private.key', 'utf8');
const token = sign(payload, privateKey, {algorithm: "RS256" });


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
const imageQueue: any[] = [];

function updateJobStatus(jobId: string, status: string, progress: number) {
  // Find the job in the imageQueue array based on the jobId
  const job = imageQueue.find((job) => job.id === jobId);

  if (job) {
    // Update the job status and progress
    job.status = status;
    job.progress = progress;

    // Emit the updated job status to connected clients
    io.emit("jobStatusUpdated", { jobId, status, progress });
  }
}

async function generateImage(description: string, imageBuffer: string[], jobId: string): Promise<any> {
    try {
      console.log("ka");
      await client.Connect();
      console.log("boom");
      const prompt = `${imageBuffer[0]}, ${imageBuffer[1]}, "the future ${description} of those 2 persons. Ultra realistic, HD, 4K"`;
      let progresss = 0;
      io.emit("jobStatusUpdated", "starting");
      const msg = await client.Imagine(prompt, (uri: string, progress: string) => {
        io.emit("jobStatusUpdated", "continuing")
        const currentProgress = Number(progress);
        if (currentProgress > progresss) {
          progresss = currentProgress;
          updateJobStatus(jobId, 'in progress', progresss);
        }
        console.log("loading", uri, "progress", progress);
        io.emit('jobStatusUpdated', { jobId, status: 'in progress', progress });
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

    if (!req.headers.authorization) {
        res.status(401).send("Unauthorized");
        return;
      }
    
      // Retrieve the authorization token from the header
      const authToken = req.headers.authorization;
      console.log(authToken);
      
    // Validate the access token
  const accessToken = authToken.split(' ')[1]; // Extract the token from the Authorization header
 
  const publicKey = fs.readFileSync('./public.key', 'utf8');
  
  console.log(publicKey);
  verify(token, publicKey, { algorithms: ["RS256"]}, (err, decoded) => {
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

      // Add the job to the imageQueue
    imageQueue.push({ id, status: 'pending', progress: 0 });

      console.log("akii");
      
      const msg = await generateImage(description, imageUrls, id);
      imageRequests.delete(id);
      if (!res.headersSent) {
        res.status(200).json({ message: "Image generated successfully.", msg });
      }
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).send("Error generating the image.");
        console.log(err.message);
      } else {
        console.log("Response headers already sent.");
      } 
    } finally {
      res.end(); // Ensure the response is terminated
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
        const result = await generateImage(description, imageUrls, id);
  
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
        success_url: `https://futureblendai.com/generate`,
        cancel_url: `https://futureblendai.com/cancel`,
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('An error occurred while creating the checkout session.');
    }
  });

 


  httpsServer.listen(PORT,  ()  => {
    console.log(`[INFO] Server listening on port ${PORT}`)
    socket({io})
})

export const socket = async ({io}) => {
  io.on('connection', (socket) => {
    console.log('A client connected');
  
    // Handle events from the client
    socket.on('someEvent', (data) => {
      console.log('Received data:', data);
      // Perform actions based on the received data
    });
  
    // Send updates to the client
    setInterval(() => {
      const message = 'This is a server update';
      socket.emit('serverUpdate', message);
    }, 5000);
  
    socket.on('jobStatusUpdated', (data) => {
      console.log('Received job status update from client:', data);
      // Perform actions based on the received job status update
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
}


app.use(express.static(path.join(__dirname, "/public")));