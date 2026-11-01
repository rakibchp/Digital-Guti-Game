"use client";

import { useState } from "react";
import Link from "next/link";

type Player = "amber" | "green";
type Pieces = Partial<Record<string, Player>>;

const PLAYERS: Record<Player, { name: string }> = {
  amber: { name: "Player one" },
  green: { name: "Player two" },
};

const NODES = [
  "a1", "b1", "c1",
  "a2", "b2", "c2",
  "a3", "b3", "c3",
];

const LINES = [
  ["a1", "b1", "c1"],
  ["a2", "b2", "c2"],
  ["a3", "b3", "c3"],
  ["a1", "a2", "a3"],
  ["b1", "b2", "b3"],
  ["c1", "c2", "c3"],
  ["a1", "b2", "c3"],
  ["c1", "b2", "a3"],
];

const CONNECTIONS = [
  ["a1", "b1"], ["b1", "c1"],
  ["a2", "b2"], ["b2", "c2"],
  ["a3", "b3"], ["b3", "c3"],
  ["a1", "a2"], ["a2", "a3"],
  ["b1", "b2"], ["b2", "b3"],
  ["c1", "c2"], ["c2", "c3"],
  ["a1", "b2"], ["b2", "c3"],
  ["c1", "b2"], ["b2", "a3"],
];

function otherPlayer(player: Player): Player {
  return player === "amber" ? "green" : "amber";
}

function getLineWinner(pieces: Pieces): Player | null {
  for (const line of LINES) {
    const player = pieces[line[0]];
    if (player && line.every((node) => pieces[node] === player)) return player;
  }
  return null;
}

function getNeighbors(node: string): string[] {
  return CONNECTIONS.flatMap(([start, end]) =>
    start === node ? [end] : end === node ? [start] : [],
  );
}

function hasLegalMove(pieces: Pieces, player: Player): boolean {
  return Object.entries(pieces).some(
    ([node, owner]) =>
      owner === player && getNeighbors(node).some((neighbor) => !pieces[neighbor]),
  );
}

function getPieceCount(pieces: Pieces, player: Player): number {
  return Object.values(pieces).filter((owner) => owner === player).length;
}

