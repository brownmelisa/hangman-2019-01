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

   Application state for hangman: (lives on server)

   {
      word: String                   // The hidden word
      guesses: Array of Characters   // Letters guessed so
      lives: Number                  // Lives left
   }

   Client view for Hangman: (visible in JS code)

   {
      skel: The letters in the word as displayed, including unknown letters.
      goods: List of correct guesses
      bads: List of incorrect guesses
      max_lives: Starting value for lives
   }
 */

class Hangman extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = {
      skel: [],
      goods: [],
      bads: [],
      max_lives: 6,
    }

    this.channel.join()
        .receive("ok", resp => {
          console.log("Joined successfully", resp);
          this.setState(resp.game);
        })
        .receive("error", resp => { console.log("Unable to join", resp); });
  }

  got_input(ev) {
    let letter = ev.target.value.substr(-1);
    this.channel.push("guess", { letter: letter })
        .receive("ok", (resp) => { this.setState(resp.game); });
  }

  guesses() {
    return this.state.bads.concat(this.state.goods);
  }

  render() {
    return <div>
      <div className="row">
        <div className="column">
          <Word skeleton={this.state.skel} />
        </div>
        <div className="column">
          <Lives left={this.state.max_lives - this.state.bads.length}
                 max={this.state.max_lives} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guesses guesses={this.guesses()} />
        </div>
        <div className="column">
          <GuessInput guesses={this.guesses()}
                      on_change={this.got_input.bind(this)} />
        </div>
      </div>
    </div>;
  }
}

function Word(props) {
  let {skeleton} = props;
  return <p>{skeleton.join(' ')}</p>;
}

function Lives(props) {
  let {left, max} = props;
  return <p>Lives left: {left} / {max}</p>;
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

