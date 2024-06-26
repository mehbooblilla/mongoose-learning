const express = require("express");
require("./config");
const multer = require("multer");
const Product = require("./products");

const app = express();
app.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      console.log(file),
      cb(null, file.originalname+".jpg");
    },
  })
}).single('user_file');

//CREATE API
app.post("/createProduct", async (req, res) => {
  let data = new Product(req.body);
  let result = await data.save();
  res.send(result);
});

//GET API All DATA
app.get("/products", async (req, res) => {
  let data = await Product.find();
  console.log(data);
  res.send(data);
});

//GET API SPECIFIC DATA
app.get("/:id", async (req, res) => {
  let data = await Product.findById(req.params.id);

  res.send(data);
});

//Delete API
app.delete("/delete/:_id", async (req, res) => {
  let data = await Product.deleteOne(req.params);

  res.send(data);
});

//Update API
app.put("/update/:_id", async (req, res) => {
  let data = await Product.updateOne(req.params, {
    $set: req.body,
  });

  res.send(data);
});
//SEARCH API
app.get("/search/:key", async (req, res) => {
  let data = await Product.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
    ],
  });

  res.send(data);
});

// Upload File API
app.post("/upload",upload, (req, res) => {
  res.send("file upload");
});

app.listen(5001);
