import xlsx from "xlsx";
import readline from "readline";
import express from "express";
import multer from "multer";
import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import numberToWords from "./words.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors'
import dotenv from "dotenv"

const corsOptions = {
  origin: '*', // Allow only requests from this origin
  methods: 'GET,POST', // Allow only these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
};
let absoluteFilePath;
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const app = express();
dotenv.config()
app.use(cors(corsOptions))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log({proc: process.env.BACKEND_URL});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});
app.listen(4000, () => {
  console.log("listening to port 4000");
});

app.get('/output', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'output.html'));
  
}); 
app.get('/output-files-api', (req, res) => {
  const outputDir = "./output";
  const filesArray = []
  if (!fs.existsSync(outputDir)) {
    console.log("Output folder does not exist. Nothing to delete.");
    return;
  }

  const files = fs.readdirSync(outputDir);

  files.forEach((file) => {
   // const filePath = path.join(outputDir, file);
    console.log({outputDir, file})
    try {
      filesArray.push(file);
      console.log(`Deleted file: ${file}`);
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  }); 
  res.send({status:200, files: filesArray})
  console.log("All files in the output folder have been deleted.");
  
});

app.get('/output/:filename', (req, res) => {
  const outputDir = './output';
  const filePath = path.join(outputDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
  }
  res.download(filePath); 
});


app.post("/upload", upload.single("file"), async (req, res) => {
  deleteFilesInOutputFolderSync();
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }
  let filePath = req.file.path;
  // res.json("uploaded");
  // const r1 = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(workSheet);
    for (let i = 0; i < data.length; i++) {
      const names = data.map((person) => person.Name || null);
      // console.log(names)

      let inputName = names[i];

      console.log(names[i]);
      const result = data.find((row) => row.Name === inputName);
      if (result) {
        let basic = result.Basic || 0;
        let bonus = result.Bonus || 0;
        let cms = result.Comission || 0;
        let tip = result.Tip || 0;
        let gr = result.Google || 0;
        let tpr = result.Trust_Pilot || 0;

        let tax = result.tax || 0;
        let cb = result.Chargebacks || 0;
        let refund = result.Refunds || 0;
        let fine = (result.Absent_Fine || 0) + (result.Fine || 0);
        let advance = result.Advance || 0;

        let total_deduc = tax + cb + refund + fine + advance || 0;
        let sumInWords = numberToWords(result.Total_Payable);
        try {
          const txt = "sum.docx";
          //   console.log(txt.toString())
          let fileContent = fs.readFileSync(txt, "binary");
          let zip = new PizZip(fileContent);

          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.render({
            Name: result.Name,
            basic: basic,
            cms: cms,
            tip: tip,
            gr: gr,
            tpr: tpr,
            bonus: bonus,
            net: result.Gross,
            tax: tax,
            advance: advance,
            fine: fine,
            cb: cb,
            refund: refund,
            total_deduc: total_deduc,
            Net: result.Total_Payable,
            words: sumInWords,
          });

          try {
            const buffer = doc.getZip().generate({ type: "nodebuffer" }); 
            const outputDir = "./output"; 
            const trimmedInputName = inputName.trim(); 
            const outputFilePath = path.join(
              outputDir,
              `${trimmedInputName}.docx`,
            );

            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(outputFilePath, buffer);
           // console.log(`File successfully written: ${outputFilePath}`);

            absoluteFilePath = path.resolve(outputFilePath);
          } catch (error) {
            console.error("Error writing file:", error.message);
          }
        } catch (error) {
          console.error("error + ", error.message);
        }
      } else console.log("nothing");
    }
    console.log("Redirecting to /output");
    res.redirect('/output')
  } catch (error) {
    console.error("Error reading file :", error.message);
  }
});

function deleteFilesInOutputFolderSync() {
  const outputDir = "./output";

  if (!fs.existsSync(outputDir)) {
    console.log("Output folder does not exist. Nothing to delete.");
    return;
  }

  const files = fs.readdirSync(outputDir);

  files.forEach((file) => {
    const filePath = path.join(outputDir, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${file}`);
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  });

  console.log("All files in the output folder have been deleted.");
}
deleteFilesInOutputFolderSync();

//npx prettier --write app.js
