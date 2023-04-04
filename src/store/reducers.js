// portfolio reducers

let initialState = {
  portfolio: [
    { name: '', subject: '', link: '', date: Date.now() }
  ],
  studentInfo: {
    name: '', grade: 0
  }
};

// actions
export const addItem = (item) => {
  return {
    type: 'ADDITEM',
    payload: item
  }
}

export const updateStudentInfo = (studentInfo) => {
  return {
    type: 'UPDATESTUDENTINFO',
    payload: studentInfo
  }
}

export const reset = () => {
  return {
    type: 'RESET'
  }
}

// export a function that has two parameters, state and action
// action has both type and payload in it
// switch statement to determijne what the type is
// the default return is state

const reduxActions = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case 'ADDITEM':
      // adds an item to portfolio
      let portfolio = state.portfolio;
      portfolio.push(payload);

      return { ...state, portfolio };

    case 'UPDATESTUDENTINFO':
      let studentInfo = state.studentInfo;
      studentInfo = payload;
      return { ...state, studentInfo }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export default reduxActions;