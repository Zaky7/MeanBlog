const os = require('os');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function getCurrentIp() {
  const { stdout, stderr } = await exec('ifconfig en1');

  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  // console.log(`Number of files ${stdout}`);

  const res = stdout;
  let lines = res.split("\n");
  let ip = "localhost";

  for (let i = 0, n = lines.length; i < n; i++) {
    if (lines[i].indexOf("inet") != -1) {
      const words = lines[i].split(" ");
      if (words.length > 2 && words[1] != undefined) {
        ip = words[1];
        break;
      }
    }
  }

  return ip;
}


async function chageEnvironment() {

  console.log(`Changing Ip in Enviroment.js`);

  const currentIp = await getCurrentIp();

  try {
    let data = await readFile('./client/meanblog/src/environments/environment.ts', 'utf8');
    const lines = data.split("\n");

    for(let i=0, n=lines.length; i < n; i++) {
        if(lines[i].indexOf('api_url') != -1) {
           lines[i] = replaceUrl(lines[i], currentIp);
           console.log(lines[i]);
        }
    }

    data = lines.join("\n");
    await writeFile('./client/meanblog/src/environments/environment.ts', data, 'utf8');
  } catch(err) {
    console.log(err);
  }

}

function replaceUrl(str, replaceStr) {
  replaceStr += ":"
  const newStr = str.replace(/192.*.*.*:/gi, replaceStr);
  return newStr;
}

chageEnvironment();
