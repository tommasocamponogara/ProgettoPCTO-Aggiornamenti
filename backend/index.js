const express = require('express')
const app = express()
const port = 3000

const USERS = [
    { id: 1, nome: "Mario" },
    { id: 2, nome: "Luca" },
]

const LINES = [
    {
        "id": "line-1",
        "name": "Linea 1 - Assemblaggio",
        "description": "Linea di assemblaggio demo",
        "order": 1
    }
]

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/lines', (req, res) => {
    // TODO: restituisce l'elenco delle linee
})

app.get('/lines/:id', (req, res) => {
    const id = req.params.id;
    // TODO: restituire una linea dato l'id
})

app.post('/lines', (req, res) => {
    const body = req.body
    // TODO: crea una linea e la restituisce
});

app.put('/lines/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body
    // TODO: modifica la linea e la restituisce
});

app.delete('/lines/:id', (req, res) => {
    const id = req.params.id;
    // TODO: elimina la linea
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
