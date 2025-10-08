require("dotenv").config()
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { QuickDB, JSONDriver } = require("quick.db");

setInterval(() => {
    const jsonDriver = new JSONDriver();
    db = new QuickDB({ driver: jsonDriver });
}, 2000);
const token = '';//هنا تحط التوكن

client.on("ready" , () => {
const commands = [{
name: "set-channel",description: "تحديد روم الاقتراحات",
options: [{name : "channel",description: "..",type: 7, required: true }] 
},{
name: "cancel-sugg",
description:"الغاء نظام الاقتراحات",
},{
name: "enable-sugg",
description: "تفعيل نظام الاقتراحات"
},{
name: "info",
description: "اظهار معلومات حول البوت",
},{
name: "set-line",description:"تحديد خط روم الاقتراحات",
options:[{name: "line-link", description: "رابط الخط",type:3, required: true}]
},{
name: "set-emoji1",description:"قم بتحديد ايموجي الاول",
options:[{name: "emojji", description: "الايموجي",type:3, required: true}]
},{
name: "set-emoji2",description:"قم باختيار الايموجي الثاني",
options:[{name: "emojji2", description: "الايموجي",type:3, required: true}]
},{
name:"help",
description: "عرض قائمة اوامر البوت"
},{
name: "blacklist",description: "لاعطاء شخص بلاك ليست من الاقتراحات",
options: [{name : "user",description: ".",type: 6, required:true}]
},{
name: "unblacklist",description: "لازالة بلاك ليست",
options: [{name : "user",description: "..",type: 6, required:true}]
}]
        const rest = new REST({ version: '9' }).setToken(token);
        (async () => {
            try {
             await rest.put(
             Routes.applicationCommands(client.user.id),
             { body: commands },
            );
            console.log(client.user.tag + " Online");
            } catch (error) {
        console.error(error);
        }
    })();
})
const system = [""]//ايدي شخص الي هيدي بلاك ليست
client.on('interactionCreate', async interaction => {
if(!interaction.isCommand()) return;
await interaction.deferReply({ephemeral: true})
if(interaction.commandName == "blacklist"){
if(!system.includes(interaction.user.id))return;
let user = interaction.options.getUser('user')
if(user.bot)return await interaction.editReply({content: "> ⚠ - **عذرا هذا الشخص بوت لايمكنني اضافته للقائمة**", ephemeral: true})
if(user){
let black = await db.fetch(`blu_${user.id}`)
if(black === true)return await interaction.editReply({content:"> - **هذا الشخص في قائمة البلاك ليست بالفعل ☑**", ephemeral: true})
if(black === null || black == false){
await db.set(`blu_${user.id}`,true)
await interaction.editReply({content: `> ☑ - **تم اضافة ${user} الى البلاك ليست**`})
}}
} else
if(interaction.commandName == "unblacklist"){
if(!system.includes(interaction.user.id))return;
let user = interaction.options.getUser('name')
if(user){
  let black = await db.fetch(`blu_${user.id}`)
  if(black === null || black === false)return await interaction.editReply({content:"> - **هذا الشخص ليس من قائمة البلاك ليست اساسا ⚠**", ephemeral: true})
  if(black === true){
    await db.delete(`blu_${user.id}`, false)
}}
    await interaction.editReply({content: `> ☑ - **تم ازالة البلاك ليست ☑ ${user}**`})
  }else
  if(interaction.commandName == "set-channel"){
    if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> ⚠ - **ليست لديك صلاحية ادمن استريتر**", ephemeral: true});
    if(interaction.user.bot)return
    let channel = interaction.options.getChannel('channel')
   await db.set(`channel_${interaction.guild.id}`,channel.id)
   await db.set(`status_${interaction.guild.id}` , "enabled")
   await interaction.editReply({content:`> ☑ - **تم تحديد الاقتراحات في روم ${channel}**`});
} else
if(interaction.commandName == "cancel-sugg"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> ⚠ - **ليست لديك صلاحية ادمن استريتر**", ephemeral: true});
   const data = await db.get(`channel_${interaction.guild.id}`)
  await db.set(`status_${interaction.guild.id}` , "disabled")
  await interaction.editReply({content: `> ☑ - **تم تعطيل الاقتراحات من السيرفر**`, ephemeral: true})
} else 
if(interaction.commandName == "enable-sugg"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> ⚠ - **ليست لديك صلاحية ادمن استريتر", ephemeral: true});
    const data = await db.get(`channel_${interaction.guild.id}`)
    await db.set(`status_${interaction.guild.id}` , "enabled")
 await interaction.editReply({content: `> ☑ - **تم تفعيل الاقتراحات في السيرفر**`, ephemeral: true})
} else
if(interaction.commandName == "info"){
const humanizeDuration = require("humanize-duration");
let time = await humanizeDuration(client.uptime)
  let embed = new  MessageEmbed()
  .setAuthor({iconURL:interaction.user.avatarURL({dynamic: true}),name: interaction.user.tag})
  .addField(`:ping_pong: - Ping`,`\`${client.ws.ping}Ms\``, true)
  .addField(`⚙ - Developer`, `<@880010973216387193>`, true)
.addField(` - UptimeCount`, `
\`\`\`fix

${time}
\`\`\``, true)
  .setColor("#2f3136")
  .setThumbnail("https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024")
  .setFooter({text:"'3mran.#0799",iconURL:'https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024'})
  await interaction.editReply({embeds: [embed], ephemeral: true})
} else 
if(interaction.commandName == "set-line"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> ⚠️ - **ليست لديك صلاحية ادمن استريتر .**", ephemeral: true});
  let linee = interaction.options.getString("line-link")
  await db.set(`line_${interaction.guild.id}`, `${linee}`)
  await interaction.editReply({content: `> ☑ - **تم تحديد هذا الخط بنجاح:** ${linee}`, ephemeral: true})
} else
  if(interaction.commandName == "set-emoji1"){
    if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> ⚠ - **ليست لديك صلاحية ادمن استريتر**", ephemeral: true});
    let emoj = interaction.options.getString("emojji")
    await db.set(`react_${interaction.guild.id}`, `${emoj}`)
    await interaction.editReply({content: `> ☑ - **تم تعيين هذا الايموجي بنجاح:** ${emoj}`, ephemeral: true})
} else
if(interaction.commandName == "set-emoji2"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> ⚠ - **ليست لديك صلاحية ادمن استريتر**", ephemeral: true});
  let emoj = interaction.options.getString("emojji2")
  await db.set(`react2_${interaction.guild.id}`, `${emoj}`)
  await interaction.editReply({content: `> ☑ - **تم تعيين هذا الايموجي بنجاح:** ${emoj}`, ephemeral: true})
} else
if(interaction.commandName == "help"){
const prefix = "/"
let embed = new  MessageEmbed()
.setAuthor({iconURL:interaction.user.avatarURL({dynamic: true}),name: interaction.user.tag})
.addField(`⚙ - اوامر الخاصة في البوت :`,`
**\`${prefix}set-channel\`**\n>تحديد روم الاقتراحات\n
**\`${prefix}set-line\`**\n>تحديد الخط الي هينرسل تحت الاقتراحات\n
**\`${prefix}set-emoji1\`**\n>تحديد الايموجي الاول\n
**\`${prefix}set-emoji2\`**\n>تحديد الايموجي الثاني\n
**\`${prefix}cancel-sugg\`**\n>تعطيل روم الاقتراحات\n
**\`${prefix}enable-sugg\`**\n>تفعيل روم الاقتراحات
`,true)
.addField(` - الاوامر العامة:`,`
**\`${prefix}info\`**\n> 烙 لاظهار معلومات البوت\n
**\`${prefix}help\`**\n> ⚙ لاظهار اوامر البوت
`,true)
.setColor("#2f3136")
.setThumbnail("https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024")
.setFooter({text:"©️ All rights reserved 2024 - 2025 , 'MAYORHOST.#0799",iconURL:'https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024'})
await interaction.editReply({embeds: [embed], ephemeral: true})
}
})
client.on('messageCreate', async MayorHost => {
let data = await db.get(`blu_${MayorHost.author.id}`)
if(data === true) return
if(MayorHost.author.bot) return;
let channel = await db.get(`channel_${MayorHost.guild.id}`)
let status = await db.get(`status_${MayorHost.guild.id}`)
let line = await db.get(`line_${MayorHost.guild.id}`)
let react = await db.get(`react_${MayorHost.guild.id}`)
let react2 = await db.get(`react2_${MayorHost.guild.id}`)
if(MayorHost.channel.id != channel) return;
if(status !== "enabled")return;
if(MayorHost.content.startsWith('96')) return;
let thailand = MayorHost.content.split(' ').slice(0).join(' ');
MayorHost.delete();
let discord_gg_3mran = new MessageEmbed()
.setAuthor({name:'From : ' + MayorHost.author.username,iconURL: MayorHost.author.avatarURL({ dynamic: true })})
.setColor("#2f3136")
.setThumbnail(MayorHost.guild.iconURL({dynamic: true}))
.setFooter({text: "Suggester Id: "+MayorHost.author.id,iconURL:client.user.avatarURL()})
.setTitle(` شكرا على اقتراحات ياحب :`)
.setDescription(`\n${MayorHost}\n`)
.setTimestamp(); 
MayorHost.channel.send({embeds: [discord_gg_3mran]}).then(mayor_codes => {
mayor_codes.react(react).then(() => {
mayor_codes.react(react2).then(() => {
mayor_codes.channel.send({files:[line]})
})})})})

client.login(token)