export default function Home() {
  const [pieces, setPieces] = useState<Pieces>({});
  const [currentPlayer, setCurrentPlayer] = useState<Player>("amber");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const totalPieces = Object.keys(pieces).length;
  const isSliding = totalPieces === 6;
  const lineWinner = getLineWinner(pieces);
  const isTrapped = isSliding && !lineWinner && !hasLegalMove(pieces, currentPlayer);
  const winner = lineWinner ?? (isTrapped ? otherPlayer(currentPlayer) : null);
  const currentCount = getPieceCount(pieces, currentPlayer);

  function handleNodeClick(node: string) {
    if (winner) return;

    if (!isSliding) {
      if (pieces[node]) return;

      setPieces((current) => ({ ...current, [node]: currentPlayer }));
      setSelectedNode(null);
      setCurrentPlayer(otherPlayer(currentPlayer));
      return;
    }

    if (pieces[node] === currentPlayer) {
      setSelectedNode((selected) => (selected === node ? null : node));
      return;
    }

    if (
      selectedNode &&
      !pieces[node] &&
      getNeighbors(selectedNode).includes(node)
    ) {
      setPieces((current) => {
        const next = { ...current };
        delete next[selectedNode];
        next[node] = currentPlayer;
        return next;
      });
      setSelectedNode(null);
      setCurrentPlayer(otherPlayer(currentPlayer));
    }
  }

  function resetGame() {
    setPieces({});
    setCurrentPlayer("amber");
    setSelectedNode(null);
  }

  const status = winner
    ? isTrapped
      ? `${PLAYERS[winner].name} wins — the other player is trapped.`
      : `${PLAYERS[winner].name} wins — three in a row!`
    : isSliding
      ? selectedNode
        ? "Choose a connected empty point to move your bead."
        : `${PLAYERS[currentPlayer].name}, select a bead to move.`
      : `${PLAYERS[currentPlayer].name}, place bead ${currentCount + 1} of 3.`;

  return (
    <main className="game-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Guti home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>guti<span className="brand-period">.</span></span>
        </Link>
        <div className="topbar-note">
          <span className="live-dot" />
          A little piece of home
        </div>
        <a className="language-link" href="#how-to-play">
          গুটি খেলা <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="page-content">
        <section className="intro" aria-labelledby="page-title">
          <div className="eyebrow"><span>01</span> THE VILLAGE CLASSIC</div>
          <h1 id="page-title">A game of <em>gutis.</em></h1>
          <p>
            Three beads each. One simple board. A little patience goes a long way.
          </p>
        </section>

        <div className="game-layout">
          <section className="board-card" aria-label="Guti game board">
            <div className="board-card-header">
              <div>
                <span className="section-kicker">THE BOARD</span>
                <h2>Make your move</h2>
              </div>
              <span className="round-label">
                <span className="round-indicator" />
                {winner ? "ROUND COMPLETE" : isSliding ? "SLIDING PHASE" : "PLACING PHASE"}
              </span>
            </div>

            <div className="player-strip" aria-label="Player scores">
              {(["amber", "green"] as const).map((player) => (
                <div
                  className={`player-card player-card--${player}${!winner && currentPlayer === player ? " is-active" : ""}`}
                  key={player}
                >
                  <span className="player-avatar" aria-hidden="true">
                    <span />
                  </span>
                  <span className="player-details">
                    <span className="player-name">{PLAYERS[player].name}</span>
                    <span className="player-subtitle">
                      {currentPlayer === player && !winner ? "Your turn" : player === "amber" ? "Amber gutis" : "Leaf gutis"}
                    </span>
                  </span>
                  <span className="piece-count" aria-label={`${getPieceCount(pieces, player)} of 3 beads placed`}>
                    {getPieceCount(pieces, player)}<span>/3</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="turn-banner" aria-live="polite">
              <span className={`turn-icon turn-icon--${winner ?? currentPlayer}`} aria-hidden="true">
                <span />
              </span>
              <span>{status}</span>
            </div>

            <div className="board-wrap">
              <div className="board">
                <svg className="board-lines" viewBox="0 0 300 300" aria-hidden="true">
                  {CONNECTIONS.map(([start, end]) => {
                    const startX = (NODES.indexOf(start) % 3) * 120 + 30;
                    const startY = Math.floor(NODES.indexOf(start) / 3) * 120 + 30;
                    const endX = (NODES.indexOf(end) % 3) * 120 + 30;
                    const endY = Math.floor(NODES.indexOf(end) / 3) * 120 + 30;
                    return (
                      <line
                        key={`${start}-${end}`}
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                      />
                    );
                  })}
                </svg>
                {NODES.map((node, index) => {
                  const player = pieces[node];
                  const isSelected = selectedNode === node;
                  const isSelectable = isSliding && player === currentPlayer && !winner;
                  return (
                    <button
                      aria-label={`${node}, ${player ? `${PLAYERS[player].name}'s bead` : "empty"}${isSelected ? ", selected" : ""}`}
                      aria-pressed={isSelected}
                      className={`board-node${player ? ` board-node--${player}` : ""}${isSelected ? " is-selected" : ""}${isSelectable ? " is-selectable" : ""}`}
                      key={node}
                      onClick={() => handleNodeClick(node)}
                      style={{
                        left: `${(index % 3) * 40 + 10}%`,
                        top: `${Math.floor(index / 3) * 40 + 10}%`,
                      }}
                      type="button"
                    >
                      {player && <span className="bead" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="board-footer">
              <span><span className="footer-spark" aria-hidden="true">✳</span> Take your time. Think ahead.</span>
              <button className="reset-button" onClick={resetGame} type="button">
                <span aria-hidden="true">↻</span> New game
              </button>
            </div>
          </section>

          <aside className="side-column">
            <section className="how-card" id="how-to-play">
              <div className="side-card-heading">
                <span className="section-kicker">THE RULES</span>
                <span className="rule-spark" aria-hidden="true">✳</span>
              </div>
              <h2>Easy to learn.<br /><em>Hard to leave.</em></h2>

              <ol className="rule-list">
                <li>
                  <span className="rule-number">01</span>
                  <span><strong>Place your gutis</strong><small>Take turns placing 3 beads each on any open point.</small></span>
                </li>
                <li>
                  <span className="rule-number">02</span>
                  <span><strong>Slide along a line</strong><small>Once all 6 are down, move one bead to a connected empty point.</small></span>
                </li>
                <li>
                  <span className="rule-number">03</span>
                  <span><strong>Make three in a row</strong><small>Line up your beads across a row, column, or diagonal to win.</small></span>
                </li>
              </ol>

              <div className="tradition-note">
                <span className="tradition-icon" aria-hidden="true">গু</span>
                <p>A beloved village game, played with pebbles, seeds, or whatever was close at hand.</p>
              </div>
            </section>

            <section className="tip-card">
              <span className="tip-icon" aria-hidden="true">↗</span>
              <p><strong>A friendly tip</strong>Every line is a path. Block your opponent before they block you.</p>
            </section>
          </aside>
        </div>

        <footer className="page-footer">
          <span>MADE FOR TWO, BEST PLAYED TOGETHER</span>
          <span>গুটি খেলা <span className="footer-dot">·</span> A game from Bangladesh</span>
        </footer>
      </div>
    </main>
  );
}
