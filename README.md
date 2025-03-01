如果你希望在 Termux 中搭建一个本地服务器，但不想使用 Python，可以考虑使用 Node.js 和 Express。
Node.js 是一种基于 JavaScript 的服务器端运行环境，而 Express 是一个流行的 Node.js 框架，用于快速搭建服务器。
以下是使用 Node.js 和 Express 在 Termux 中搭建一个简单本地服务器的详细步骤，实现数据上传和删除功能。
1. 安装 Node.js 和 npm1. 打开 Termux，运行以下命令安装 Node.js 和 npm：
pkg update
pkg install nodejs
验证是否安装成功：
node -v
npm -v
2. 创建项目并安装依赖
1. 创建项目文件夹：
mkdir ~/myserver
cd ~/myserver
初始化 Node.js 项目：
npm init -y
3.安装 Express 和其他依赖：
npm install express body-parser ejs
4.编写服务器代码
1. 创建一个名为server.js的文件：
nano server.js
2. 在server.js中输入以下代码：
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// 使用 EJS 作为模板引擎
app.set('view engine', 'ejs');

// 解析 POST 请求的表单数据
app.use(bodyParser.urlencoded({ extended: true }));

// 存储上传的数据
let data = [];

// 主页：显示上传的数据和删除按钮
app.get('/', (req, res) => {
    res.render('index', { data });
});

// 接收客户端上传的数据
app.post('/upload', (req, res) => {
    const { name, url } = req.body;
    if (name && url) {
        data.push({ name, url });
    }
    res.redirect('/');
});

// 删除数据
app.get('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < data.length) {
        data.splice(index, 1);
    }
    res.redirect('/');
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
3. 创建一个名为views的文件夹，并在其中创建一个名为index.ejs的文件：
mkdir views
nano views/index.ejs
4. 在index.ejs中输入以下 HTML 和模板代码：
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>上传数据列表</title>
</head>
<body>
    <h1>上传数据列表</h1>
    <form action="/upload" method="POST">
        <label for="name">名称：</label>
        <input type="text" id="name" name="name" required><br>
        <label for="url">网址：</label>
        <input type="text" id="url" name="url" required><br>
        <button type="submit">上传</button>
    </form>
    <ul>
        <% data.forEach((item, index) => { %>
            <li><%= item.name %> - <%= item.url %> <a href="/delete/<%= index %>">删除</a></li>
        <% }) %>
    </ul>
</body>
</html>
4. 启动服务器
1. 在 Termux 中运行以下命令启动服务器：
node server.js
服务器启动后，你会看到类似以下的输出：
Server is running at http://localhost:5000
5. 测试服务器
          1. 在手机浏览器中访问   http://localhost:5000   或   http://127.0.0.1:5000  。
          2. 输入名称和网址，点击“上传”按钮，数据将显示在页面上。
          3. 点击“删除”按钮，对应的数据会被删除。
          6. 让其他设备访问本地服务器
          1. 获取手机的局域网 IP 地址：
ifconfig
查找   wlan0   或   eth0   的   inet   地址，例如   192.168.1.100  。2. 在其他设备上，访问   http://<手机IP地址>:5000  ，例如   http://192.168.1.100:5000  。
  通过以上步骤，你可以在 Termux 中使用 Node.js 和 Express 搭建一个简单的本地服务器，实现数据上传和删除功能，而无需使用 Python。
