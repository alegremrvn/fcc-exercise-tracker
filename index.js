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

    usersData[index].log.unshift(data)

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

    if (usersData[index].count === 1) {
      usersData[index].log.push(data)
    } else {
      let inserted = false
      for (let i = 0; i < usersData[index].log.length; i++) {
        if (data.date >= usersData[index].log[i].date) {
          usersData[index].log.splice(i, 0, data)
          inserted = true
          break
        }
      }

      if (!inserted) {
        usersData[index].log.push(data)
      }
    }

    res.json({
      _id: usersData[index]._id,
      username: usersData[index].username,
      date: data.date.toDateString(),
      duration: data.duration,
      description: data.description
    })
  }
})

app.get('/api/users/:_id/logs', function (req, res) {
  let count = 0
  let index
  for (let i = 0; i < usersData.length; i++) {
    if (req.params._id != usersData[i]._id) {
      count++
    } else {
      index = i
      break
    }
  }
  if (count === usersData.length) {
    res.json({
      error: "No such id exist in the database"
    })
  } else {
    let logCopy = JSON.parse(JSON.stringify(usersData[index].log))
    for (let i = 0; i < logCopy.length; i++) {
      logCopy[i].date = new Date(logCopy[i].date)
    }

    if (req.query.from != undefined) {
      let count = 0
      for (let i = 0; i < logCopy.length; i++) {
        if (new Date(req.query.from) <= logCopy[i].date) {
          count++
        } else {
          break
        }
      }

      logCopy = logCopy.slice(0, count)
    }

    if (req.query.to != undefined) {
      let count = 0
      for (let i = 0; i < logCopy.length; i++) {
        if (logCopy[i].date > new Date(req.query.to)) {
          count++
        }
      }

      logCopy = logCopy.slice(count, logCopy.length)
    }

    if (req.query.limit != undefined) {
      logCopy = logCopy.slice(0, req.query.limit)
    }

    for (let i = 0; i < logCopy.length; i++) {
      logCopy[i].date = logCopy[i].date.toDateString()
    }

    res.json({
      _id: usersData[index]._id,
      username: usersData[index].username,
      count: logCopy.length,
      log: logCopy
    })
  }
})

app.get('/users', function (req, res) {
  res.send(usersData)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
