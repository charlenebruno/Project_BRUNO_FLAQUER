import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import crypto from 'crypto'

export class User {
  public username: string
  public email: string
  private password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      this.setPassword(password)
    }
    else {
      this.password = password
    }

  }
  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":")
    return new User(username, email, password, true)
  }

  public setPassword(toSet: string): void {
    const hashedPassword: string = crypto.createHash('md5').update(toSet).digest('hex');

    this.password = hashedPassword;
  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: string): boolean {
    // return comparison with hashed password
    const hashedValidate: string = crypto.createHash('md5').update(toValidate).digest('hex');

    return (this.password === hashedValidate);
  }
}

export class UserHandler {
  public db: any

  public closeDB() {
    this.db.close()
  }

  constructor(path: string) {
    this.db = LevelDB.open(path)
  }

  public get(username: string, callback: (err: Error | null, result: any) => void) {
    this.db.get(`user:${username}`, function (err: Error, result: any) {
      if (err) callback(err, null)
      else if (result === undefined) callback(null, result)
      else callback(null, User.fromDb(username, result))
    })
  }

  public save(bodyreq: any, callback: (err: Error | null) => void) {
    var user = new User(bodyreq.username, bodyreq.email, bodyreq.password, false)

    this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {

      callback(err)
    })
  }

  public delete(userDel: any, callback: (err: Error | null) => void) {
    var user = new User(userDel.username, userDel.email, userDel.password, false)
    this.db.del(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

}