const cloudinary = require('cloudinary').v2
require("dotenv").config()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRETE 
  });


module.exports = cloudinary;
  

// cloudinary.config({ 
//   cloud_name: 'oskportfolio', 
//   api_key: '237545431193796', 
//   api_secret: 'LBoajtirWBCrAeUeIaGKZMcbmx4' 
// });
// module.exports = cloudinary;
