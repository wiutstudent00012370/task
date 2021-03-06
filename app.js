const express = require('express')
const req = require('express/lib/request')

const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/create', (req, res) => {
    res.render('create')
})


app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description
    if (title.trim() === '' && description.trim() === '') {
        res.render('create', { error: true })

    } else {
        fs.readFile('./data/tasks.json', (err,data) => {
            if (err) throw err

            const tasks = JSON.parse(data)

            tasks.push({
                id: id(),
                title: title,
                description: description,
            })

            fs.writeFile('./data/tasks.json', JSON.stringify(tasks), err => {
                if (err) throw err

                res.render('create', { done: true })
            })
        })
    }

    
})



app.get('/tasks', (req, res) => {

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const tasks = JSON.parse(data)
        res.render('tasks', { tasks: tasks })
    })
})
    

app.get('/tasks/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const tasks = JSON.parse(data)
        const task = tasks.filter(task => task.id == id)[0]
        res.render('datail', { task: task})
    })
    
})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/tasks.json', (err, data) => {
        if(err) throw err
        const tasks = JSON.parse(data)

        const filteredTasks = tasks.filter(task => task.id != id)
        fs.writeFile('./data/tasks.json', JSON.stringify(filteredTasks), (err) => {
            if (err) throw err

            res.render('tasks', { tasks: filteredTasks, deleted: true})
        })
    })
})



app.listen(process.env.PORT || 5050, err => {
    if(err) console.log(err)
    console.log('Server is running on the port 5050')
})


function id () {
    
    return '_' + Math.random().toString(36).substring(2, 9);
  }
//http://localhost:5050