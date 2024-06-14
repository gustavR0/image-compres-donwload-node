//advanced compress

const sharp = require('sharp');
// Input file
const inputFile = 'input_images/input.png';
// Output file
const outputFile = 'output_images/output-compress.png';
// Resize the image to fit within a specific width and height


(async () => {
  try {
  await sharp(inputFile)
        .resize(800, 600)
        .toFile(outputFile);
        console.log(`Resized image successful`);
  } catch (error) {
      console.log(error)
  }
  })();

// Convert the image to WebP format
/* sharp(inputFile)
.webp()
.toFile(outputFile, (err, info) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Converted image to WebP format`);
  }
}); */

// Reduce JPEG quality to 50%
/* sharp(inputFile)
  .jpeg({ quality: 50 })
  .toFile(outputFile, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Compressed image with quality ${info.quality}`);
    }
  }); */