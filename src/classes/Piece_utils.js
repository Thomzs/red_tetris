//import game from "../views/Game";

let colors = ["#E74C3C", "#9B59B6", "#2980B9", "#1ABC9C", "#F1C40F", "#D35400"];

let rect_line_piece = [[0, 0, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 0]];

let rect_line_ = [[]]

let snake_piece = [[0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 1, 0]];

let square_piece = [[0, 1, 1, 0],
                    [0, 1, 1, 0]];

let game_pieces = [square_piece, snake_piece, rect_line_piece];
let game_board = [];
let empty_row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let i = 0;
while (i < 20)
{
    game_board.push(empty_row);
    i++;
}

module.exports = {game_pieces, game_board, colors};
//game_board[game_board.length - 2] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
//console.log(game_board);
