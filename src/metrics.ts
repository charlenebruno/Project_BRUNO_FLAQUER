import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number
  public username: string

  constructor(ts: string, v: number, u: string) {
    this.timestamp = ts
    this.value = v
    this.username = u
  }
}

export class MetricsHandler {
  private db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public closeDB() {
    this.db.close()
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metrics:${key}:${m.timestamp}:${m.username}`, value: m.value })
    })
    stream.end()
  }

  public getAll(callback: (error: Error | null, result: any) => void) {
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        let timestamp: string = data.key.split(':')[2]
        let username: string = data.key.split(':')[3]
        let metric: Metric = new Metric(timestamp, data.value, username)
        metrics.push(metric)
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics)
        console.log('Stream ended')
      })
  }

  public getAllMyMetrics(userN: any, callback: (error: Error | null, result: any) => void) {
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        let timestamp: string = data.key.split(':')[2]
        let username: string = data.key.split(':')[3]
        if (username === userN) {
          let metric: Metric = new Metric(timestamp, data.value, username)
          metrics.push(metric)
        }
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics)
        console.log('Stream ended')
      })
  }


  public get(key: number, callback: (error: Error | null, result: any) => void) {
    let metrics: Metric[] = []

    this.db.createReadStream()
      .on('data', function (data) {
        let keyAct: number = data.key.split(":")[1]

        if (key == keyAct) {
          let timestamp: string = data.key.split(':')[2]
          let username: string = data.key.split(':')[3]
          let metric: Metric = new Metric(timestamp, data.value, username)
          metrics.push(metric)
        }
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')

      })
      .on('end', function () {
        callback(null, metrics)
        console.log('Stream ended')
      })
  }

  public deleteId(key: number, data: any, username: any, callback: (error: Error | null) => void) {
    for (let i = 0; i < data.length; i++) {
      this.db.del(`metrics:${key}:${data[i].timestamp}:${username}`)
    }

    callback(null)
  }

  public deleteOne(key: number, timestamp: any, username: any, callback: (error: Error | null) => void) {

    var batch = this.db.batch();
    batch.del(`metrics:${key}:${timestamp}:${username}`)
    batch.write(function (err) {
      if (err) {
        console.error('batch operation failed:', err);
        callback(err)
      } else
        callback(null)

    });
  }
}
