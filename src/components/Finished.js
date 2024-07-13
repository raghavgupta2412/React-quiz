function Finished({ points, maxPoint, highScore, dispatch }) {
  const percentage = (points / maxPoint) * 100;
  return (
    <>
      <p className="result">
        you scored <strong>{points}</strong> out of {maxPoint} (
        {Math.ceil(percentage)})%
      </p>
      <p className="highscore">(HighScore is {highScore} Points) </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default Finished;
