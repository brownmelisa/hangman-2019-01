defmodule Hangman.Game do
  def max_lives do
    6
  end

  def new do
    %{
      word: next_word(),
      guesses: [],
      lives: max_lives(),
    }
  end

  def client_view(game) do
    ws = String.graphemes(game.word)
    gs = game.guesses

    %{
      skel: skeleton(ws, gs),
      goods: Enum.filter(gs, &(Enum.member?(ws, &1))),
      bads:  Enum.filter(gs, &(!Enum.member?(ws, &1))),
      max_lives: max_lives(),
    }
  end

  def guess(game, letter) do
    if letter == "z" do
      raise "That's not a real letter"
    end

    gs = game.guesses
    |> MapSet.new()
    |> MapSet.put(letter)
    |> MapSet.to_list

    ws = String.graphemes(game.word)
    bads = Enum.filter(gs, &(!Enum.member?(ws, &1)))

    lives = max_lives() - length(bads)

    game
    |> Map.put(:guesses, gs)
    |> Map.put(:lives, lives)
  end

  def skeleton(word, guesses) do
    Enum.map word, fn cc ->
      if Enum.member?(guesses, cc) do
        cc
      else
        "_"
      end
    end
  end

  def next_word do
    words = ~w{
      horse snake jazz violin
      muffin cookie pizza sandwich
      house train clock
      parsnip marshmallow
    }
    Enum.random(words)
  end
end
