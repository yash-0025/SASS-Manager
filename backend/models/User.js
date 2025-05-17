const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


const userSchema = new Schema({
    name: {
        type: String,
        required: rue,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid address !!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters']
    },
    isAdmin: {
        type: Boolean,
        default:false,
    },
    isSuperAdmin:{
        type: Boolean,
        default:false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },

})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return(next)
    } catch(error) {
        return next(error)
    }
})

module.exports = mongoose.model('User', userSchema);