import mongoose from 'mongoose';

import Jigsaw from '../models/Jigsaw.js';


export const getJigsaws = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 24;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await Jigsaw.countDocuments({});
        const jigsaws = await Jigsaw.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: jigsaws, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
      } catch (err) {
        res.status(500).json(err);
      }
}

export const getJigsawsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const jigsaws = await Jigsaw.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: jigsaws });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getJigsaw = async (req, res) => { 
    const { id } = req.params;

    try {
        const jigsaw = await Jigsaw.findById(id);
        
        res.status(200).json(jigsaw);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createJigsaw = async (req, res) => {
    // console.log(req.body)
    const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
    try {
        const result = await Jigsaw.create({ 
            title: req.body.title,
            desc: req.body.desc,
            img: req.body.img, 
            userId: req.userId });

        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateJigsaw = async (req, res) => {
    const { id } = req.params;
    const { title, desc, img } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    const UpdateJigsaw = { title, desc, img, _id: id };

    await Jigsaw.findByIdAndUpdate(id, UpdateJigsaw, { new: true });

    res.json(UpdateJigsaw);
}

export const deleteJigsaw = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    await Jigsaw.findByIdAndRemove(id);

    res.json({ message: "Jigsaw deleted successfully." });
}

export const likeJigsaw = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Jigsaw with id: ${id}`);
    
    const jigsaw = await Jigsaw.findById(id);

    const index = jigsaw.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      jigsaw.likes.push(req.userId);
    } else {
      jigsaw.likes = jigsaw.likes.filter((id) => id !== String(req.userId));
    }

    const UpdateJigsaw = await Jigsaw.findByIdAndUpdate(id, jigsaw, { new: true });

    res.status(200).json(UpdateJigsaw);
}


export const commentJigsaw = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const userId = req.userId
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No jigsaw with id: ${id}`);
  
 
    const jigsaw = await Jigsaw.findById(id);

    jigsaw.comments.push(comment=value, userId=userId);

    const UpdateJigsaw = await Jigsaw.findByIdAndUpdate(id, jigsaw, { new: true });

    res.json(UpdateJigsaw);
};

// export default router;