import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })
  after(function () {
    dbMet.closeDB()
  })


  describe('#get', function () {
    it('should get empty array on non existing group', function (done) {
      dbMet.get(0, function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
        done()
      })
    })
  })

  describe('#save', function () {
    it('should save data', function (done) {
      var met: Metric[] = []
      met.push(new Metric("1111111", 10, "charlene"))
      dbMet.save(1, met, function (err: Error | null) {
        expect(met).to.not.be.empty
        dbMet.get(1, function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.empty
          if (result) {
            expect(result[0].value).to.equal(10)
          }

          done()
        })
      })
    })

    it('should update existing data', function (done) {
      dbMet.get(1, function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
        if (result) {
          result[0].value = 20
          expect(result[0].value).to.equal(20)
        }
        done()
      })
    })
  })

  describe('#deleteOne', function () {
    it('should delete data', function (done) {
      dbMet.deleteOne(1, "1111111", "charlene", function (err: Error | null) {
        dbMet.get(1, function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.be.empty
          done()
        })
      })
    })
    it('should  not fail if data does not exist', function (done) {
      dbMet.deleteOne(1, "1111111", "charlene", function (err: Error | null) {
        expect(err).to.be.null
        done()
      })
    })
  })
})





