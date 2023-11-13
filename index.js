const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())


morgan.token("body", function (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        id : 1,
        name : "Alan",
        number : 123123
    },
    {
        id : 2,
        name : "Maty",
        number : 123123
    },
    {
        id : 3,
        name : "Nico",
        number : 123123
    },
    {
        id : 4,
        name : "HtmL iS EaSy",
        number : 123123
    }
]

app.get(`/`, (request,response) => {
    response.send("Hello World")
})


app.get(`/api/persons`, (request,response) => {
    response.send(persons)
})

app.get(`/info`, (request,response) => {
    let date = new Date
    response.send(`Phonebook has info for ${persons.length} people <br> <br> ${date}`)
})

app.get(`/api/persons/:id` , (request,response) => {
    const id = Number(request.params.id)
    
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete(`/api/persons/:id`, (request,response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person =>  person.id !== id)
    
    response.status(204).end()
})





app.post("/api/persons", (request,response) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error : "name or number missing"
    })
    }

    const nameExist = persons.find(person => person.name === body.name)


    if(nameExist){
        return response.status(400).json({
            error : "name already exists"
        })
    }
    const newPerson = {
        name : body.name,
        number : body.number,
        id : Math.floor(Math.random() * 1000) + 1
    }

    persons = [...persons,newPerson]

    response.json(newPerson)
})






const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`app running in ${PORT}`)
})

