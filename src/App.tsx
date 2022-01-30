import React, {useReducer, Reducer, useEffect, useRef} from 'react';
import './App.css';
import { Note, notesOrder } from './Enums/Note';
import { Scheduler } from './Utils/Scheduler';

enum Action {
  NextNote,
  TogglePause,
  ChangeNextNoteTime
}


type IAction = IChangeNoteAction | ITogglePauseAction | IChangeNextNoteTimeAction;

interface IChangeNoteAction {
  type: Action.NextNote;
}
interface IChangeNextNoteTimeAction {
  type: Action.ChangeNextNoteTime;
  payload: number;
}
interface ITogglePauseAction {
  type: Action.TogglePause;
}

interface IState {
  note: Note;
  isPaused: boolean;
  nextNoteTime: number;
}

function reducer(state: IState, action: IAction): IState {
  switch(action.type) {
    case Action.NextNote: {
      const currentNoteIndex: number = notesOrder.indexOf(state.note);
      let nextNoteIndex: number = Math.floor(Math.random() * notesOrder.length);
      while (nextNoteIndex === currentNoteIndex) {
        nextNoteIndex = Math.floor(Math.random() * notesOrder.length);
      }
      return {...state, note: notesOrder[nextNoteIndex]};
    }
    case Action.TogglePause: {
      return {...state, isPaused: !state.isPaused};
    }
    case Action.ChangeNextNoteTime: {
      return {...state, nextNoteTime: action.payload};
    }
  }
}


function App() {
  const scheduler: React.MutableRefObject<Scheduler | null> = useRef(null)
  const [state, dispatch] = useReducer<Reducer<IState,IAction> >(reducer, {note: Note.A, isPaused: false, nextNoteTime: 4000});

  useEffect(() => {
    scheduler.current = new Scheduler(state.nextNoteTime);
    const moveToNextNote = () => {
      dispatch({type: Action.NextNote})
    };
    scheduler.current.subscribe(moveToNextNote);
    return () => {
      scheduler.current?.unsubscribe(moveToNextNote);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scheduler.current !== null) {
    scheduler.current.notificationIntervalMs = state.nextNoteTime;
    }
  }, [state.nextNoteTime]);

  useEffect(() => {
    if (scheduler.current !== null) {
      if (state.isPaused !== scheduler.current.isStopped()) {
        scheduler.current.toggle()
      } 
    }
  }, [state.isPaused]);

  function toggle(): void {
    dispatch({type: Action.TogglePause })
  }

  function changeNextNoteTime(newTime: number): void {
    dispatch({type: Action.ChangeNextNoteTime, payload: newTime * 1000 })
  }

  return (
    <div className="App">
<div className='current-note'>
        <h1>{Note[state.note]}</h1></div>
        <div className='controls'>
          <button onClick={toggle} className={state.isPaused ? "playing" : "paused"}>{state.isPaused ? "Resume" : "Pause"}</button>
        </div>
        <div className='change-next-note-time'>
          <input type="number" value={state.nextNoteTime / 1000} onChange={e => changeNextNoteTime(parseInt(e.target.value, 10))} />
          </div>
    </div>
  );
}

export default App;