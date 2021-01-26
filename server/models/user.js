const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type:String,
        required:[true, 'userName required']
    },
    imageUrl:{
        type:String,
        required:[true, 'imageUrl required']
    },
    email:{
        type:String,
        required:[true,'email required']
    },
    id:{
        type:String,
        required:[true,'id required']
    },
    admin:{
        type:Boolean,
        required:[true, 'admin required']
    },
    staff:{
        type:Boolean,
        required:[true, 'staff required']
    },
    lastLogin:{
        type:Number,
        required:[true, 'lastLogin required']
    },
    discord:{
        accessToken:{
            type:String,
            required:[true,'accessToken required']
        },
        avatar:{
            type:String,
            required:[true,'avatar required']
        },
        discriminator:{
            type:String,
            required:[true,'discriminator required']
        },
        id:{
            type:String,
            required:[true,'id required']
        },
        refresh_token:{
            type:String,
            required:[true,'accessToken required']
        },
        username:{
            type:String,
            required:[true,'username required']
        }
        
    }
})


const User = mongoose.model('users', userSchema);

module.exports = User;