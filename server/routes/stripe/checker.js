const {pool} = require('../../utils.js')
const { Client, MessageEmbed } = require("discord.js");
// Used to check expiry dates for rental keys.
const client = new Client();

var successColor = '0x45e670'
var failedColor = '0xe63427'
var defaultColor = '0x242121'


client.on("ready", () => {
    console.log(`Logged in as ${client2.user.tag}!`);
});

const check = async () => {
    var elapsed = 0;
    var guild = null;
    var roles = []
    async function loop() {
        setTimeout(async function () {
            // console.log(`Checks elapsed: ${elapsed}`)
            var response = await pool.query('SELECT * FROM users')
            for(var i = 0; i < response.rows.length; i++) 
            {   
                if(response.rows[i].expiryDate != 0) {
                    if(parseInt(response.rows[i].expiryDate) <= parseInt(new Date().getTime())) {
                        try {
                            guild = (await client2.guilds.fetch(process.env.GUILD_ID))
                            // Key expired if current date is greater than expiry date.
                            // Delete key
                            console.log(`Deleting Key: ${response.rows[i].key}`)
                            var embed = new MessageEmbed()
                            .setTitle("Invincible Services Dashboard")
                            .setColor(failedColor)
                            .setDescription(
                            "Trial ended. Your license will be deleted & your roles will be removed in the server."
                            );
                            await pool.query(`DELETE FROM users WHERE "discordId" = ${response.rows[i].discordId}`)

                            var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${response.rows[i].plan}'`)
                            var resultRoles = JSON.parse(results2.rows[0].role)
                            for(var i =0; i < resultRoles.length; i++)
                            {
                                roles.push(resultRoles[i].value)
                            }

                            var user = await client2.users.fetch(response.rows[i].discordId.toString())
                            if(user) user.send(embed);

                            var guildUser = await guild.members.fetch(userID);
                            for(var i =0; i<roles.length; i++) {
                                guildUser.roles.remove(roles[i]).then({}).catch(e => {})
                            }
                            roles = []

                        }catch(e){}
                    }
                }
            }
            elapsed ++;
          loop()
        }, 9000);
    };
    loop()
    
}



module.exports = check