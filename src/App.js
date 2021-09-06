import React, { useState, useEffect } from 'react';

import lottery from './lottery';
import web3 from './web3';

const App = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const test = async () => {
      const manager = await lottery.methods.manager().call();

      const players = await lottery.methods.getPlayers().call();

      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);

      setBalance(balance);
      setPlayers(players);
    };

    test();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });
  }

  async function onClick(e) {
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    console.log(' A winner has been picked!');
  }
  return (
    <div>
      <h1>Lottery Contract </h1>

      <p>
        This Contract is managed by {manager}. There are currently{' '}
        {players.length} people entered, competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>

      <hr />

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>

        <div>
          <label htmlFor='amount'>Amount of ether to enter</label>

          <input
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button>Enter</button>
      </form>

      <hr />
      <h4>
        Ready to pick a winner?
        <button onClick={onClick}>Pick a winner</button>
      </h4>
    </div>
  );
};

export default App;
