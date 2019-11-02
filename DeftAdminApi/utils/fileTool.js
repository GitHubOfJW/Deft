const fs = require('fs')
const path = require('path')
module.exports = {
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