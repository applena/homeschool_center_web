import React, { useState } from 'react';

function CollectStudentInfo(props) {
  const [studentName, setName] = useState('');
  const [grade, setGrade] = useState(0);

  const updateStudentInfo = (e) => {
    e.preventDefault();
    props.updateName(studentName);
    props.updateGrade(grade);
  }

  return (
    <div className="App">
      <form onSubmit={(e) => updateStudentInfo(e)}>
        <label>
          Student Name:
          <input
            value={studentName}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name" />
        </label>

        <label>
          Student Grade:
          <input
            onChange={(e) => setGrade(e.target.value)}
            type="text"
            value={grade}
            name="grade" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default CollectStudentInfo;
