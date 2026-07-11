import { createContext, useContext, useReducer, useCallback } from 'react';

const WorkoutContext = createContext(null);

const initialState = {
  session: null,       // Current workout session from API
  template: null,      // Selected template
  logs: [],            // Exercise logs [{exercise_id, set_number, reps, weight, rpe}]
  exercises: [],       // Available exercises
  isActive: false,     // Is a workout in progress
};

function workoutReducer(state, action) {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        session: action.payload.session,
        template: action.payload.template,
        logs: [],
        isActive: true,
      };
    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };
    case 'REMOVE_LOG':
      return {
        ...state,
        logs: state.logs.filter((_, index) => index !== action.payload),
      };
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload };
    case 'COMPLETE_WORKOUT':
      return {
        ...state,
        session: action.payload,
        isActive: false,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const startWorkout = useCallback((session, template) => {
    dispatch({ type: 'START_WORKOUT', payload: { session, template } });
  }, []);

  const addLog = useCallback((log) => {
    dispatch({ type: 'ADD_LOG', payload: log });
  }, []);

  const removeLog = useCallback((index) => {
    dispatch({ type: 'REMOVE_LOG', payload: index });
  }, []);

  const setExercises = useCallback((exercises) => {
    dispatch({ type: 'SET_EXERCISES', payload: exercises });
  }, []);

  const completeWorkout = useCallback((session) => {
    dispatch({ type: 'COMPLETE_WORKOUT', payload: session });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        ...state,
        startWorkout,
        addLog,
        removeLog,
        setExercises,
        completeWorkout,
        reset,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
