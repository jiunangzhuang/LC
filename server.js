const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// 使用 EJS 作为模板引擎
app.set('view engine', 'ejs');

// 解析 POST 请求的表单数据
app.use(bodyParser.urlencoded({ extended: true }));

// 提供 public 文件夹中的静态文件
app.use(express.static('public'));

// 数据文件路径
const dataFilePath = path.join(__dirname, 'data.json');

// 从文件中加载数据
let data = [];
try {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    data = JSON.parse(rawData);
} catch (err) {
    console.error('Error loading data:', err);
}

// 保存数据到文件
function saveData() {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// 上传页面
app.get('/upload', (req, res) => {
    res.render('upload');
});

// 接收客户端上传的数据
app.post('/upload', (req, res) => {
    const { name, url } = req.body;
    if (name && url) {
        data.push({ name, url });
        saveData(); // 保存数据到文件
    }
    res.redirect('/view');
});

// 查看数据页面（包含搜索和分页逻辑）
app.get('/view', (req, res) => {
    const { search, page } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = 20;

    let filteredData = data;

    // 搜索逻辑
    if (search) {
        filteredData = data.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase()) || 
            item.url.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 分页逻辑
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.render('view', {
        data: paginatedData,
        search: search || '', // 保留搜索关键词
        page: currentPage,
        totalPages
    });
});

// 删除单条数据
app.get('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < data.length) {
        data.splice(index, 1);
        saveData(); // 保存数据到文件
    }
    res.redirect('/view');
});

// 删除当页数据
app.get('/delete-page', (req, res) => {
    const { search, page } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = 20;

    let filteredData = data;

    // 搜索逻辑
    if (search) {
        filteredData = data.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase()) || 
            item.url.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 分页逻辑
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 删除当页数据
    filteredData.splice(startIndex, endIndex - startIndex);
    data = filteredData;
    saveData(); // 保存数据到文件

    res.redirect('/view');
});

// 删除全部数据
app.get('/delete-all', (req, res) => {
    data = [];
    saveData(); // 保存数据到文件
    res.redirect('/view');
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
