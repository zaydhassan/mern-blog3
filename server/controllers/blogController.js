const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const mongoose= require("mongoose");

exports.getTrendingBlogs = async (req, res) => {
  try {
    const trendingBlogs = await blogModel.find()
      .sort({ likes: -1, views: -1, "comments.length": -1 }) 
      .limit(5) 
      .populate("user", "username profile_image"); 

    return res.status(200).json({ success: true, trending: trendingBlogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching trending blogs", error });
  }
};

exports.getRecommendedBlogs = async (req, res) => {
  const { userId } = req.params;
  
  try {
    
    const userActivityBlogs = await blogModel.find({
      $or: [{ likes: userId }, { "comments.user": userId }],
    }).limit(5);

    let recommendedBlogs = userActivityBlogs;

    if (recommendedBlogs.length === 0) {
      recommendedBlogs = await blogModel.find().sort({ created_at: -1 }).limit(5);
    }

    return res.status(200).json({ success: true, recommendations: recommendedBlogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching recommended blogs", error });
  }
};

exports.getAllBlogsController = async (req, res) => {
    try {
      const blogs = await blogModel.find({}).populate("user");
      if (!blogs) {
        return res.status(200).send({
          success: false,
          message: 'No Blogs Found'
        })
      }
      return res.status(200).send({
        success: true,
        BlogCount: blogs.length,
        message: "All Blogs lists",
        blogs,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error WHile Getting Blogs",
        error,
      });
    }
  };

  exports.getBlogsByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const blogs = await blogModel.find({ category: category }).populate('user');
        if (blogs.length > 0) {
            res.status(200).json({ success: true, blogs });
        } else {
            res.status(404).json({ success: false, message: 'No blogs found for this category' });
        }
    } catch (error) {
        console.error("Error fetching blogs by category:", error);
        res.status(500).json({ success: false, message: "Error fetching blogs by category", error: error.toString() });
    }
};

exports.createBlogController = async(req,res) => {
    try {
      const { title, description, image,category, status = 'Draft', user } = req.body; 
        if(!title || !description || !image || !category  || !user) {
            return res.status(400).send({
                success: false,
                message: "Please Provide all fields",
            });
        }
        const existingUser= await userModel.findById(user);
     if(!existingUser){
        return res.status(404).send({
            success: false,
            message:'unable to find user',
        });
     }
        const newBlog = new blogModel({title, description,image,category, user,status: status || 'Draft', views: 0});
        const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
        await newBlog.save();
        return res.status(201).send({
            success:true,
            message: "Blog Created!",
            newBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while creating Blog",
            error
    })
}
};

exports.updateBlogController = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, image, status } = req.body;
      const blog = await blogModel.findByIdAndUpdate(
        id,
        { title, description, image, status },
        { ...req.body },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        message: "Blog Updated!",
        blog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "Error WHile Updating Blog",
        error,
      });
    }
  };

  exports.getUserDrafts = async (req, res) => {
    try {
        const { userId } = req.params;
        const drafts = await blogModel.find({ user: userId, status: 'Draft' });
        
        res.status(200).send({
            success: true,
            drafts
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error retrieving drafts",
            error: error.message
        });
    }
};
  
  exports.getBlogByIdController = async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await blogModel.findById(id);
      if (!blog) {
        return res.status(404).send({
          success: false,
          message: "blog not found with this is",
        });
      }
      return res.status(200).send({
        success: true,
        message: "fetch single blog",
        blog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "error while getting single blog",
        error,
      });
    }
  };
  exports.deleteBlogController = async (req, res) => {
    try {
      const blog = await blogModel.findById(req.params.id);
      if (!blog) {
        return res.status(404).send({
          success: false,
          message: "Blog not found",
        });
      }
      await userModel.updateOne(
        { _id: blog.user },
        { $pull: { blogs: blog._id } }
      );
      await blogModel.deleteOne({ _id: blog._id });
      return res.status(200).send({
        success: true,
        message: "Blog Deleted!",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "Error while deleting blog",
        error,
      });
    }
  };

  exports.userBlogController = async (req, res) => {
    try {
      const userBlog = await userModel.findById(req.params.id).populate("blogs");
  
      if (!userBlog) {
        return res.status(404).send({
          success: false,
          message: "blogs not found with this id",
        });
      }
      return res.status(200).send({
        success: true,
        message: "user blogs",
        userBlog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "error in user blog",
        error,
      });
    }
  };