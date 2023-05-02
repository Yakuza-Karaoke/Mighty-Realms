import React, { useState } from "react";
import "./index.css";

// Компонент для отрисовки клетки поля
export const Cell = ({ x, y, player, onClick }) => {
  // Определяем цвет клетки в зависимости от игрока
  let color = "white";
  if (player === 1) {
    color = "blue";
  } else if (player === 2) {
    color = "red";
  }

  // Определяем стиль клетки
  const style = {
    left: `${x * 50}px`,
    top: `${y * 50}px`,
    backgroundColor: color
  };

  // Возвращаем JSX-элемент клетки
  return (
    <div className="cell" style={style} onClick={() => onClick(x, y)}>
      {player > 0 && <div className="health">{20}</div>}
    </div>
  );
};

// Компонент для отрисовки поля
export const Field = ({ size, players, onMove }) => {
  // Создаем массив клеток
  const cells = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      // Определяем, есть ли игрок на данной клетке
      const player = players.find((p) => p.x === x && p.y === y);
      // Добавляем клетку в массив
      cells.push(
        <Cell
          key={`${x}-${y}`}
          x={x}
          y={y}
          player={player ? player.id : 0}
          onClick={onMove}
        />
      );
    }
  }

  // Возвращаем JSX-элемент поля
  return <div className="field">{cells}</div>;
};

// Компонент для отрисовки кнопки подтверждения хода
export const ConfirmButton = ({ onClick }) => {
  // Возвращаем JSX-элемент кнопки
  return (
    <div className="button" onClick={onClick}>
      Подтвердить ход
    </div>
  );
};

// Компонент для отрисовки игры
export const Game = () => {
  // Определяем размер поля
  const size = 10;

  // Создаем состояние для хранения игроков и их координат
  const [players, setPlayers] = useState([
    { id: 1, x: 0, y: size - 1 }, // Игрок синий
    { id: 2, x: size - 1, y: 0 } // Игрок красный
  ]);

  // Создаем состояние для хранения текущего игрока и его выбранной клетки
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedCell, setSelectedCell] = useState(null);

  // Создаем состояние для хранения результата игры (победитель или ничья)
  const [result, setResult] = useState(null);

  // Функция для обработки клика по клетке поля
  const handleMove = (x, y) => {
    // Если игра уже закончилась, ничего не делаем
    if (result) {
      return;
    }

    // Находим текущего игрока по его id
    const player = players.find((p) => p.id === currentPlayer);

    // Проверяем, является ли выбранная клетка соседней с текущей позицией игрока
    const isAdjacent =
      Math.abs(x - player.x) + Math.abs(y - player.y) === 1;

    // Проверяем, есть ли другой игрок на выбранной клетке
    const opponent = players.find((p) => p.x === x && p.y === y);

    // Если клетка соседняя и занятая другим игроком, то атакуем его
    if (isAdjacent && opponent) {
        attack(player, opponent);
      }
    };

    // Функция для обработки клика по кнопке подтверждения хода
  const handleConfirm = () => {
    // Если игра уже закончилась или нет выбранной клетки, ничего не делаем
    if (result || !selectedCell) {
      return;
    }

    // Обновляем координаты текущего игрока на выбранную клетку
    setPlayers(
      players.map((p) =>
        p.id === currentPlayer ? { ...p, ...selectedCell } : p
      )
    );

    // Сбрасываем выбранную клетку
    setSelectedCell(null);

    // Меняем текущего игрока на следующего
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  // Функция для атаки другого игрока
  const attack = (attacker, defender) => {
    // Вычитаем здоровье защитника из здоровья атакующего
    const newHealth = attacker.id - defender.id;

    // Если здоровье атакующего стало меньше или равно нулю, то он проиграл
    if (newHealth <= 0) {
      setResult(defender.id);
      return;}

      // Если здоровье атакующего стало больше нуля, то он победил
      if (newHealth > 0) {
        setResult(attacker.id);
        return;
      }
    };
  
    // Функция для отрисовки результата игры
    const renderResult = () => {
      // Если игра еще не закончилась, ничего не отрисовываем
      if (!result) {
        return null;
      }
  
      // Определяем текст результата в зависимости от победителя
      let text = "";
      if (result === 1) {
        text = "Победил синий игрок!";
      } else if (result === 2) {
        text = "Победил красный игрок!";
      }
  
      // Возвращаем JSX-элемент результата
      return <div className="result">{text}</div>;
    };
  
    // Возвращаем JSX-элемент игры
    return (
      <div className="game">
        <Field size={size} players={players} onMove={handleMove} />
        <ConfirmButton onClick={handleConfirm} />
        {renderResult()}
      </div>
    );
  };
  
  // Экспортируем компонент игры
  export default Game;