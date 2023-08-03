const FileModel = require("../../models/FileModel")

const FileService = {
    upload: async ({ filename, filepath, editTime }) => {
        return FileModel.create({
            filename, filepath, editTime
        })
    },
}

module.exports = FileService