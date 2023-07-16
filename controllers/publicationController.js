import mongoose from 'mongoose';

import Publication from '../models/Publication.js';


export const getPublications = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 24;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await Publication.countDocuments({});
        const publications = await Publication.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: publications, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
      } catch (err) {
        res.status(500).json(err);
      }
}

export const getPublicationsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const publications = await Publication.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: publications });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPublication = async (req, res) => { 
    const { id } = req.params;

    try {
        const publication = await Publication.findById(id);
        
        res.status(200).json(publication);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPublication = async (req, res) => {
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
        const result = await Publication.create({ 
            title: req.body.title,
            desc: req.body.desc,
            img: req.body.img, 
            userId: req.userId });

        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePublication = async (req, res) => {
    const { id } = req.params;
    const { title, desc, img } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Publication with id: ${id}`);

    const UpdatePublication = { title, desc, img, _id: id };

    await Publication.findByIdAndUpdate(id, UpdatePublication, { new: true });

    res.json(UpdatePublication);
}

export const deletePublication = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Publication with id: ${id}`);

    await Publication.findByIdAndRemove(id);

    res.json({ message: "Publication deleted successfully." });
}

export const likePublication = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);
    
    const publication = await Publication.findById(id);

    const index = publication.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      publication.likes.push(req.userId);
    } else {
      publication.likes = publication.likes.filter((id) => id !== String(req.userId));
    }

    const UpdateBlog = await Publication.findByIdAndUpdate(id, publication, { new: true });

    res.status(200).json(UpdatePublication);
}


export const commentPublication = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const userId = req.userId
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);
  
 
    const publication = await Publication.findById(id);

    publication.comments.push(comment=value, userId=userId);

    const UpdatePublication = await Publication.findByIdAndUpdate(id, publication, { new: true });

    res.json(UpdatePublication);
};

// export default router;