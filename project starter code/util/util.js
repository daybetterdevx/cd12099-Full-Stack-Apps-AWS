import fs from "fs";
import Jimp from "jimp";
import axios from "axios";
import path from "path";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise((resolve, reject) => {
    try {
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      axios({
        method: "GET",
        url: inputURL,
        responseType: "stream",
      }).then((res) => {
        res.data.pipe(fs.createWriteStream(outpath));
        res.data.on("end", async () => {
          console.log("download complete");
          resolve(outpath);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function processImage(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .write(inputURL, (img) => {
          resolve(inputURL);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
