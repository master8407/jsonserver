const board = document.querySelector(".board");
const inputList = board.querySelectorAll("input");
const getPass = document.querySelector(".userPass");
const getName = document.querySelector(".userName");
const getContents = document.querySelector(".userContents");
const btn = document.querySelector(".btn_send");
const resultData = document.querySelector(".resultData");

const url = "http://localhost:3000/comments";

let getNameValue;
let getPassValue;
let getContentsValue;

function init() {
    focuseMove();
    formData();
    getData();
}

function reset() {
    getName.value = "";
    getPass.value = "";
    getContents.value = "";
    getName.classList.remove("active");
    getPass.classList.remove("active");
}

function focuseMove() {
    inputList.forEach((item) => {
        item.addEventListener("blur", (e) => {
            if (e.target.value !== "") {
                e.target.classList.add("active");
            } else {
                e.target.classList.remove("active");
            }
        });
    });
}

// POST요청
function formData() {
    function setData() {
        getNameValue = getName.value;
        getPassValue = getPass.value;
        getContentsValue = getContents.value;

        fetch(url, {
            method: "POST", // HTTP 요청 방법
            body: JSON.stringify({
                // 전송할 데이터
                name: getNameValue,
                content: getContentsValue,
            }),
            headers: {
                // 헤더 값 정의 - content-type 정의
                "content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then(() => reset())
            .then((json) => console.log("POST요청"));
    }

    btn.addEventListener("click", () => {
        setData();
        getData();
    });
}

// GET요청
function getData() {
    let target;
    let userName;
    let userContents;

    fetch(url)
        .then((response) => response.json())
        .then((json) => makeList(json))
        .then(() => modifyHtml())
        .then(() => removeHtml());

    function makeList(_data) {
        target = _data[_data.length - 1];

        if (resultData.childElementCount === 0) {
            _data.forEach((item) => {
                userName = item.name;
                userContents = item.content;
                insertHtml();
            });
        } else {
            userName = target.name;
            userContents = target.content;
            insertHtml();
        }
    }

    // HTML 넣기
    function insertHtml() {
        const makeHtml = `
			<li>
				<div class="inner">
					<div class="list_name resultName">
						<input type="text" class="listName" disabled="disabled" value=${userName}> 
						<div class="btnset">
							<button type="button" class="btn_modify"><span class="material-icons-outlined">
							edit
							</span></button>
							<button type="button" class="btn_delete"><span class="material-icons-outlined">
							delete
							</span></button>
						</div>
					</div>
					<div class="list_content resultArea">
						<textarea class="listText" disabled="disabled">${userContents}</textarea> 
					</div>
				</div>
			</li>
		`;

        resultData.insertAdjacentHTML("beforeend", makeHtml);
        console.log("GET요청");
    }
}

// DELETE요청
function removeHtml() {
    const list = document.querySelectorAll(".resultData li");

    // li 순회
    list.forEach((item, idx) => {
        // 삭제버튼 찾기
        const del = item.querySelector(".btn_delete");
        // 버튼 클릭
        del.addEventListener("click", (e) => {
            e.preventDefault();
            item.remove();
            removeData(idx + 1);
        });
    });

    function removeData(number) {
        const delUrl = `http://localhost:3000/comments/${number}`;

        fetch(delUrl, {
            method: "DELETE", // HTTP 요청 방법
        }).then((response) => response.json());

        console.log("DELETE요청");
    }
}

// PUT요청
function modifyHtml() {
    const list = document.querySelectorAll(".resultData li");

    // li 순회
    list.forEach((item, idx) => {
        // 수정버튼 찾기
        const modify = item.querySelector(".btn_modify");
        const inputName = item.querySelector(".listName");
        const listText = item.querySelector(".listText");

        // 버튼 클릭
        modify.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(e.target.innerText);

            if (e.target.innerText === "edit") {
                console.log();
                e.target.innerText = "check";
                inputName.disabled = false;
                listText.disabled = false;
                inputName.focus();
            } else {
                e.target.innerText = "edit";
                inputName.disabled = true;
                listText.disabled = true;
                putData(inputName, listText, idx + 1);
            }
        });
    });

    function putData(_name, _contents, number) {
        const putUrl = `http://localhost:3000/comments/${number}`;

        let getNameValue = _name.value;
        let getContentsValue = _contents.value;

        fetch(putUrl, {
            method: "PUT", // HTTP 요청 방법
            body: JSON.stringify({
                // 전송할 데이터
                name: getNameValue,
                content: getContentsValue,
            }),
            headers: {
                // 헤더 값 정의 - content-type 정의
                "content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then((json) => console.log("PUT요청", json));
    }
}

window.addEventListener("load", () => {
    init();
});
