const fs = require('fs')
const path = require('path')
module.exports = {
  destorySync: function(fileUrl) {
    const filePath = path.join(__dirname, '../public/', fileUrl.substr(fileUrl.indexOf('/upload')))
    console.log('文件存在啊',filePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  },
  renameSync: function(oldUrl, newUrl) {
    const oldPath = path.join(__dirname, '../public/', oldUrl.substr(oldUrl.indexOf('/upload')))
    const newPath = path.join(__dirname, '../public/', oldUrl.substr(oldUrl.indexOf('/upload')))
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath)
    }
  },
  removeFileFlag: function(oldUrl) {
    if (!oldUrl) {
      return null
    }
    const oldPath = path.join(__dirname, '../public/', oldUrl.substr(oldUrl.indexOf('/upload')))
    const newPath = path.join(__dirname, '../public/', oldUrl.substr(oldUrl.indexOf('/upload')).replace('_n', ''))
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath)
    }

    return oldUrl.replace('_n','')
  },
  addFileFlag: function(oldUrl) {
    if (!oldUrl) {
      return null
    }
    const oldPath = path.join(__dirname, '../public/', oldUrl.substr(oldUrl.indexOf('/upload')))
    const newPath = path.join(__dirname, '../public/', oldUrl.substr(oldUrl.indexOf('/upload')).replace('.', '_n.'))
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath)
    }

    return oldUrl.replace('.','_n.')
  }
}