const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const fs = require('fs');
const { pathToFileURL } = require('url');
const {pool} = require('../utils.js')
var axios = require('axios');

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

async function getSnare(footlockerUrl) {
    // let session = mainWindow.webContents.session;
    var genID = requireUncached('../sessionIdGen.js')

    var currStamp = Date.now();
    var snareUrl = `https://mpsnare.iesnare.com/snare.js?_=${currStamp}`
    var agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
    var options = {
        method: "GET",
        url: snareUrl,
        headers: {
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': footlockerUrl,
            'Sec-Fetch-Dest': 'script',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': agent
        }
    }
    var response
    try{
        response = await axios.get(snareUrl)
    }catch(e){
        {}
    }
    var cookies = require('tough-cookie');
    var body = response.data
    var Cookie = cookies.Cookie;
    
    cookie = response.headers['set-cookie'].map(Cookie.parse);
    var SVRTIME = "";
    var JSTOKEN = "";
    var IGGY = "";
    var agentEncoded = "";
    var languageEncoded = "";

    // for (let itt = 0; itt < cookie.length; itt++) {
        // if (cookie[itt].key.includes("io_token")) {
            // jsToken = cookie[itt].value;
        // }
    // 

    outJSSRC = (body.split('_i_cr.__if_fc("JSSRC",_i_o.__if_ap("')[1]).split('"))')[0];
    SVRTIME = (body.split('_i_cr.__if_fc("SVRTIME","')[1]).split('");')[0];
    JSTOKEN = (body.split('_i_cr.__if_fc("JSTOKEN","')[1]).split('");')[0];
    IGGY = (body.split('_i_cr.__if_fc("IGGY","')[1]).split('");')[0];
    agentEncoded = (body.split('var _i_fd=decodeURIComponent("')[1]).split('");')[0].trim();
    languageEncoded = (body.split('_i_cr.__if_fc("HACCLNG",decodeURIComponent("')[1]).split('"));')[0];

    // console.log(jsToken)
    // console.log(JSTOKEN)

    genDEVICEID = genID.initMAIN(
        outJSSRC,
        agent,
        JSTOKEN,
        agentEncoded,
        languageEncoded,
        -60,//aexOffset
        SVRTIME,
        'Netscape',
        '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
        'Win32',
        'Netscape', //apname
        'Win32',
        IGGY,
        '1440',
        '2560',
        'internal-pdf-viewer;mhjfbmdgcfjbbpaeojofohoefgiehjai;internal-nacl-plugin;',
        footlockerUrl, //(referer)
        footlockerUrl,//document.URL (intloc)
        -60) //getOffset
    // console.log(genDEVICEID)
    return genDEVICEID
}


router.get(
    '/snare',
    async function(req, res){
        apiKeyList = [process.env.KEY_SECRET]
        if(apiKeyList.includes(req.get('apikey'))){
            var resp = await getSnare(req.query.url)
            res.send(resp)
        }else{
            res.sendStatus(403).end()
        }
    }
)






router.get(
    '/extension/download',
    function(req, res){
        const downloadName = `./extension.zip`;
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=extension`);
        res.download(downloadName);
    }
)
router.get(
    '/venetia-cli-latest',
    function(req, res){
        fs.readdir('./versions/', (err, files) => {
            if (err) {
                res.json({version:null, error:err}).end(200)
            }
            for (const file of files) {
                var version = file.split('VenetiaCLI_')[1].split('.exe')[0]
                res.json({version:version}).end(200)
            }
        })
    }
)
router.get(
    '/venetia-cli-latest/download',
    function(req, res){
        fs.readdir('./versions/', (err, files) => {
            for (const file of files) {
                const downloadName = `./versions/${file}`;
                res.setHeader('Content-type', 'application/x-msdownload'); 
                res.setHeader('Content-Disposition',`attachment; filename=${file}`);
                res.download(downloadName)
            }
        })
    }
)
router.post(
    `/version/upload`,
    async function(req, res){
        var version = req.body.versionNumber
        try{
            fs.readdir('./versions/', (err, files) => {
                for (const file of files) {
                    fs.unlink(pathToFileURL('./versions/' + file), err => {
                        if(err){
                            console.log(err)
                        }
                    });
                }
            });
        }catch(e){}

        var file = req.files.venetiaFile
        file.mv(`./versions/VenetiaCLI_${version}.exe`)
        return res.json({upload:"completed"})
    }

)

router.get(
    `/upload/28138791237123798123`,
    async function(req, res){
        res.render('upload')
    }

)

router.get(
    '/checkout',
    async function(req,res){

        let results = await pool.query(`select * from cookies where id='${req.query.id}'`);

        var title;
        if (!results.rows[0].title) title = 'null'
        else title = results.rows[0].title

        var price;
        if (!results.rows[0].price) price = 'null'
        else price = results.rows[0].price

        var image;
        if (!results.rows[0].image) image = 'https://p1.hiclipart.com/preview/658/470/455/krzp-dock-icons-v-1-2-empty-grey-empty-text-png-clipart.jpg'
        else image = results.rows[0].image

        var redirect = req.query.redirect;

        

        if(redirect){
            redirect = Buffer.from(redirect, 'base64').toString()
        }else{
            redirect = "Failed to retrieve checkout"
        }
        return res.render('checkout',{url:redirect, product:title, price:price, image:image})
        
    }
)
router.post(
    '/checkout/setCookies',
    async function(req,res){
        if(req.get('apikey') == process.env.API_KEY){

            await pool.query("insert into cookies values ($1,$2,$3,$4,$5,$6)",[req.body.viewId,req.body.cookies,req.body.redirect, req.body.productTitle, req.body.productImage, req.body.productPrice])

            return res.status(200).end()

        }else{
            return res.sendStatus(403).end()
        }    
    }
)
router.get(
    '/checkout/retrieve',
    async function(req,res){
        var viewId = req.query.id;


        let results = await pool.query(`select * from cookies where id='${viewId}'`);
        var cookies;
        var redirect;

        try{
            cookies = results.rows[0].cookies;
            redirect = results.rows[0].redirect;

        }catch(error){
            console.log(error)
            res.redirect(`${process.env.domain}/checkout/`)
        }
        
        if(cookies,redirect) {
            var url = `${process.env.domain}/checkout/?cookies=${cookies}&redirect=${redirect}&id=${viewId}`;
            return res.redirect(url);
        }
        else {
            return res.redirect(`${process.env.domain}/checkout/`)
        }

        
        
    }
)

module.exports = router
