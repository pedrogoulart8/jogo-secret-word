#SECRET WORD GAME

##Projeto criado com as tecnologias: 
- React
- JavaScript
- CSS
- HTML

Etapas explicadas abaixo das imagens.

![secret1](https://user-images.githubusercontent.com/116767490/228953833-990c7da6-bb69-49cb-8f2c-9b2f2943cdc7.png)
![secret2](https://user-images.githubusercontent.com/116767490/228953840-15fe6b66-5b34-4396-a690-f16fddf16d0c.png)


###PARTE 1:

Criei 3 paginas diferentes (components) para 3 fases diferentes do jogo. Inicio, processo e fim.

Como ficou no app.js:

Primeiro criei um array para diferenciar os estagios do projeto.

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

Depois criei os Hooks (useState) que irão definir em qual estágio o jogo está.
O useState já se inicia com valor de "[0].name", que neste caso é igual a "start". 

const [gameStage, setGameStage] = useState(stages[0].name)



Depois criei funções para mudar esse state.
A ideia é mudar a tela depois que o usuario clicar no botão.

Funções:

  //Iniciando o jogo
  const startGame = () => {
    setGameStage(stages[1].name)
  }

  //Processando o input de letras
  const verifyLetter = () => {
    setGameStage(stages[2].name)
  }



Após isso, dentro de return, decidi reproduzir cada component em uma tela, que só será chamado depois que o usuario clicar no botão.

Exemplo:

Exemplo: 
O gameStage já se inicia com valor [0].name que é igual a "start". Nesse caso a tela inicial ser o component "startScreen"

Caso o usuario clique no botão "iniciar jogo", será chamada uma função que irá modificar o "setGameStage" para "[1].name" que é igual a "game". 
Assim que modificado o gameStage, irá se reproduzir na tela o component "Game" que está atrelado ao "[1].name" do array "Stages"

E por ai vai


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} />}
      {gameStage === 'end' && <GameOver retry={retry}/>}
    </div>
  );

////////////////////

###PART 2:

Criada a função "pickWordAndCategory" que insere as chaves do objeto "words" dentro da const "categories"

E para pegar um desses indices, dentro das chaves, de forma aleatoria, utilizamos o Math.random. 
A ideia aqui é devolver um dos indices desse array para a const "category" quando forem chamadas pela função.
Então quando for chamado, devolverá o valores de forma aleatoria:
carro 
ruta 
corpo
...


Dentro dessa função também teremos a const "word".
Utilizamos o Math.random para devolver, de forma aleatoria, os elementos que estão dentro dos indices citados acima.
Ex: 
carro devolverá: motor, porta, capô..
Fruta devolverá: banana, maça, pêra..
Corpo devolverá: braço, perna, cerebro..


const pickWordAndCategory = () => {
   const categories = Object.keys(words)
   const gategory = categories[Math.floor(Math.random()*Object.keys(categories).lenght)]
	
   const word = words[category][Math.floor(Math.random()*words[category].lenght)]	

 }


Esta função será chamada no inicio do jogo, dentro da função ja existente "StartGame".
Será chamado tambem uma função para destrinchar a palavra random, que está dentro de "word", em letras separadas.

  //Starts the game
  const startGame = () => {
    
    //pick word and pick category
    const {word, category} = pickWordAndCategory()

    //Create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    //Fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    
    setGameStage(stages[1].name)
  }

////////////////////

###PART 3:

Criados diversos hooks, que serão responsaveis pela dinamica do jogo.

Ex:

Onde ficará registrada a pontuação: 
APP.JS: const [score, setScore] = useState(0)
GAME.JS: <span>Pontuação: {score}</span>


Onde ficará registrado o numero de tentativas:
APP.JS: const [guesses, setGuesses] = useState(3)
GAME.JS: <p>Você ainda tem {guesses} tentativa(s).</p>

ETC..


Criado tambem um "onSubmit" no formulário, onde assim que o usuario inserir uma letra e clicar no botao, tenhamos os seguintes comportamentos:

Primeiro previnir a ação de atualizar a pagina (padrão)

Depois manter a letra sempre em minusculo e realizar uma validação se a letra ja foi utilizada

Também realizamos as seguintes validações:

Os arrays "guessedLetters" e "wrongLetters" começam vazio.
Se dentro dos arrays estiverem letras já escolhidas pelo usuario, retornar operação.

Se a letra escolhida pelo usuario estiver dentro do array de letras divididas "letters", então deve-se incluir no array "setGuessedLetters". Primeiro chama todo o array e depois soma aquele novo valor.

Caso a letra escolhida pelo usuario nao esteja dentro do array "letters", incluir no array de letras erradas "setWrongLetters" e ainda diminuir um valor do "guesses", que é o numero de tentativas do usuario.




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



Após isso, o campo de input deve ser limpo e adicionado o focus no local para que seja inserido uma nova letra.


  const handleSubmit = (e) => {
    e.preventDefault()

    verifyLetter(letter)

    setLetter("")

    letterInputRef.current.focus()

  }




##PART 4:

Criando a tela de vitoria:

Criado um useEffect onde utilizamos uma função para criar um array com letras unicas, onde nao se repete letras.

Depois inseri a seguinte condição:
Se o numero de letras corretas existentes (guessedWords) for igual ao numero de letras unicas que o usuario acertou, adiciona-se 100 pontos e começa uma nova palavra.

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length){
      
      setScore((actualScore) => (actualScore += 100))

      startGame()
    }

  }, [guessedLetters, letters, startGame])


Também utilizamos o useEffect para reproduzir na tela o component de GameOver caso o usuario não acerte em 3 tentativas

const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {

    if(guesses <= 0){

      clearLetterStates()

      setGameStage(stages[2].name)

    }

  }, [guesses])
