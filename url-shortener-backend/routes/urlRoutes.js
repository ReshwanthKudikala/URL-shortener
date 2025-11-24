const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const validUrl=require('valid-url');
const generateCode = require('../utils/generateCode');


const BASE_URL=process.env.BASE_URL;

router.post('/shorten', async (req, res) => {
  const { longUrl, customCode, expiry } = req.body;

  if(!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try{

    // If no custom code, and URL already exists → return existing mapping
    if (!customCode) {
      const existingUrl = await Url.findOne({ longUrl });
      if (existingUrl) {
        return res.json(existingUrl);
      }
    }


    //Link expiration
    let expiresAt = null;
    
    const now = new Date();

    if (expiry) {
      if (expiry === "1h") expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); 
      if (expiry === "24h") expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);  // 24 hours
      if (expiry === "7d") expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);  
      if (expiry === "30d") expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }


    let urlCode;

    if(customCode){
      const exists = await Url.findOne({ urlCode: customCode });
      if(exists){
        return res.status(400).json({ error: 'Custom code already exists' });
      } 
      urlCode = customCode;
    }
    else{
      let existing;
      do{
        urlCode = generateCode(7);
        existing= await Url.findOne({ urlCode });
      }while(existing);
    }

    const shortUrl = `${BASE_URL}/${urlCode}`;

    const newUrl= new Url({
        longUrl,
        shortUrl,
        urlCode,
        expiresAt
    });

    await newUrl.save();
    res.json(newUrl);

  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:code', async (req, res) => {
    try{
        const code=req.params.code;
        const url=await Url.findOne({ urlCode: code });

        if(!url){
            return res.status(404).json({ error: 'URL not found' });
        }
        // Check if URL is expired
        if (url.expiresAt && url.expiresAt < new Date()) {
          return res.status(410).json({ error: "This URL has expired" });
        }


        // Increase click count
        url.clicks += 1;
        await url.save();

        return res.redirect(url.longUrl);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
