const FileService = require("../../services/admin/FileService")
const SparkMD5 = require('spark-md5');
const path = require("path");
const { UPLOAD_DIR } = require('../../util/constant')
const { mergeFileChunk, extractExt, isExists, path2url, writeFile, createUploadedList, getChunkDir } = require('../../util/utils')
const fse = require("fs-extra");

const FileController = {
    upload: async (req, res) => {
        // console.log('上传的文件数据:', req.file)
        // console.log('上传的文件体:', req.body)
        const { filename } = req.body
        let file = req.file;
        const filepath = file ? `${UPLOAD_DIR}/fileuploads/${filename}` : ""
        await writeFile(filepath, req.file.buffer)
        await FileService.upload({
            filename,
            filepath,
            editTime: new Date()
        })
        res.send({
            ActionType: "OK"
        })
    },
    uploadBase64: async (req, res) => {
        //后端生成hash值
        // console.log('上传的文件:', req.body.file)
        console.log('上传的文件名:', req.body.filename)
        let { file, filename } = req.body;
        file = decodeURIComponent(file)
        // NOTE: 注意这里一定要进行剪切
        file = file.replace(/^data:image\/\w+;base64,/, '');//base64的具体值
        file = Buffer.from(file, 'base64')

        let spark = new SparkMD5.ArrayBuffer()
        let suffix = extractExt(filename)

        spark.append(file)
        filename = spark.end()
        console.log('上传的文件名:', filename)
        const filepath = file ? `${UPLOAD_DIR}/fileuploads/${filename}${suffix}` : ""
        try {
            if (await isExists(filepath)) {
                res.send({
                    code: 0,
                    success: true,
                    ActionType: "OK_Exists",
                    data: {
                        url: path2url(filepath),
                    },
                    message: 'The file already exists',
                })
                return
            }
            await writeFile(filepath, file)
            await FileService.upload({
                filename,
                filepath,
                editTime: new Date()
            })
            res.send({
                code: 0,
                success: true,
                ActionType: "OK_First",
                data: {
                    url: path2url(filepath),
                },
                message: 'upload successfully!!',
            })
        }
        catch (err) {
            throw new Error(err)
        }
    },
    uploadImg: async (req, res) => {
        //前端生成的名字就是hash
        console.log('上传的文件:', req.file)
        console.log('上传的文件名:', req.body.filename)
        let { filename } = req.body;
        let file = req.file;
        const filepath = req.file ? `${UPLOAD_DIR}/fileuploads/${filename}` : ""
        try {
            if (await isExists(filepath)) {
                res.send({
                    code: 0,
                    success: true,
                    ActionType: "OK_Exists",
                    data: {
                        url: path2url(filepath),
                    },
                    message: 'The file already exists',
                })
                return
            }

            await writeFile(filepath, file.buffer)
            await FileService.upload({
                filename,
                filepath,
                editTime: new Date()
            })
            res.send({
                code: 0,
                success: true,
                ActionType: "OK_First",
                data: {
                    url: path2url(filepath),
                },
                message: 'upload successfully!!',
            })
        }
        catch (err) {
            throw new Error(err)
        }
    },
    uploadMulti: async (req, res) => {
        console.log('多文件上传的文件:', req.file)
        console.log('多文件上传的文件名:', req.body.filename)

        let { filename } = req.body;
        let file = req.file

        let spark = new SparkMD5.ArrayBuffer()
        let suffix = extractExt(filename)

        spark.append(file.buffer)
        filename = spark.end()
        const filepath = `${UPLOAD_DIR}/fileuploads/${filename}${suffix}`
        try {
            if (await isExists(filepath)) {
                res.send({
                    code: 0,
                    success: true,
                    ActionType: "OK_Exists",
                    data: {
                        url: path2url(filepath),
                    },
                    message: 'The file already exists',
                })
                return
            }
            await writeFile(filepath, file.buffer)
            await FileService.upload({
                filename,
                filepath,
                editTime: new Date()
            })
            res.send({
                code: 0,
                success: true,
                ActionType: "OK_First",
                data: {
                    url: path2url(filepath),
                },
                message: 'upload successfully!!',
            })
        }
        catch (err) {
            throw new Error(err)
        }
    },
    uploadVerify: async (req, res) => {
        console.log('多文件上传的文件名:', req.body)
        console.log('多文件上传的文件的哈希值:', req.body)
        const { filename, fileHash } = req.body
        const suffix = extractExt(filename);
        const filepath = `${UPLOAD_DIR}/bigfileuploads/${fileHash}${suffix}`
        let exists = await isExists(filepath)
        console.log("多文件上传的文件的是否存在:" + exists);
        if (exists) {
            res.send({
                shouldUpload: false,
                ActionType: "OK",
            })
        } else {
            res.send({
                shouldUpload: true,
                ActionType: "OK",
                uploadedList: await createUploadedList(fileHash)
            })
        }
    },
    uploadChunk: async (req, res) => {
        console.log('并发文件上传的文件：', req.body)
        console.log('并发文件上传的数据:', req.file)
        let chunk = req.file
        //切片的hash  整个文件的hash
        let { hash, fileHash, filename } = req.body
        const suffix = extractExt(filename);
        const filepath = `${UPLOAD_DIR}/bigfileuploads/${fileHash}${suffix}`
        const chunkDir = getChunkDir(fileHash);
        const chunkPath = path.resolve(chunkDir, hash);
        if (fse.existsSync(filepath)) {
            res.end({ ActionType: "OK", data: "file exist" })
            return;
        }
        if (fse.existsSync(chunkPath)) {
            res.end({ ActionType: "OK", data: "chunk exist" })
            return;
        }
        if (!fse.existsSync(chunkDir)) {
            await fse.mkdirs(chunkDir);
        }
        await writeFile(chunkPath, chunk.buffer)
        res.send({
            ActionType: "OK",
            data: "received file chunk",
        })
    },
    uploadMerge: async (req, res) => {
        console.log('合并上传的文件：', req.body)
        const { fileHash, filename, size } = req.body;
        const suffix = extractExt(filename);
        const filepath = `${UPLOAD_DIR}/bigfileuploads/${fileHash}${suffix}`
        await mergeFileChunk(filepath, fileHash, size);
        await FileService.upload({
            filename,
            filepath,
            editTime: new Date()
        })
        res.send({
            ActionType: "OK",
            data: "file merged success",
        })

    },
    uploadDelete: async (req, res) => {
        const { fileHash, filename } = req.body;
        console.log('要删除的数据');
        console.log(fileHash);
        console.log(filename);
        const suffix = extractExt(filename);
        const filepath = `${UPLOAD_DIR}/bigfileuploads/${fileHash}${suffix}`
        const chunkDir = path.resolve(UPLOAD_DIR, `chunkDir_${fileHash}`);
        try {
            await fse.remove(path.resolve(filepath));
            await fse.remove(path.resolve(chunkDir));
            res.send({
                ActionType: "OK",
                data: "file delete success",
            })
        } catch (error) {
            res.send({
                ActionType: "ERROR",
                data: "file delete fail ",
            })
        }
    },
}

module.exports = FileController