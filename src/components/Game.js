import React, {Component} from 'react';
import Board from './Board';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[a];
    }
    return null;
}


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            nextPlayer: 'X',
            playerTypes: {
                X: 'human',
                O: 'human'
            }
        };
    }

    handleSquareClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i])
            return;
        squares[i] = this.state.nextPlayer;
        this.setState({
            history: history.concat([{
                squares
            }]),
            stepNumber: history.length,
            nextPlayer: this.state.nextPlayer === 'X' ? 'O' : 'X'
        }, () => this.computerPlay());
    }

    computerPlay() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares;
        if (this.state.playerTypes[this.state.nextPlayer] === 'computer' && squares.filter(s=>s===null).length>0) {
            let i;
            do {
                i = Math.round(Math.random() * 8);
            } while (squares[i] !== null);
            this.handleSquareClick(i);
        }
    }

    handleTypeChange(player, type) {
        const playerTypes = this.state.playerTypes;
        playerTypes[player] = type;
        this.setState({
            playerTypes
        }, () => this.computerPlay());
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            nextPlayer: (step % 2) === 1 ? 'O' : 'X'
        }, () => this.computerPlay());
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                ('Go to move #' + move) :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner)
            status = 'Winner : ' + winner;
        else
            status = 'Next Player : ' + this.state.nextPlayer;
        return (
            <div className="game">
                <div className="game-options">
                    <label htmlFor="XPlayerType">X Player</label>
                    <select name="XPlayerType" value={this.state.playerTypes.X}
                            onChange={e => this.handleTypeChange("X", e.target.value)}>
                        <option value="human">Human</option>
                        <option value="computer">Computer</option>
                    </select>
                    <label htmlFor="OPlayerType">O Player</label>
                    <select name="OPlayerType" value={this.state.playerTypes.O}
                            onChange={e => this.handleTypeChange("O", e.target.value)}>
                        <option value="human">Human</option>
                        <option value="computer">Computer</option>
                    </select>
                </div>
                <div className="game-inner">
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.handleSquareClick(i)}/>
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;