
const mongoose = require("mongoose")
const Schema = mongoose.Schema


const ExcelType = {
    excelfilename: String,
    excelfilenameHash: String,
    excelpath: String,
    editTime: Date
}
const ExcelModel = mongoose.model("excel", new Schema(ExcelType))

module.exports = ExcelModel