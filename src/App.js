//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from "react"

//Data
import {wordsList} from "./data/words.js"

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]


function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)


  //Categorias de palavras
  const [pickedCategory, setPickedCategory] = useState("")

  //Palavras dentro de uma categoria
  const [pickedWord, setPickedWord] = useState("")

  //Array com letras de uma palavra 
  const [letters, setLetters] = useState([])

  //Letras corretas da palavra
  const [guessedLetters, setGuessedLetters] = useState([])

  //Letras que nao pertencem a palavra
  const [wrongLetters, setWrongLetters] = useState([])

  //Numero de tentativas
  const [guesses, setGuesses] = useState(3)

  //Pontos na tela
  const [score, setScore] = useState(0)




  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = 
    categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const word = 
    words[category][Math.floor(Math.random()*words[category].length)]

    return{category, word}

  },[words])

  //Starts the game
  const startGame = useCallback(() => {

    //Clear all letters
    clearLetterStates()
    
    //pick word and pick category
    const {category, word} = pickWordAndCategory()

    //Create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    //Fill states
    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)
    
    setGameStage(stages[1].name)
  },[pickWordAndCategory])

  //Process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return 
    }

    if(letters.includes(normalizedLetter)){

      setGuessedLetters((actualGuessLetters) => [
        ...actualGuessLetters, normalizedLetter
      ])

    }else{

      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)

    }

  }

    //Restarts the game
    const retry = () => {

      setScore(0)
      setGuesses(3)
  
      setGameStage(stages[0].name)
    }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }


  //Check if guesses ended
  useEffect(() => {

    if(guesses === 0){

      clearLetterStates()

      setGameStage(stages[2].name)

    }

  }, [guesses])


  //Check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length){
      
      setScore((actualScore) => (actualScore += 100))

      startGame()
    }

  }, [guessedLetters, letters, startGame])



  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver 
      retry={retry}
      score={score}
      />}
    </div>
  );
  
}

export default App;
