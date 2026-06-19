const express = require('express');
const router = express.Router();
const fs = require('fs');
// const path = require('path');
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // 3. Verify the file extension
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return cb(new Error('Only PDFs are allowed!'), false);
        }
        cb(null, true);
    }
});

// middleware that is specific to this router
const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now());
    next();
};
router.use(timeLog);

// define the home page route
// define the about route

router.post("/", upload.array('pdfFiles', 20), async (req, res) => {

    const File1 = await req.files[0].originalname;
    const File2 = await req.files[1].originalname;

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
        //Loading File
        const DonorPdfDoc = await PDFDocument.load(file.buffer)
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
    //Sending url to the client to download the merged pdf
    try {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
        res.send(pdfBytes);
    }
    catch (err) {
        console.log("Error in sending file: ", err);
    }

});












module.exports = router;
