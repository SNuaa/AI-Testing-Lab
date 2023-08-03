
const mongoose = require("mongoose")
const Schema = mongoose.Schema


const FileType = {
    filename: String,
    file: String,
    editTime: Date
}
const FileModel = mongoose.model("file", new Schema(FileType))

module.exports = FileModel