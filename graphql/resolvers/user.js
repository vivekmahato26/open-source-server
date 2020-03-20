const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try{
            const checkEmail = await User.findOne({email: args.userLoginInput.email});
            if(checkEmail) {
                throw new Error("Email already registered");
            }
            const hashedPass = await bcrypt.hash(args.userLoginInput.password,12);
            const userLogin = new User({
                sname: args.userLoginInput.sname,
                email: args.userLoginInput.email,
                password: hashedPass,
                createdAt: new Date(args.projectInput.createdAt)
            });
            const res = await userLogin.save();
            return { ...res._doc, _id: res.id };
        }
        catch(err) {
            throw err;
        }
    },
    updateUser: async(args,req) => {
        if(!req.isAuth) {
            throw new Error('User is not authenticated!');
        }
        let social = args.userInput.social[0].split(',');
        const user = await User.findByIdAndUpdate(
            {_id:req.userId},
            {
                name: args.userInput.name,
                bio: args.userInput.bio,
                $push:{social}
            });
        let updatedUser;
        try {
            const resDetails = await user.save();
            updatedUser = resDetails;
            return updatedUser;
        }
        catch (err) {
            throw err;
        }
    },
    login: async (args) => {
        const user = await User.findOne({ email: args.loginInput.email });
        if (!user) {
          throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(args.loginInput.password, user.password);
        if (!isEqual) {
          throw new Error('INvalid Credentials!');
        }
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY,
          {
            expiresIn: '10000h'
          }
        );
        return { userId: user.id, token: token};
    },
    user: async(args) => {
        try{
            const user = await User.findById(args.userId);
            return user;
        }
        catch(err) {
            throw err;
        }
    }
};