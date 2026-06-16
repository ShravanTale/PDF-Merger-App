const express = require('express');
const path = require('path');
const fs = require('fs');
const Merger = require('./Routers/Merger');

const app = express();
const PORT = process.env.PORT || 3000;
// Automatically create the 'uploads' folder if it doesn't exist
if (!fs.existsSync('./uploadedFiles')) {
    fs.mkdirSync('./uploadedFiles');
}

app.use(express.static(path.join(__dirname, "Public")));
app.use(express.json());
app.use('/uploads', Merger);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
