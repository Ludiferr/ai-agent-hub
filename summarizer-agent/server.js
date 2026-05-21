const express = require("express"); //helps build backend
const cors = require("cors"); //frontend talks to backend
const axios = require("axios");//http request to talk to ollama
const PORT =5000; 

const app=express();

app.use(cors());//allows outside requests
app.use(express.json());// parses text that was requested 


app.get("/",(req,res)=> { //backend responds
    res.send(`Summarizer Agent is running on port ${PORT}`) // sends text to browser 
});


app.post("/summarize",async(req, res)=> {
    const text =req.body.text; //JSON sends to backend and grabs the text the user sent

    if(!text){ // if no text
        return res.status(400).json({ // return bad request and send json back
            error:" Text is required" // thus frontend needs to send text back
        });
    }

    const response = await axios.post(
        "http://localhost:11434/api/generate", // ollams local api
        {
            model:"llama3.2",
            prompt: `Give ONLY a short summary (1-2 sentences). Do not explain or add extra information. Summarize this text:\n\n${text}`, //What AI Sees
            stream:false
        }
    )

    const cleanSummary = response.data.response //response data gives back api response, llama puts it into field  
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim(); 
    
res.status(200).send(
    JSON.stringify(
        { summary: cleanSummary },
        null,
        2
    )
);

    });


  
app.listen(PORT, () => {
    console.log(`Summarizer Agent is running on port ${PORT} `);
});

