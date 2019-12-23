import { UserHandler, User } from './user'
import { MetricsHandler, Metric } from './metrics'
import population from './database/population'

const dbUser: UserHandler = new UserHandler('./db/users')
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

console.log("1234")

population.forEach(element => 
    dbUser.get(element.username, function (err: Error | null, result?: User) {
      if (!err || result !== undefined) {console.log(result)} 
      else {
        console.log("111")
        dbUser.save(element, function (err: Error | null) {
          if (err) {}
          else {}
        })
        console.log("222")
        element.timestamp.forEach((element2,index) => {
          let tabMet: Metric[] = []
          let met: Metric = new Metric(element2,element.value[index],element.username)
          tabMet.push(met)

          console.log("333")
          dbMet.save(element.id[index], tabMet, (err: Error | null) => {
            if (err) throw err
          })

          console.log("444")
        })
      }
      console.log("555")
    }),
    console.log("666")
  )

  console.log("777")
