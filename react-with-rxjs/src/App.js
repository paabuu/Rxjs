import React, { Component } from 'react';
import observer from './observe';
import { BehaviorSubject, Subject, interval, empty, of } from 'rxjs';
import { scan, map, switchMap, merge, timeInterval } from 'rxjs/operators';

const Counter = ({ count, onIncrement, onDecrement }) => (
  <div>
    <p>{count}</p>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const StartWatch = ({ milliseconds, onStart, onStop, onReset }) => (
  <div>
    <h1>{ milliseconds }</h1>
    <button onClick={onStart}>Start</button>
    <button onClick={onStop}>Stop</button>
    <button onClick={onReset}>Reset</button>
  </div>
);

const ObserverComponent = observer(
  Counter, 
  () => {
    const counter = new BehaviorSubject(0);
    return counter.pipe(
      scan((result, inc) => result + inc, 0),
      map(value => ({
        count: value,
        onIncrement: () => counter.next(1),
        onDecrement: () => counter.next(-1)
      }))
    )
  },
  0
);

const StartWatchComponent = observer(
  StartWatch,
  (props, state) => {
    console.log(state)
    const button = new Subject();
    const times$ = button.pipe(
      switchMap((value) => {
        switch(value) {
          case 'start':
            return interval(10).pipe(
              timeInterval(),
              scan((acc, cur) => acc + cur.interval, state.milliseconds)
            );
          case 'stop':
              return empty();
          case 'reset':
              return of(0);
          default:
              return of(0)
        }
      })
    );

    const stopWatch = new BehaviorSubject(0);
    return stopWatch.pipe(
      merge(times$),
      map(v => ({
        milliseconds: v,
        onStart: () => button.next("start"),
        onStop: () => button.next("stop"),
        onReset: () => button.next("reset")
      }))
    )
  },
  0
);

class App extends Component {
  render() {
    return <StartWatchComponent />;
  }
}

export default App;
