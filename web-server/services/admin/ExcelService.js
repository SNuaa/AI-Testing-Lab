const ExcelModel = require("../../models/ExcelModel")

const ExcelService = {
    upload: async ({ excelfilename, excelfilenameHash, excelpath, editTime }) => {
        return ExcelModel.create({
            excelfilename, excelfilenameHash, excelpath, editTime
        })
    },
    //根据Hash来查找
    downloadExcelName: async () => {
        return ExcelModel.find({}, ['excelfilename', 'excelfilenameHash'])
    },
    //find返回的是数组
    downloadExcelContent: async (excelfilenameHash) => {
        return ExcelModel.findOne({ excelfilenameHash }, ['excelfilename', 'excelfilenameHash', 'excelpath'])
    },
}

module.exports = ExcelService