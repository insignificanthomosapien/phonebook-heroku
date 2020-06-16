const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use((req, res, next) => {
    console.log(req.body);
    next()
  });
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },

    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },

    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },

    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook, go to /api/persons to access contacts list</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const numPersons = persons.length
    const date = new Date()

    response.send(`<p>Phonebook has info for ${numPersons} people</p> <br /> <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    }
    else{
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if(!persons.find(p => p.id === id)){
        return response.status(400).send({error: 'Data doesn\'t exist'})
    }
    else{
        persons = persons.filter(p => p.id !== id)
        response.status(200).end()
    }
})

const generateId = () => {
    const num = Math.random() * (Number.MAX_SAFE_INTEGER)
    return Math.floor(num)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number || persons.find(p => p.name === body.name)){
        if(!body.name || !body.number){
            return response.status(400).send({error: 'empty data sent'})
        }
        if(persons.find(p => p.name === body.name)){
            return response.status(400).send({error: 'name must be unique'})
        }
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})


const PORT = process.env.PORT || PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})