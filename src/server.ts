import express = require('express')
import bodyparser = require('body-parser')
import path = require('path')
import { MetricsHandler, Metric } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'

const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()
const LevelStore = levelSession(session)

const app = express()
const port: string = process.env.PORT || '8080'

app.use(session({
  secret: 'my very secret phrase ',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', __dirname + "/view")
app.set('view engine', 'ejs');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/homePage')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.user.username })
})

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id',authCheck, (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})

app.get('/metrics/', authCheck, (req: any, res: any) => {
  dbMet.getAllMyMetrics(req.session.user.username,(err: Error | null, result: any) => {
    if (err) throw err
    res.status(200).send(result)
  })
})

app.delete('/metrics/:id', authCheck, (req: any, res: any) => {
 
    dbMet.get(req.params.id,(err: Error | null, result: any) => {
      if (err) throw err
      dbMet.deleteId(req.params.id,result, req.params.username, function (err: Error | null ){
      })
      res.status(200).send()
    })  
})

app.delete('/metrics/:id/:timestamp/:username', authCheck,(req: any, res: any) => {
 
  dbMet.deleteOne(req.params.id,req.params.timestamp, req.params.username, function (err: Error | null ){
  })  
  res.status(200).send()

})

app.post('/deleteMetric', authCheck,(req: any, res: any) => {
  dbMet.deleteOne(req.body.id,req.body.timestamp, req.session.user.username, function (err: Error | null ){
  })
  res.status(200).send()
  res.redirect('/')

})

authRouter.get('/homePage', (req: any, res: any) => {
  res.render('homePage')
})

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/updatePassword', (req: any, res: any) => {
  res.render('updatePassword')
})

authRouter.get('/logout', authCheck, (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.get('/delete', authCheck, (req: any, res: any, next:any) => {
  dbUser.delete(req.session.user, (err: Error | null, result?: User) => {
    if (err) next(err)
  })
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.get('/addMetric', authCheck,(req: any, res: any) => {
  res.render('addMetric')
})

authRouter.get('/deleteMetric', authCheck,(req: any, res: any) => {
  res.render('deleteMetric')
})

authRouter.post('/addMetric', authCheck,(req: any, res: any, next: any) => {
  let metrics: Metric[] = []
  let met: Metric = new Metric(req.body.timestamp, req.body.value, req.session.user.username )
  metrics.push(met)
  dbMet.save(req.body.id, metrics, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
  res.redirect('/')
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})

app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    
    if (err && result !== undefined) next(err)
    if (result === undefined) {
      res.redirect('/login')

    }/*else if(result!== null){
      if(!result.validatePassword(req.body.password)){
        res.redirect('/login')
      }
      
    } */else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

app.post('/updatePassword',authCheck, (req: any, res: any, next: any) => { 
  if (req.body.password1 === req.body.password2 ) {
  dbUser.get(req.session.user.username, (err: Error | null, result?: User) => {
    if (err) next(err) 
      if (err || result === undefined) {
        res.status(404).send("user not found")
      } else {
          result.setPassword(req.body.password1)
          req.session.user.password = req.body.password1
          dbUser.save(req.session.user, function (err: Error | null) {
            if (err) next(err)
          })
      }
    })
      res.redirect('/')
    }else{
      res.redirect('/updatePassword') 
    } 
  })

app.use(authRouter)
const userRouter = express.Router()
 
userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err && result !== undefined) {
     res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {

        if (err) next(err)

        else res.redirect('/login')
      })
    }
  })
})

userRouter.get('/:username', authCheck,(req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

app.use('/user', userRouter)






