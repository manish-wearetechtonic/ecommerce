const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads");
  },
  filename: (req, file, cb) => {
    // console.log("yoyoy")
    const ext = file.mimetype.split("/")[1];
    const name = file.originalname.split(".")[0];
    const path = `${name}-${file.fieldname}.${ext}`;
    cb(null, path);
  },
});

const upload = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
});

module.exports = upload;

// images -> add and edit -> admin,user,section,country,region
// image : admin,user, image

//flag:country