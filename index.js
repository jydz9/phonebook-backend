const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id": 5,
      "name": "BTS",
      "number": "unknown"
    }
]
const generateId = () => {
    const id = Math.floor(Math.random() * 100)
    return id
}

app.get('/info',(request,response) => {
    const date = new Date()
    response.send(`Phonebook has info for ${persons.length} people
                    <br/>${date}`)
})

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

//app.use(morgan(`:method :url :status :res[content-length] :response-time ms ${persons[2].name}`))
morgan.token('info', function(req,res) {
  return `{"name" : "${req.body.name}", "number" : "${req.body.number}"}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

// app.use(morgan(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     JSON.stringify(req.body)
//   ].join(' ')
// }))

app.post('/api/persons', (request,response) => {
    const body = request.body
    // console.log(body.name)
    if(!body.name) {
      return response.status(400).json({
        error: 'name is missing'
      })
    }else if(!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const findPersonName = persons.find(info => info.name.toLowerCase() == body.name.toLowerCase())
    // console.log(findPersonName)
    if(findPersonName){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    
    persons = persons.concat(newPerson)

    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const getId = Number(request.params.id)
    // console.log(getId)
    const findPerson = persons.find(info => info.id === getId)
    
    if(findPerson){
        response.json(findPerson)
    }else{
        response.status(404).end()
    }
})




app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running opn port ${PORT}`)
})
