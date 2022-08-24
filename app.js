const express = require("express");
const app = express();

// public 폴더에 있는 모든 정적 파일을 URL로 제공할 수 있게 됨
app.use(express.static("public"));

app.listen(3000, () => {
    // 3000번 포트로 웹 서버 실행
    console.log("Server started. port 3000.");
});
