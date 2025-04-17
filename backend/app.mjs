/*          IMPORTS DE THIRD PARTIES O DEL CORE          */
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';


/*          CONFIGURACIONES              */
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();


/*              MIDDLEWARE               */

app.use(express.json()); // Convertir a JSON
app.use(express.urlencoded({extended: false})); // Parsear a body los inputs de formularios
app.use(express.static(path.join(__dirname, "/..", "frontend", "public"))); // Brinda elementos estaticos al usuario

/*              ENRUTAMIENTO DE LA PAGINA                */
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "/..", "frontend", "view", "index.html"));
})
app.post('/api/gen-img', async(req,res)=>{
    const apiKey = process.env.OPENAI_API_KEY;
    const {category} = req.body;
    function buildPrompt(category) {
        let subjectDescription = '';
      
        switch (category.toLowerCase()) {
          case 'man':
            subjectDescription = 'a cartoon avatar of a man, fun and expressive';
            break;
          case 'woman':
            subjectDescription = 'a cartoon avatar of a woman, fun and expressive';
            break;
          case 'animal':
            subjectDescription = 'a cartoon avatar of an animal, clearly non-human, with animal features like fur, ears, paws, tail, etc.';
            break;
          case 'object':
            subjectDescription = 'a cartoon avatar of an inanimate object with a fun personality';
            break;
          default:
            subjectDescription = `a cartoon avatar of a character: ${category}`;
        }
      
        return `
            You're an expert character designer specialized in cartoon avatars.
            Create a 1024x1024 px avatar in cartoon style. The drawing style should include:
            - Flat colors with minimal shading.
            - Simple cartoon anatomy and exaggerated proportions.
            - Thick, clean black outlines.
            - Solid background color, no textures or gradients.
            - No text, only the character centered in the image.
            - It's very important that the style must be related with the emo culture
            
            The avatar should be ${subjectDescription}. The character should express personality and creativity. No background elements.
        `;
    }
    const prompt = buildPrompt(category);
    console.log(prompt);
    try {
        const response = await axios.post("https://api.openai.com/v1/images/generations",
            {
                model:"dall-e-3",
                prompt,
                n:1,
                size: "1024x1024",
                quality: "standard",
                style: "vivid"
            },
            {
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );
        const imgUrl = response.data.data[0].url;
        console.log(imgUrl)
        return res.json({imgURL : imgUrl});
        
    } catch (error) {
        console.error("Error al generar la image ", error);
        return res.status(500).json({error: "Error al generar el avatar"})
    }

});
// Enrutamiento en caso de que el usuario se mueva a un lugar que no debe
app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname, "/..", "frontend", "view", "page404.html"));
})




app.listen(PORT);