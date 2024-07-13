function Option({ questions, dispatch, answer }) {
  const hasAns = answer !== null;
  return (
    <div className="options">
      {questions.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAns
              ? index === questions.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAns}
          onClick={() => dispatch({ type: "newAns", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Option;
