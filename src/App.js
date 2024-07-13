import { useEffect } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Main from "./components/Main";
import { useReducer } from "react";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import Finished from "./components/Finished";
import Timer from "./components/Timer";
import Footer from "./components/Footer";

const intialState = {
  questions: [],
  //"laoding" ,"error","ready","active","finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  second: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        second: state.questions.length * 30,
      };
    case "newAns":
      const ques = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === ques.correctOption
            ? state.points + ques.points
            : state.points,
      };
    case "nextQues":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...intialState,
        questions: state.questions,
        highScore: state.highScore,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        second: state.second - 1,
        status: state.second === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("unknow error");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, second },
    dispatch,
  ] = useReducer(reducer, intialState);

  const numQuestions = questions.length;
  const maxPoint = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoint={maxPoint}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer second={second} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <Finished
            points={points}
            maxPoint={maxPoint}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
