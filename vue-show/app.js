const express = require('express')
// 创建 web 服务器 
const app = express()

// 托管静态资源 
app.use(express.static('./dist'))

// 启动 web 服务器 
app.listen(80, () => {
    console.log('web server running at http://127.0.0.1')
})