import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function hangman_init(root, channel) {
  ReactDOM.render(<Hangman channel={channel} />, root);
}

/*
   Hangman:

    - Secret word
    - Player guesses letters in word
    - Correct guess: Show letter at position in word.
    - Wrong guess: Lose a life.
    - You lose if no more lives.

   Application state for hangman:

   {
      word: String                   // The hidden word
      guesses: Array of Characters   // Letters guessed so
      lives: Number                  // Lives left
   }
 */

let MAX_LIVES = 6;

class Hangman extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = {
      word: "jazz",
      guesses: [],
      lives: MAX_LIVES,
    }

    this.channel.join()
        .receive("ok", resp => { console.log("Joined successfully", resp); })
        .receive("error", resp => { console.log("Unable to join", resp); });
  }

  got_input(ev) {
    let letters = this.state.word.split('');
    let guesses = ev.target.value.split('');

    let wrong_guesses = 0;
    _.each(guesses, (guess) => {
      if (!letters.includes(guess)) {
        wrong_guesses += 1;
      }
    });

    let lives = MAX_LIVES - wrong_guesses;

    this.setState(_.assign(
      {},
      this.state,
      { lives, guesses },
    ));
  }

  render() {
    return <div>
      <div className="row">
        <div className="column">
          <Word letters={this.state.word.split('')}
                guesses={this.state.guesses} />
        </div>
        <div className="column">
          <Lives left={this.state.lives} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guesses guesses={this.state.guesses} />
        </div>
        <div className="column">
          <GuessInput guesses={this.state.guesses}
                      on_change={this.got_input.bind(this)} />
        </div>
      </div>
    </div>;
  }
}

function Word(props) {
  let {letters, guesses} = props;

  let skel = _.map(letters, (ll) => {
    if (guesses.includes(ll)) {
      return ll;
    }
    else {
      return "_";
    }
  });

  return <p>{skel.join(' ')}</p>;
}

function Lives(props) {
  let {left} = props;
  return <p>Lives left: {left} / {MAX_LIVES}</p>;
}

function Guesses({guesses}) {
  return <p>{guesses.sort().join(' ')}</p>;
}

function GuessInput(props) {
  let {guesses, on_change} = props;
  return <p>
    <input type="text" value={guesses.join('')} onChange={on_change} />
  </p>;
}

