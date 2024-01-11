'use strict'
import express from 'express'
import models from '../../models/index.mjs'
import { createReadStream } from 'fs'
import { parse } from 'fast-csv'
import { Op } from 'sequelize'
import { Parser as CsvParser } from 'json2csv'

const hospitalModel = models.hospital

const getHospitalBasedLocation = async (req = express.request, res = express.response) => {
    try {
        const location = req.params.location
        if (!location) {
            res.status(400).send({
                message : 'location not be empty'
            })
            return
        }
        
        const sq = models.Sequelize
        const hospitals = await hospitalModel.findAll({
            where: {
                city: {
                    [Op.or]: [
                        sq.where(sq.fn('LOWER', sq.col('city')), 'LIKE', '%'+location+'%'),
                        sq.where(sq.fn('LOWER', sq.col('address')), 'LIKE', '%'+location+'%'),
                    ]
                },
            }
        })

        if (hospitals) {
            return res.status(200).send({
                data: hospitals
            })
        } else {
            return res.status(400).send({
                message: 'Data not found'
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message: "Couldn't get data from database",
            error: error.message,
        })
    }
}

const insertFromCsv = async (req = express.request, res = express.response) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!")
          }
      
          let hospitals = []
          let path = "./resources/static/assets/uploads/" + req.file.filename
      
          createReadStream(path)
            .pipe(parse({ headers: true }))
            .on("error", (error) => {
                throw error.message
            })
            .on("data", (row) => {
                hospitals.push(row);
            })
            .on("end", async () => {
                hospitalModel.beforeBulkSync()
                await hospitalModel.bulkCreate(
                    hospitals,
                )
                .then(() => {
                    return res.status(200).send({
                        message: "The file: "
                        + req.file.originalname
                        + " got uploaded successfully!!",
                  })
                })
                .catch((error) => {
                    return res.status(500).send({
                        message: "Couldn't import data into database!",
                        error: error.message,
                    })
                })
            })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Failed to upload the file: " + req.file.originalname,
        })
        return
    }
}

const downloadCsv = async (_req = express.request, res = express.response) => {
    await hospitalModel.findAll().then((objs) => {
      let hospitals = [];
  
      objs.forEach((obj) => {
        const { id, name, address,
          phone, coordinate, city } = obj;
        hospitals.push({ id, name, address,
            phone, coordinate, city });
      });
  
      const csvFields = ['id', 'name', 'address', 
                        'phone', 'coordinate',
                        'city'];
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(hospitals);
  
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=hospitals.csv');
  
      res.status(200).end(csvData);
    });
  };

export default {getHospitalBasedLocation, insertFromCsv}