import { expect } from 'chai'
import { User, UserHandler } from './user'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test'
var dbUse: UserHandler

describe('Users', function () {
    before(function () {
        LevelDB.clear(dbPath)
        dbUse = new UserHandler(dbPath)
    })
    after(function () {
        dbUse.closeDB()
    })


    describe('#get', function () {
        it('should get empty result on non existing group', function (done) {
            dbUse.get("charlene", function (err: Error | null, result?: User) {
                expect(err).to.be.not.null
                expect(result).to.not.be.undefined
                expect(result).to.be.null
                done()
            })
        })
    })

    describe('#save', function () {
        it('should save data', function (done) {
            var user = new User("charlene", "charlene.bruno@edu.ece.fr", "ECE", false)
            dbUse.save(user, function (err: Error | null) {
                expect(user).to.not.be.empty
                dbUse.get("charlene", function (err: Error | null, result?: User) {
                    expect(err).to.be.null
                    expect(result).to.not.be.null
                    if (result) {
                        expect(result.getPassword()).to.equal("ECE")
                    }
                    done()
                })
            })
        })

        it('should update existing data', function (done) {
            dbUse.get("charlene", function (err: Error | null, result?: User) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.not.be.null
                result?.setPassword("PARIS")
                if (result) {
                    expect(result.getPassword()).to.equal("PARIS")
                }
                done()
            })
        })

    })

    describe('#delete', function () {
        var user = new User("charlene", "charlene.bruno@edu.ece.fr", "PARIS", false)
        it('should delete data', function (done) {
            dbUse.delete(user, function (err: Error | null) {
                dbUse.get("charlene", function (err: Error | null, result?: User) {
                    expect(err).to.be.not.null
                    expect(result).to.not.be.undefined
                    expect(result).to.be.null
                    done()
                })
            })
        })
        it('should not fail if data does not exist', function (done) {
            dbUse.delete("charlene", function (err: Error | null) {
                expect(err).to.be.undefined
                done()
            })
        })
    })
})