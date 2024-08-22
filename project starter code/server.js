import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  processImage,
} from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;

  if (!image_url) {
    return res.status(400).send("image_url is required");
  }

  try {
    const filteredImagePath = await filterImageFromURL(image_url);
    const processImagePath = await processImage(filteredImagePath);
    // Send the filtered image file in the response
    res.sendFile(processImagePath, {}, async (err) => {
      if (err) return res.status(400).send("Bad request, please try again");
      await deleteLocalFiles([processImagePath]);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error processing image");
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
