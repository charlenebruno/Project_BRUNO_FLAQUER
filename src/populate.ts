import { UserHandler, User } from './user'
import { MetricsHandler, Metric } from './metrics'
import population from './database/population'

const dbUser: UserHandler = new UserHandler('./db/users')
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

population.forEach(element => 
    dbUser.get(element.username, function (err: Error | null, result?: User) {
      if (!err || result !== undefined) {console.log(result)} 
      else {
        dbUser.save(element, function (err: Error | null) {
          if (err) {}

          else {}
        })
        element.timestamp.forEach((element2,index) => {
          let tabMet: Metric[] = []
          let met: Metric = new Metric(element2,element.value[index],element.username)
          tabMet.push(met)

          dbMet.save(element.id[index], tabMet, (err: Error | null) => {
            if (err) throw err
          })
        })
      }
    }),
  )