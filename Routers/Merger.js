const express = require('express');
const router = express.Router();
const fs = require('fs');
// const path = require('path');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadedFiles/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    fileFilter: (req, file, cb) => {
        // Check the incoming MIME type securely
        if (file.mimetype === 'application/pdf') {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only PDFs are allowed!'), false); // Reject the file
        }
    }
});

const protocol = req.protocol; // Will be 'http' on localhost, 'https' on Render
const host = req.get('host');

const upload = multer({ storage: storage });


// middleware that is specific to this router
const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now());
    next();
};
router.use(timeLog);

// define the home page route
// define the about route

router.post("/", upload.array('pdfFiles', 10), async (req, res) => {

    const File1 = await req.files[0];
    const File2 = await req.files[1];

    console.log("File 1 is ", File1);
    console.log("File 2 is ", File2);


    const PDFDocument = require('pdf-lib').PDFDocument;


    // // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // // // These should be Uint8Arrays or ArrayBuffers
    // // // This data can be obtained in a number of different ways
    // // // If your running in a Node environment, you could use fs.readFile()
    // // // In the browser, you could make a fetch() call and use res.arrayBuffer()
    for (const file of req.files) {
        //Reading File
        const DonorPdfBytes = fs.readFileSync(file.path);
        //Loading File
        const DonorPdfDoc = await PDFDocument.load(DonorPdfBytes)
        //Getting page count to know how many pages to copy from the donor pdf to the new pdf
        const PageLength = DonorPdfDoc.getPageCount();
        console.log("Page length is ", PageLength);
        //Copying pages from the donor pdf to the new pdf via for loop
        for (let i = 0; i < PageLength; i++) {
            const [DonorPage] = await pdfDoc.copyPages(DonorPdfDoc, [i])
            pdfDoc.addPage(DonorPage)
        }

    }

    // // // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()
    //Writing the merged pdf to the file system
    fs.writeFileSync(`merged.pdf`, pdfBytes);
    //Sending url to the client to download the merged pdf
    try {
        res.json({ downloadUrl: `${protocol}:/${host}/uploads/merged.pdf` });
    }
    catch (err) {
        console.log("Error in sending file: ", err);
    }

});




//Endpoint to download the merged pdf
router.get('/merged.pdf', (req, res) => {

    res.sendFile(path.join(__dirname, '..', 'merged.pdf'));

});









module.exports = router;
