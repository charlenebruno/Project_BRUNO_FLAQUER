import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
const bcrypt = require('bcrypt')

export class User {
  public username: string
  public email: string
  private password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      console.log("PSK")
      this.hashedPassword(password)
      console.log("PK ??? ", password, " putain ", this.getPassword())
    }
    else {
      this.setPassword(password)
      console.log("PK ??? ", password, this.getPassword())
    }

  }
  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":")
    return new User(username, email, password)
  }

  public hashedPassword(toHash): void {

    const password = toHash
    const saltRounds = 10;


    bcrypt.hash(password, saltRounds, (err, hash: string) => {
      console.log("allo", hash)
      if (!err)  this.password = hash;
    });
  }

  public setPassword(toSet: string): void {
    // Hash and set password
    //this.password = this.hashedPassword(toSet)

    console.log("2")
    console.log(this.password)

  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    // return comparison with hashed password
    console.log("validate", toValidate, this.getPassword())
    bcrypt.compare(toValidate, this.password, function (err, res) {
      // res == true
      console.log("validate", toValidate, res)
      return res
    });

    console.log("hola")
    return false;
    //return (this.password === toValidate);
  }
}

export class UserHandler {
  public db: any

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      else callback(null, User.fromDb(username, data))
    })
  }

  public save(bodyreq: any, callback: (err: Error | null) => void) {
    var user = new User(bodyreq.username, bodyreq.email, bodyreq.password, false)

    console.log("holaaaaaaaaa")
    this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(userDel: any, callback: (err: Error | null) => void) {
    console.log("delete")
    var user = new User(userDel.username, userDel.email, userDel.password, false)
    this.db.del(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
      callback(err)
    })

  }

  constructor(path: string) {
    this.db = LevelDB.open(path)
  }
}

