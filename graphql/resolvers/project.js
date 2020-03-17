const Project = require("../../models/project");
const User = require("../../models/user");
const { transformProject } = require("./populate");

module.exports = {
  projects: async args => {
    try {
      let projects;
      if (
        args.projectFilter.category !== null &&
        args.projectFilter.category !== undefined
      ) {
        projects = await Project.find({
          category: args.projectFilter.category
        });
      } else if (
        args.projectFilter.tag[0] !== null &&
        args.projectFilter.tag[0] !== undefined
      ) {
        projects = await Project.find({ tag: { $in: args.projectFilter.tag } });
      } else if (
        args.projectFilter.userId !== null &&
        args.projectFilter.userId !== undefined
      ) {
        projects = await Project.find({ admin: args.projectFilter.userId });
      } else {
        projects = await Project.find();
      }
      let fetchedProjects = projects.map(async project => {
        let temp = await transformProject(project);
        return temp;
      });
      return fetchedProjects;
    } catch (err) {
      throw err;
    }
  },
  addProject: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    let tags = args.projectInput.tag[0].split(",");
    const project = new Project({
      name: args.projectInput.name,
      desc: args.projectInput.desc,
      orgination: args.projectInput.orgination,
      admin: req.userId,
      tag: tags,
      category: args.projectInput.category,
      git: args.projectInput.git,
      website: args.projectInput.website,
      slug: args.projectInput.slug,
      createdAt: new Date(args.projectInput.createdAt)
    });
    let createdProject;
    try {
      const result = await project.save();
      createdProject = transformProject(result);
      const admin = await User.findById(req.userId);

      if (!admin) {
        throw new Error("User not found.");
      }
      admin.owned.push(project);
      await admin.save();

      return createdProject;
    } catch (err) {
      throw err;
    }
  },
  addLikes: async (args,req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const project = await Project.findByIdAndUpdate(
      { _id: args.projectId },
      {
        $push: {likes: req.userId}
      }
    );
    let updatedProject;
    try {
      const resDetails = await project.save();
      updatedProject = resDetails;
      return updatedProject;
    } catch (err) {
      throw err;
    }
  },
  dislike: async (args,req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const project = await Project.findByIdAndUpdate(
      { _id: args.projectId },
      {
        $pull: {likes: req.userId}
      }
    );
    let updatedProject;
    try {
      const resDetails = await project.save();
      updatedProject = resDetails;
      return updatedProject;
    } catch (err) {
      throw err;
    }
  }
};
