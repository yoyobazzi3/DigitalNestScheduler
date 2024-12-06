/* eslint-disable no-unused-expressions */

/* eslint-disable */
import server from '../index'
/* eslint-enable */

const rp = require('request-promise')
const chai = require('chai')
const expect = chai.expect
require('dotenv').config()

const testURL = `http://${process.env.HOST}:${process.env.PORT}`

describe('TESTING MODULES', () => {
  describe('1. Base Route', () => {
    it('Expects a HTML page in return', done => {
      const options = {
        method: 'GET',
        url: testURL + '/basePage',
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.a('string')
        done()
      }).catch(err => {
        done(err)
      })
    })
  })
})
