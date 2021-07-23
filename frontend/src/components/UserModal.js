import React from 'react'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';

export default function UserModal({open, setOpen,  handleClose, person}) { 
 
    return  (
        
          
     <div>
     <Modal
       aria-labelledby="transition-modal-title"
       aria-describedby="transition-modal-description"
       open={open}
       onClose={handleClose}
       closeAfterTransition
       BackdropComponent={Backdrop}
       BackdropProps={{
         timeout: 500,
       }}
     >
       <Fade in={open}>
       <div className="Modal-container">
                <div className="Modal">
                <div alt={person.firstName} className="Modal-img" style={{backgroundImage: `url(http://localhost:5000/${person.path})`, backgroundSize: 'cover'}}></div> 
                <h3  className="Modal-name-age">{person.firstName}, {person.age}</h3> 
                <div className="Modal-desc">
                <TextField id="outlined-full-width" label="Description" multiline rows={4} variant="outlined" value={person.description}></TextField>
                </div>
                </div>
                <div className="Background"></div>
                </div>
       </Fade>
     </Modal>
   </div>
       
      
    )
};

