const cors = require("cors"),
    express = require('express'),
    dotenv  = require('dotenv'),
    path    = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env')})
const sequelize = require("./app/config/db");
require('./app/models/user')
require('./app/models/todolist')
require('./app/models/ToDoItem')

const app = express()

// cross origin ressources sharing
// Partage de ressources entre server distant et hote different de l'app
// * = toutes les origines
app.use(cors({
    origin: '*',
    method: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT']
}))

// encodade de l'url
app.use(express.urlencoded({extended: true}))
app.use(express.json())

require('./app/routes')(app)

app.get('/', (req, res) => {
    return res.status(200).send('Hello world')
})

app.use((req, res) => {
    return res.status(404).send('Not found')
})

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, async (err) => {
    if(err){
        console.log('Error in server setup')
    }
    else {
        console.log(`Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
        // update table if exist without delete
        await sequelize.sync({ alter: true });
        // drop and create table
        //await sequelize.sync({ force: true });
        // create table if not exist
       // await sequelize.sync();
    }
})

