const User = require('../models/User')
const bcrypt = require('bcrypt')



exports.getAllUsers = async(req,res) => {
    try{
        const data = await User.find();
        res.json(data)
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getUserById = async(req,res) => {
    try{
        const data = await User.findById(req.params.id);
        if(!data) {
            res.status(500).json({
                message: "User didn't exists !!"
            })
        }
        res.json(data)
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// exports.updateUserById = async(req,res) => {
//     try {
//         const id = req.params.id;

//         const {name, email, password, isAdmin, isSuperAdmin} = req.body;
//         const options = {new: true}
//         const hashedPassword = await bcrypt.hash(password,10);
//         if(password.length<6) return res.status(400).json({
//             message: "Password should have minimum length of 6 characters"
//         })
//         const result = await User.findByIdAndUpdate(
//             id, {
//                 name:name,
//                 email:email,
//                 password: hashedPassword,
//                 isAdmin: isAdmin,
//                 isSuperAdmin: isSuperAdmin
//             }
//         )
//         console.log(result);
//         if(!result) {
//             res.status(500).json({
//                 message: "Update Failed"
//             })
//         }
//         res.status(result)
//     } catch(error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }
exports.updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, password, isadmin, issuperadmin } = req.body;

        const updateFields = {
            name,
            email,
            isadmin,
            issuperadmin
        };

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password should have minimum length of 6 characters"
                });
            }
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const result = await User.findByIdAndUpdate(id, updateFields, { new: true });

        if (!result) {
            return res.status(404).json({ message: "User not found or update failed" });
        }

        return res.status(200).json({ message: "User updated successfully", user: result });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};



exports.deleteUser = async(req,res) => {
    try{
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`User with Name:: ${data.name} has been deleted successfully`)
    } catch(error) {
        res.status(500).json({
            message:error.message
        })
    }
}