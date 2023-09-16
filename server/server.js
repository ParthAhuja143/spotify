const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios').default
const { response } = require('express')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hi there!");
})

app.post('/login' , (req,res) => {

    const code = req.body.code
    //console.log(code)

})

app.post('/refresh' , (req,res) => {
    const refreshToken = req.body.refreshToken
    
    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'https://spotifybyparth.netlify.app' , 
        clientId : '39c8b3f6751d4bc2a052c0f7309949a4' , 
        clientSecret : 'e8bcfe3ad8404709b4b932d741f97436' ,
        refreshToken : refreshToken
    })

    spotifyApi.refreshAccessToken()
    .then(
        (data) => {
            res.json({
                accessToken : data.body.access_token ,
                expiresIn : data.body.expires_in
            })
        }
    )
    .catch((err) => {
        console.log(err.message)
        res.status(500)
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("Server running")
})

