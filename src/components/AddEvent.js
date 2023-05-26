import { useCallback, useState } from 'react';
// import Modal from 'react-modal';
import './addEvent.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '5px solid black',
    background: 'light-gray',
    width: '50%'
  },
};

function AddEvent(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // let subtitle;
  console.log('Add event', props);
  // const afterOpenModal = useCallback(() => {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }, [])

  const updateInput = (e, field) => {
    // console.log(e.target.value)
    switch (field) {
      case 'name':
        setName(e.target.value);
        break;
      case 'description':
        setDescription(e.target.value);
        break;
      default:
        return 'foo';
    }
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, description })
  }


  return (
    // <Modal
    //   isOpen={props.displayAddEvent}
    //   // onAfterOpen={afterOpenModal}
    //   onRequestClose={() => props.setDisplayAddEvent(false)}
    //   style={customStyles}
    //   ariaHideApp={false}
    //   contentLabel="Example Modal"
    // >
    //   <div id="addClass">
    //     <div className='flex'>
    //       <h2>Add A Class</h2>
    //       <div></div>
    //       <button className='closeButton spaceBetween' onClick={() => props.setDisplayAddEvent(false)}>close</button>`
    //     </div>
    //     <form className='flex flexCol' onSubmit={handleSubmit}>
    //       <label>
    //         Class Name:
    //         <input
    //           // value={name}
    //           onChange={(e) => updateInput(e, 'name')}
    //           type="text"
    //           name="name" />
    //       </label>

    //       <label>
    //         Class Description:
    //         <input
    //           // value={description}
    //           onChange={(e) => updateInput(e, 'description')}
    //           type="text"
    //           name="description" />
    //       </label>

    //       <DropdownButton id="dropdown-basic-button" title="Dropdown button">
    //         <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
    //         <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
    //         <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    //       </DropdownButton>
    //       <button className="button">Submit</button>
    //     </form>
    //   </div>
    // </Modal>
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header onHide={() => props.setDisplayAddEvent(false)} closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => props.setDisplayAddEvent(false)} variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  )
}

export default AddEvent;