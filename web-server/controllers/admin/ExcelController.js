const ExcelService = require("../../services/admin/ExcelService")
const { UPLOAD_DIR } = require('../../util/constant')
const SparkMD5 = require('spark-md5');
const { extractExt, isExists, writeFile, readBufferFile } = require('../../util/utils')

const ExcelController = {
    uploadExcel: async (req, res) => {
        console.log('上传的文件数据:', req.file)
        console.log('上传的文件体:', req.body)

        const { excelfilename } = req.body
        let excelfile = req.file;

        let spark = new SparkMD5.ArrayBuffer()
        let suffix = extractExt(excelfilename)

        spark.append(excelfile.buffer)
        let excelfilenameHash = spark.end()

        const excelpath = `${UPLOAD_DIR}/fileuploads/${excelfilenameHash}${suffix}`

        console.log("上传的文件名:" + excelfilename);
        console.log("上传的文件路径:" + excelpath);
        try {
            if (await isExists(excelpath)) {
                res.send({
                    ActionType: "OK_Exists",
                    message: 'The file already exists',
                })
                return
            }
            await writeFile(excelpath, excelfile.buffer)
            await ExcelService.upload({
                excelfilename,
                excelfilenameHash,
                excelpath,
                editTime: new Date()
            })
            res.send({
                ActionType: "OK_First",
                message: 'upload successfully!!',
            })
        }
        catch (err) {
            throw new Error(err)
        }
    },
    downloadExcelName: async (req, res) => {
        const result = await ExcelService.downloadExcelName(req.params)
        console.log("下载的文件结果:" + result);
        res.send({
            ActionType: "OK",
            data: result
        })
    },
    downloadExcelContent: async (req, res) => {
        const { excelfilename, excelfilenameHash } = req.body
        console.log("查询对应的文件名字:" + excelfilename);
        console.log("查询对应的文件Hash:" + excelfilenameHash);
        const result = await ExcelService.downloadExcelContent(excelfilenameHash)
        console.log("查询对应的文件结果:" + result);
        const { excelpath } = result
        try {
            if (await isExists(excelpath)) {
                console.log("查询对应的文件已经存在");
                const bufferFile = await readBufferFile(excelpath)
                res.send({
                    ActionType: "OK",
                    data: bufferFile,
                })
            } else {
                res.send({
                    ActionType: "ERROR",
                })
            }
        }
        catch (err) {
            throw new Error(err)
        }
    },
}

module.exports = ExcelController