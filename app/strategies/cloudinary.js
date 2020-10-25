// Configure Cloudinary
const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'holaholahola', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploads = (file,folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file,(result) => {
            console.log(result);
            resolve({
                url: result.secure_url,
                id: result.piblic_id
            })
        },{
            resource_type: "auto",
            folder: folder
        })
    })
}