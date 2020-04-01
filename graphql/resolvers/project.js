const Project = require("../../models/project");
const User = require("../../models/user");
const Organization = require("../../models/organization");
const { transformProject,transformOrg } = require("./populate");

module.exports = {
  projects: async (args, req) => {
    try {
      let page = 0;
      let records = 4;
      if(Object.keys(req.query).length !== 0) {
        page = req.query.page;
        records = req.query.records;
      }
      let pagination = {
        page: parseInt(page),
        limit: parseInt(records),
        skip: parseInt(page * records)
      };
      let projects;
      if (
        args.projectFilter.category !== null &&
        args.projectFilter.category !== undefined
      ) {
        projects = await Project.find({
          category: args.projectFilter.category})
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 });
      } else if (
        args.projectFilter.tag[0] !== null &&
        args.projectFilter.tag[0] !== undefined
      ) {
        projects = await Project.find({ tag: { $in: args.projectFilter.tag } })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 });
      } else if (
        args.projectFilter.userId !== null &&
        args.projectFilter.userId !== undefined
      ) {
        projects = await Project.find({ admin: args.projectFilter.userId })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 });
      }
      // else if (
      //   args.projectFilter.projectId !== null &&
      //   args.projectFilter.projectId.length !== 0
      // ){
      //   let temp;
      //   let pid = args.projectFilter.projectId;
      //   for(i = 0; i < pid.length; i++){
      //     temp = await Project.findById(pid[i]);
      //     console.log(temp);
      //     projects.push(temp);
      //   }
      // } 
      else {
        projects = await Project.find()
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 });
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
    let orgId;
    let tags = args.projectInput.tag[0].split(",");
    var re = new RegExp(args.projectInput.organization,"i");
    const  org = await Organization.find({name:{ $regex:  re }});
    if(org.length === 0) {
      const organization = new Organization({
        name: args.orgInput.name,
        website: args.orgInput.website,
        icon: args.orgInput.icon
      });

      const res = await organization.save();
      orgId = res._id;
    }
    else {
      orgId = org[0]._id;
    }
    const project = new Project({
      name: args.projectInput.name,
      desc: args.projectInput.desc,
      organization: orgId,
      admin: req.userId,
      tag: tags,
      category: args.projectInput.category,
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

      const org = await Organization.findById(orgId);
      if(!org) {
        throw new Error("Organization not found");
      }
      org.projects.push(project);
      await org.save();

      return createdProject;
    } catch (err) {
      throw err;
    }
  },
  updateProject: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    let community = args.updateInput.community;
    let adopters = args.updateInput.adopter[0].split(",");
    let adopter = [];
    for (i = 0; i < adopters.length; i++)  {
      var re = new RegExp(adopters[i],"i");
      const  org = await Organization.find({name:{ $regex:  re }});
      if(org.length === 0) {
        const organization = new Organization({
          name: adopters[i],
        });
        const res = await organization.save();
        adopter.push(res._id);
      }
      else {
        adopter.push(org[0]._id);
      }
    }
    
    const project = await Project.findByIdAndUpdate(
      { _id: args.updateInput.projectId },
      {
        community,
        adopter
      },
      {new:true}
    );
    let updatedProject;
    try {
      const resDetails = await project.save();
      updatedProject = resDetails;
      adopter.map(async (o) => {
        const org = await Organization.findById(o);
        if(!org) {
          throw new Error("Organization not found");
        }
        org.adopted.push(project);
        await org.save();
      })
      return updatedProject;
    } catch (err) {
      throw err;
    }
  },
  addLikes: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const project = await Project.findByIdAndUpdate(
      { _id: args.projectId },
      {
        $push: { likes: req.userId }
      },
      { new: true }
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
  dislike: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const project = await Project.findByIdAndUpdate(
      { _id: args.projectId },
      {
        $pull: { likes: req.userId }
      },
      { new: true }
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
  addOrganization: async args => {
    try {
      if (!req.isAuth) {
        throw new Error("User is not authenticated");
      }
      const organization = new Organization({
        name: args.orgInput.name,
        website: args.orgInput.website,
        icon: args.orgInput.icon
      });

      const res = await organization.save();
      return { ...res._doc, _id: res.id };
    } catch (err) {
      throw err;
    }
  },
  orgSearch: async args => {
    try {
      var re = new RegExp(args.filter,"i")
      const  org = await Organization.find({name:{ $regex:  re }})
      .limit(4)
      .sort({ createdAt: -1 });
      const res = org.map(async o => {
        let temp = await transformOrg(o);
        return temp;
      });
      console.log(res);
      return res;
    }
    catch(err) {
      throw err;
    }
  }
};
