const path = require('path');
const fs = require('fs');
const fse = require("fs-extra");

const { Request } = require('express');
const multiparty = require('multiparty');
const { HOST_NAME, MAX_SIZE, UPLOAD_DIR } = require('./constant');
const { log } = require('console');



function useMultiParty(req, auto) {
  const config = {
    maxFieldsSize: MAX_SIZE,
  };

  if (auto) {
    config.uploadDir = UPLOAD_DIR;
  }

  return new Promise((resolve, reject) => {
    new multiparty.Form(config).parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        fields,
        files,
      });
    });
  });
}

function isExists(p) {
  p = path.normalize(p);
  return new Promise((resolve) => {
    fs.access(p, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
}

function extractExt(filename) {
  return filename.slice(filename.lastIndexOf('.'), filename.length);
}

function writeFile(path, file, stream) {
  return new Promise((resolve, reject) => {
    if (stream) {
      const reader = fs.createReadStream(file.path);
      const writer = fs.createWriteStream(path);
      reader.on('end', () => {
        fs.unlinkSync(file.path);
        resolve();
      });

      reader.pipe(writer);

      return;
    }

    fs.writeFile(path, file, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
function readBufferFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}
function path2url(p) {
  const pt = path.normalize(p);
  const uploadDir = path.normalize(UPLOAD_DIR);

  const index = uploadDir.length + 1;

  return `${HOST_NAME}/${pt.substring(index)}`;
}

function delay(time = 1000) {
  return new Promise((resolve) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      resolve();
    }, time);
  });
}
function getChunkDir(fileHash) {
  return path.resolve(UPLOAD_DIR, `chunkDir_${fileHash}`);
}

const createUploadedList = async (fileHash) => {
  try {
    const chunkDirExists = fse.existsSync(getChunkDir(fileHash));
    if (chunkDirExists) {
      const uploadedFiles = await fse.readdir(getChunkDir(fileHash));
      console.log('获取已存在的切片：');
      console.log(uploadedFiles);
      return uploadedFiles;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error in createUploadedList:', error);
    return [];
  }
};

const mergeFileChunk = async (filePath, fileHash, size) => {
  const chunkDir = getChunkDir(fileHash);
  const chunkPaths = await fse.readdir(chunkDir);
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);

  // 并发写入文件
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 根据 size 在指定位置创建可写流
        fse.createWriteStream(filePath, {
          start: index * size
        })
      )
    )
  );

  // 合并后删除保存切片的目录
  fse.rmdirSync(chunkDir);
};

const pipeStream = (path, writeStream) =>
  new Promise(resolve => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
module.exports = {
  useMultiParty,
  isExists,
  extractExt,
  writeFile,
  path2url,
  delay,
  createUploadedList,
  getChunkDir,
  mergeFileChunk,
  readBufferFile
};
