import config from '../../../config/debug';

const debugLog = (message, events) => {
    const event = events.find(e=>e.id===config.eventId);
    if(event) console.log(message, event);
}

export default debugLog;