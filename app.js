// version v0.0.1
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 公共变量
const KEY = process.env.JD_COOKIE
const serverJ = process.env.PUSH_KEY

// const KEY = 111
// const serverJ = 222

async function downFile () {
    // const url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js'
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
    await download(url, './')
}

async function changeFiele () {
   let content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
   content = content.replace(/var Key = ''/, `var Key = '${KEY}'`)
   await fs.writeFileSync( './JD_DailyBonus.js', content, 'utf8')
}

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
    }
  }
  return fmt;
};

/* 格式化日期 */
function dateFormat() {
  var timezone = 8;
  var GMT_offset = new Date().getTimezoneOffset();
  var n_Date = new Date().getTime();
  var t_Date = new Date(n_Date + GMT_offset * 60 * 1000 + timezone * 60 * 60 * 1000);
  console.log(t_Date)
  return t_Date.Format('yyyy.MM.dd')
}

async function sendNotify (text,desp) {
  const options ={
    uri:  `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }
  await rp.post(options).then(res=>{
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })
}

async function start() {
  if (!KEY) {
    console.log('请填写 key 后在继续')
    return
  }
  // 下载最新代码
  await downFile();
  console.log('下载代码完毕')
  // 替换变量
  await changeFiele();
  console.log('替换变量完毕')
  // 执行
  await exec("node JD_DailyBonus.js >> result.txt");
  console.log('执行完毕')

  if (serverJ) {
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
    }
    await sendNotify("京东签到_" + dateFormat(), content);
    console.log('发送结果完毕')
  }
}

start()