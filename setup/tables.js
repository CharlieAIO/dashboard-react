const {pool} = require('../server/utils')
const uuid = require('uuid')

async function user() {
    try{
        await pool.query(
            `CREATE TABLE users 
            (
                "key" VARCHAR(255),
                "plan" VARCHAR(255),
                "discordId" BIGINT,
                "discordName" VARCHAR(255),
                "discordImage" VARCHAR(255),
                "email" VARCHAR(255),
                "customerId" VARCHAR(255),
                "subscriptionId" VARCHAR(255),
                "expiryDate" BIGINT,
                "machineId" VARCHAR(255),
                "dateCreated" BIGINT,
                "dateJoined" BIGINT,
                "id" UUID,
                "expired" BOOLEAN
            )`
        )
        await pool.end()
    }catch(e) {
        console.log(e)
    }
}


async function restocks() {
    try{
        await pool.query(
            `CREATE TABLE restocks 
            (
                "password" VARCHAR(255),
                "stock" BIGINT,
                "stockRemaining" BIGINT,
                "planId" VARCHAR(255),
                "restockMethod" VARCHAR(255),
                "id" UUID,
                "planName" VARCHAR(255)
            )`
        )
        await pool.end()
    }catch(e) {
        console.log(e)
    }
}


async function plans() {
    try{
        await pool.query(
            `CREATE TABLE plans 
            (
                "planName" VARCHAR(255),
                "price" VARCHAR(255),
                "currency" VARCHAR(255),
                "type" VARCHAR(255),
                "role" VARCHAR(255),
                "interval" VARCHAR(255),
                "intervalType" VARCHAR(255),
                "planId" VARCHAR(255),
                "id" UUID,
                "unbindable" BOOLEAN,
                "oneTimeAmount" VARCHAR(255),
                "expiry" VARCHAR(255)
            )`
        )
        await pool.end()
    }catch(e) {
        console.log(e)
    }
}
plans()

// async function plans() {
//     try{
//         await pool.query(
//             `CREATE TABLE accounts 
//             (
//                 "id" UUID,
//                 "name" VARCHAR(255),
//                 "guild" VARCHAR(255),
//                 "name" VARCHAR(255),
//                 "ownerId" VARCHAR(255),
//             )`
//         )
//         await pool.end()
//     }catch(e) {
//         console.log(e)
//     }
// }


async function test() {
    // Works
    const query = [
        "test",
        5,
        "Member",
        "£20",
        uuid.v1()
    ]
    await pool.query(
        "INSERT INTO restocks values ($1,$2,$3,$4,$5)",
        query
    )
}
