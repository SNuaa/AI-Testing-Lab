var express = require('express');
const ExcelController = require('../../controllers/admin/ExcelController');
var ExcelRouter = express.Router();

const multer = require('multer')
const upload = multer()// 数据存在服务器,地址存在数据库

//excel文件上传
ExcelRouter.post("/adminapi/excel/upload_excel", upload.single('excelfile'), ExcelController.uploadExcel)
ExcelRouter.get("/adminapi/excel/download_excel", ExcelController.downloadExcelName)
ExcelRouter.post("/adminapi/excel/download_excel_content", ExcelController.downloadExcelContent)

module.exports = ExcelRouter;
