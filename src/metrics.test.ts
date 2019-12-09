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
    it('should get empty array on non existing group', function () {
      dbMet.get(0, function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })

  describe('#save', function () {
    it('should save data', function () {
      var met: Metric[] = []
      met.push(new Metric("1111111", 10, "charlene"))
      dbMet.save(1, met, function(err: Error | null){
        expect(met).to.not.be.empty
        dbMet.get(1, function(err: Error | null, result?: Metric[]){
          expect(err).to.be.null
          expect(result).to.be.undefined
          expect(result).to.not.be.empty
          if (result)
            expect(result[0].value).to.equal(10)
        })
      })
    })

    it('should update existing data', function () {
      var met: Metric[] = []
      met.push(new Metric("1111111", 20, "charlene"))
      dbMet.save(1, met, function(err: Error | null){
        expect(met).to.not.be.empty
        dbMet.get(1, function(err: Error | null, result?: Metric[]){
          expect(err).to.be.null
          expect(result).to.be.undefined
          expect(result).to.not.be.empty
          if (result)
            expect(result[0].value).to.equal(20)
        })
      })
    })
  })

  describe('#deleteOne', function () {
    it('should delete data', function () {
      dbMet.deleteOne(1,"1111111", "charlene")
        dbMet.get(1, function(err: Error | null, result?: Metric[]){
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.be.empty
        })
      dbMet.deleteOne(1,"1111111", "charlene")  
    })
    it('should  not fail if data does not exist', function () {
      dbMet.deleteOne(1,"1111111", "charlene")  
    })
  })
})




