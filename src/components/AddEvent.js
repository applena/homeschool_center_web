import { useCallback, useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '5px solid red'
  },
};

function AddEvent(props) {
  console.log('Add event', props);
  // const afterOpenModal = useCallback(() => {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }, [])


  return (
    <Modal
      isOpen={props.displayAddEvent}
      // onAfterOpen={afterOpenModal}
      // onRequestClose={() => props.setDisplayAddEvent(false)}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Example Modal"
    >
      <h2>Hello</h2>
      <button onClick={() => props.setDisplayAddEvent(false)}>close</button>
      <div>I am a modal</div>
      <form>
        <input />
        <button>tab navigation</button>
        <button>stays</button>
        <button>inside</button>
        <button>the modal</button>
      </form>
    </Modal>
  )
}

export default AddEvent;