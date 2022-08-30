require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/phone')
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static('build'))


morgan.token('info', function(req,res) {
  return `{"name" : "${req.body.name}", "number" : "${req.body.number}"}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

const generateId = () => {
    const id = Math.floor(Math.random() * 100)
    return id
}
//app.use(morgan(`:method :url :status :res[content-length] :response-time ms ${persons[2].name}`))

app.get('/api/persons',(request,response) => {
  Phone.find({}).then(info => {
      // console.log(info)
      response.json(info)
    })
})

app.post('/api/persons', (request,response,next) => {
  const body = request.body
  // console.log(body.name,'is the name')
  // if(!body.name) {
  //   return response.status(400).json({
  //     error: 'name is missing'
  //   })
  // }else if(!body.number){
  //     return response.status(400).json({
  //         error: 'number is missing'
  //     })
  // }
  Phone.find({})
    .then(result => {
      const findPersonName = result.find(info => info.name.toLowerCase() === body.name.toLowerCase())
      // console.log(findPersonName, "is the name")
      if(findPersonName){
          return response.status(400).json({
              error: 'name must be unique'
          })
      }
    })
  

  const newPerson = new Phone({
    id: generateId(),
    name: body.name,
    number: body.number,
  })
  
  // persons = persons.concat(newPerson)
  // console.log(persons)
  // response.json(newPerson)
  newPerson.save()
  .then(savedInfo => {
    response.json(savedInfo)
  })
  .catch(error => next(error))
  //The error is sent to the error handle middleware at the bottom
  //This error is coming from models/phone.js, with error.name = ValidationError
})


app.get('/info',(request,response) => {
    const date = new Date()
    Phone.find({})
      .then(result =>{
        response.send(`Phonebook has info for ${result.length} people
                    <br/>${date}`)
      })
    
})

app.get('/api/persons/:id', (request, response,next) => {
    // const getId = (request.params.id)
    // const findPerson = persons.find(info => info.id === getId)
    // Phone.find({_id: getId})
    //   .then(result => {
    //     if(result){
    //       response.json(result)
    //     }else{
    //         response.status(404).end()
    //     }
    //   })
    
    // OR
    Phone.findById(request.params.id)
      .then(info => {
        //error checking
        if(info){
          response.json(info)
        }else{
          response.status(404).end()
        }
    })
   .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) =>{
  const body = request.body

  const updateInfo = {
    name: request.body.name,
    number: request.body.number,
  }
  
  Phone.findByIdAndUpdate(request.params.id, updateInfo, {new: true})
    .then(updatePhone => {
      console.log(updatePhone)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const id = (request.params.id)
    // persons = persons.filter(note => note.id !== id)

    // response.status(204).end()
    Phone.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // console.error(error.message, 'is the current name')
  // console.log(Phone.errors['number'].message, 'IS THE MESSAGE')

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'wrong id'})
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running open port ${PORT}`)
})
