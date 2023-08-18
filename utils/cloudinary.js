import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({path: '../../config.env'});

cloudinary.config({
  cloud_name: 'dfsrydumx', 
  api_key: '171629894652659', 
  api_secret: 'l_SimQ7-nCyKD-rU0rnS5oS4824' 
});

  const uploadToCloudinary = (file) => {
    const result = cloudinary.uploader.upload(file)
    return result
    // return new Promise(resolve => {
    //     cloudinary.uploader.upload(file) .then(result => {
    //         resolve({
    //             url:result.secure_url,
    //             id: result.public_id
    //         }, {
    //             resource_type:auto,
    //             folder:folder
    //         })
    //     })
    // })
}

export default uploadToCloudinary