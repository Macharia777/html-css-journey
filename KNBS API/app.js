const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/api/upload', upload.single('file'), (req, res) => {
  const productId = req.body.productId;
  const file = req.file;

  // Process the uploaded file and add it to the product page
  const filePath = `./uploads/${file.filename}`;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  res.send(`<p>File ${file.originalname} has been uploaded.<br/><textarea style="width:100%; height:300px;">${fileContent}</textarea></p>`);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});