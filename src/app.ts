///<reference path="./types/index.d.ts" />


import express from 'express'
import webRoutes from 'routes/web'
import initDatabase from 'config/seed'
import api from 'routes/api'
import cors from 'cors'
import passport from 'passport'
import configPassport from './middleware/passport'
import authRouter from 'routes/auth'

const app = express()


require('dotenv').config()
const port = process.env.PORT || 3002

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')


//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//config static file
app.use(express.static('public'))


//config passport
configPassport();
app.use(passport.initialize());

//config global
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Pass user object to all views
    next();
});


//cors
app.use(cors());


//config routes
//cho phép login không cần token
authRouter(app);
webRoutes(app)
api(app)

//fake data
initDatabase()


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})