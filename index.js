require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
const mongoose=require("mongoose");
mongoose.connect(process.env.password);
const urlSchema= new mongoose.Schema({
  origional: {type: String, required: true},
  short: Number
}) 
const Url= mongoose.model("URL", urlSchema);
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

let result={}
app.post('/api/shorturl', (req, res)=>{
  const origionalUrl=req.body["url"];
  result['original_url']=origionalUrl;
  let regex=new RegExp(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g);
  if(!origionalUrl.match(regex)){
    res.json({ error: 'invalid url' })
    return;
  }
  let inputShort=1;
  Url.findOne({}).sort({short:"desc"}).exec().then(data=>{
    console.log(data)
      inputShort=data? data.short + 1: 1;
      return Url.findOneAndUpdate({origional:origionalUrl},
      {origional:origionalUrl, short: inputShort},
      {new:true, upsert:true}).exec()})
      .then(data => {
        console.log(data)
        result['short_url']=data.short;
        res.json(result);
      })
    })
    app.get('/api/shorturl/:digit', (req, res)=>{
      let digit=req.params.digit;
      Url.findOne({short:digit}).then(data=>{
        if(data){
          res.redirect(data.origional);
        }
      })
    })