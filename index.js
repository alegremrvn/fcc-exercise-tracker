const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()



const usersData = []



app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', function (req, res) {
  res.send({
    _id: usersData.length,
    username: req.body.username
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
