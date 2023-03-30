import "./GameOver.css"

const Gameover = ({retry, score}) => {
  return (
    <div>
      <h1>Fim de jogo!</h1>
      <h2>A sua pontuação foi: {score}</h2>
      <button onClick={retry}>Resetar Jogo</button>
    </div>
  )
}

export default Gameover