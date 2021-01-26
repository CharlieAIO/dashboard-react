const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    name:{
        type:String,
        required:[true, 'name required']
    },
    domain:{
        type:String,
        required:[true, 'domain required']
    },
    guild:{
        type:String,
        required:[true,'guild required']
    },
    ownerId:{
        type:String,
        required:[true,'ownerId required']
    },
    stripeAccount:{
        type:String,
        required:[true, 'stripeAccount required']
    },
    verificationStatus:{
        type:String,
        required:[true, 'verificationStatus required']
    },
    supportEmail:{
        type:String,
        required:[true, 'supportEmail required']
    },
    id:{
        type:String,
        required:[true, 'id required']
    },
    settings:{
        payments:{
            failedPaymentOption:{
                type:String,
                required:[true, 'failedPaymentOption required']
            }
        }
    },
    staff:{
        type:Array,
        required:[true, 'staff array required']
    },
    branding:{
        logoUrl:{
            type:String,
            required:[true, 'logoUrl required']
        }

    }
})


const Account = mongoose.model('accounts', accountSchema);

module.exports = Account;