import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Sort(props) {
  return (
    <button onClick={props.onClick}>
      {props.order}
    </button>
  )
}

function Square(props) {
  // Replace the whole Square class with this function:
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {

    // Facebookはこんな書き方らしいが超絶ダサい
    let divList = [];
    for (let i = 0; i < 3; i++) {
      let squareList = []
      for (let j = 0; j < 3; j++) {
        squareList.push(this.renderSquare(i * 3 + j))
      }
      divList.push(
        <div className="board-row" key={i} >
          {squareList}
        </div>
      )
    }

    return (
      <div>
        {divList}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      historyOrderAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleOrder() {
    this.setState({
      historyOrderAsc: !this.state.historyOrderAsc
    })
  }

  createMoves(history, order) {
    const moves = history.map((step, move) => {
      const location = move ?
        `location: (${Math.floor(step.location / 3 + 1)}, ${step.location % 3 + 1})` :
        '';
      const desc = move ?
        `Go to move #${move}` :
        'Go to game start';
      const forcus = move === this.state.stepNumber ?
        'current-list-item' : ''
      return (
        //It’s strongly recommended that you assign proper keys whenever you build dynamic lists.
        <li key={move} className={forcus}>
          {location}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return order ? moves : moves.reverse();
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><Sort
            order={this.state.historyOrderAsc ? '↑' : '↓'}
            onClick={() => this.handleOrder()} /></div>
          <ol>{this.createMoves(history, this.state.historyOrderAsc)}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}