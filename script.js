/* =========================
   ① ゲームの状態を管理する変数
========================= */

// 盤面の状態（9マス）
let board = ["", "", "", "", "", "", "", "", ""];

// 勝敗が決まったか
let gameOver = false;

// CPUが思考かどうか
let cpuThinking = false;

// 人の記号（○ or ×）
let humanPlayer = "○";
// CPUの記号
let cpuPlayer = "×";


/* =========================
   ② 画面要素の取得
========================= */

// マス（盤面）
const cells = document.querySelectorAll(".cell");
// リセットボタン
const resetButton = document.getElementById("resetButton");
// 手番表示
const turnText = document.getElementById("turn");
// 先手後手変更ボタン
const playOButton = document.getElementById("playOButton");
const playXButton = document.getElementById("playXButton");

/* =========================
   ③ 初期表示
========================= */

turnText.textContent = `あなた（${humanPlayer}）の番です`;
playOButton.addEventListener("click", () => {
    humanPlayer = "○";
    cpuPlayer = "×";
    setActiveButton(playOButton);
    resetGame();
});

playXButton.addEventListener("click", () => {
    humanPlayer = "×";
    cpuPlayer = "○";
    setActiveButton(playXButton);
    resetGame();
});

setActiveButton(playOButton); // 初期は先手（○）


/* =========================
   ④ イベント設定
========================= */

// 各マスがクリックされたとき
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

// リセットボタン
resetButton.addEventListener("click", resetGame);


/* =========================
   ⑤ 関数定義
========================= */

// マスがクリックされたときの処理
function handleCellClick(cell, index) {

    // ゲーム終了後 or CPU思考中は操作不可
    if (gameOver || cpuThinking) return;

    // すでに埋まっているマスは不可
    if (cell.textContent !== "") return;

    // 人の手
    cell.textContent = humanPlayer;
    board[index] = humanPlayer;

    if (humanPlayer === "○") {
        cell.classList.add("o");
    } else {
        cell.classList.add("x");
    }


    // 勝敗判定
    const result = checkWinner();
    if (result) {
        turnText.textContent =
            result.winner === humanPlayer
                ? "あなたの勝ちです！"
                : "CPUの勝ちです";


        //勝ったラインを強調表示
        result.line.forEach(index => {
            if (result.winner === "○") {
                cells[index].classList.add("win-o");
            } else {
                cells[index].classList.add("win-x");
            }
        });

        gameOver = true;
        return;
    }

    // 引き分け判定
    if (checkDraw()) {
        turnText.textContent = "引き分けです";
        gameOver = true;
        return;
    }

    // CPUの番（少し待ってから）
    cpuThinking = true;
    turnText.textContent = "CPUが考え中…";

    setTimeout(() => {
        cpuMove();

        // CPUの勝敗判定
        const cpuResult = checkWinner();
        if (cpuResult) {
            turnText.textContent =
                cpuResult.winner === humanPlayer
                    ? "あなたの勝ちです！"
                    : "CPUの勝ちです";

            cpuResult.line.forEach(index => {
                if (cpuResult.winner === "○") {
                    cells[index].classList.add("win-o");
                } else {
                    cells[index].classList.add("win-x");
                }
            });

            gameOver = true;
            return;
        }

        // CPU後の引き分け判定
        if (checkDraw()) {
            turnText.textContent = "引き分けです";
            gameOver = true;
            cpuThinking = false;
            return;
        }

        // 次は人の番
        cpuThinking = false;
        turnText.textContent = `あなた（${humanPlayer}）の番です`;

    }, 800); // ← 800ms（0.8秒）


}


// ゲームをリセットする処理
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("o", "x", "win-o", "win-x");
    });

    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;

    cpuThinking = false;

    // 表示を現在の人の記号に合わせる
    turnText.textContent = `あなた（${humanPlayer}）の番です`;

    // 人が後手なら、CPUが最初に打つ
    if (humanPlayer === "×") {
        cpuMove();
    }
}



// 勝敗をチェックする関数
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
        [0, 4, 8], [2, 4, 6]           // 斜め
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return {
                winner: board[a],
                line: pattern
            };
        }
    }

    return null;
}

// 引き分けかどうかを判定する関数
function checkDraw() {
    return !board.includes("");
}


// CPUの関数
function cpuMove() {
    // 空いているマスのインデックスを集める
    const emptyIndexes = [];

    board.forEach((value, index) => {
        if (value === "") {
            emptyIndexes.push(index);
        }
    });

    // 空きマスがなければ何もしない
    if (emptyIndexes.length === 0) return;

    // ランダムに1つ選ぶ
    const randomIndex =
        emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

    // 選んだマスに × を置く
    const cell = cells[randomIndex];

    cell.textContent = cpuPlayer;
    board[randomIndex] = cpuPlayer;

    if (cpuPlayer === "○") {
        cell.classList.add("o");
    } else {
        cell.classList.add("x");
    }

}

function setActiveButton(activeButton) {
    playOButton.classList.remove("active");
    playXButton.classList.remove("active");

    activeButton.classList.add("active");
}