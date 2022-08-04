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
  let data = {
    _id: String(usersData.length),
    username: req.body.username,
    count: 0,
    log: []
  }

  usersData.push(data)

  res.send({
    _id: data._id,
    username: data.username
  })
})

app.get('/api/users', function (req, res) {
  let users = []
  for (let i = 0; i < usersData.length; i++) {
    let user = {
      _id: usersData[i]._id,
      username: usersData[i].username
    }
    users.push(user)
  }

  res.send(users)
})

app.post('/api/users/:_id/exercises', function (req, res) {
  let count = 0
  let index
  for (let i = 0; i < usersData.length; i++) {
    if (req.params._id != usersData[i]._id) {
      count++
    } else {
      index = i
    }
  }
  if (count === usersData.length) {
    res.json({
      error: "No such id exist in the database"
    })
  } else if (req.body.date === '' || req.body.date === undefined) {
    usersData[index].count = usersData[index].count + 1

    let data = {
      description: req.body.description,
      duration: parseInt(req.body.duration),
      date: new Date()
    }

    usersData[index].log.push(data)

    res.json({
      _id: usersData[index]._id,
      username: usersData[index].username,
      date: data.date.toDateString(),
      duration: data.duration,
      description: data.description
    })
  } else {
    usersData[index].count = usersData[index].count + 1

    let data = {
      description: req.body.description,
      duration: parseInt(req.body.duration),
      date: new Date(req.body.date)
    }

    usersData[index].log.push(data)

    res.json({
      _id: usersData[index]._id,
      username: usersData[index].username,
      date: data.date.toDateString(),
      duration: data.duration,
      description: data.description
    })
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
