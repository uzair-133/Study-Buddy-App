const {ImageKit} = require('@imagekit/nodejs')

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});


const uploadFile = async (file)=> {
    const result = await client.files.upload({
        file,
        fileName:"studyMaterialFile_" + Date.now(),
        folder:"/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000studyBuddyFolder/files"
    })
    return result;
}


module.exports = {uploadFile}