var express = require('express');
const FileController = require('../../controllers/admin/FileController');
var FileRouter = express.Router();
//图片上传
const multer = require('multer')
const upload = multer()// 数据存在服务器,地址存在数据库

//单文件上传
FileRouter.post("/adminapi/file/upload_single", upload.single('file'), FileController.upload)
FileRouter.post("/adminapi/file/upload_single_base64", upload.single('file'), FileController.uploadBase64)
FileRouter.post("/adminapi/file/upload_single_img", upload.single('file'), FileController.uploadImg)
// 多文件上传
FileRouter.post("/adminapi/file/upload_multi", upload.single('file'), FileController.uploadMulti)
//大文件上传
FileRouter.post("/adminapi/file/upload_verify", FileController.uploadVerify)
FileRouter.post("/adminapi/file/upload_chunk", upload.single('file'), FileController.uploadChunk)
FileRouter.post("/adminapi/file/upload_merge", FileController.uploadMerge)
FileRouter.post("/adminapi/file/upload_delete", FileController.uploadDelete)
module.exports = FileRouter;
