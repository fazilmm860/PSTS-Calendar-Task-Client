import React, { useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const TimeSelect=[
{
  value:'09:00AM'
},
{
  value:'10:00AM'
},
{
  value:'11:00AM'
},
{
  value:'12:00PM'
},
{
  value:'01:00PM'
},
{
  value:'02:00PM'
},
{
  value:'03:00PM'
},
{
  value:'04:00PM'
},
{
  value:'05:00PM'
},

]
const TaskScheduler = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateEvent, setSelectedDateEvent] = useState(null); // New state to track selected date

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    slot: '',
    endTime:'',
    recruiterName: ''
  })
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible)
  }
  const handleDateClick = (arg) => {
    setSelectedTime(arg.dateStr);
    setModalOpen(true);
  }
  const handleRecruiterChange = (e) => {
    setFormData({
      ...formData,
      recruiterName: e.target.value
    })
  }
  const handleDatesSet = (arg) => {
    const { start, end } = arg;
    const view = arg.view;

    if (view.type === 'dayGridMonth') {
      const allDates = [];
      let current = start;
      while (current <= end) {
        allDates.push(current);
        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }

      const fridays = allDates.filter(date => date.getDay() === 5); // Friday is index 5

      const holidays = fridays.map(date => ({
        title: 'Holiday',
        start: date,
        allDay: true,
        backgroundColor: 'red', // You can set a different color for holidays
      }));

      // Set the events in the calendar
      arg.view.calendar.removeAllEvents(); // Remove existing events
      arg.view.calendar.addEventSource(holidays); // Add holidays

      // Rerender the calendar
      arg.view.calendar.refetchEvents();
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const { name, mobile, email, slot, recruiterName,endTime} = formData;

    const requestBody = {
      recruiter: recruiterName,
      date: selectedTime,
      startTime: slot,
      endTime: endTime, // Calculate end time
      name,
      mobile,
      email
    };
    
    axios.post('http://localhost:4001/api/book', requestBody)
      .then(response => {
        console.log('Booking successful:', response.data);
        // Handle success, e.g., show a success message to the user

         // Show success message using Toastify
      toast.success('Your slot is allocated. Please check the schedule page for a confirmation.', {
        position: "top-center",
        autoClose: 8000, // Adjust the duration as needed
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
       
        // Close the modal
        setModalOpen(false);
      })
      .catch(error => {
        console.error('Error booking:', error);
        // Handle error, e.g., show an error message to the user

         // Show error message using Toastify
      toast.error('Error booking. Please try again. Check the Schedule', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      });
  

    
    console.log(formData)
  }
  
  
  

  return (
    <div className="task-app" style={{ display: 'flex',  justifyContent: 'center', alignItems: 'center',marginTop: '20px' }}>
         <Box sx={{ width: '80%', p: 4, borderRadius: 4, boxShadow: 3  }}>
      <div className='task-app-sidebar'>
        <div className='task-app-sidebar-section'>
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be getting form to schedule the Interview</li>
            <li>Please check the Schedule page and find the free slot</li>
            <li>Friday is Holiday </li>
          </ul>
        </div>
        <div className='task-app-sidebar-section'>
        <FormControlLabel
            control={
              <Switch
                checked={weekendsVisible}
                onChange={handleWeekendsToggle}
                color='primary'
              />
            }
            label='Toggle weekends'
          />
        </div>
        <div className='task-app-sidebar-section'>
          <h2>All Events </h2>
          <ul>
            
          </ul>
        </div>
      </div>
      <div className='task-app-main'>
        <FullCalendar
          
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          datesSet={handleDatesSet}
          select={(info) => {
            // When a date is selected, set the selectedTime and open the modal
            setSelectedTime(info.startStr)
            setModalOpen(true)
          }}
        />
        <ToastContainer />
      </div>
      {/* Modal for entering form data */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby='form-modal'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#333', 
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}
        >
        <h2 id="form-modal" style={{ color: '#fff' }}>Enter Details</h2>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              margin='normal'
              label='Name'
              variant='outlined'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#444', 
                '& input': {
                  color: '#fff', 
                },
              }}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Mobile'
              variant='outlined'
              name='mobile'
              value={formData.mobile}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#444', 
                '& input': {
                  color: '#fff', 
                },
              }}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Email'
              variant='outlined'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#444', 
                '& input': {
                  color: '#fff', 
                },
              }}
            />
            <Select
              fullWidth
              margin='normal'
              label='Slot'
              variant='outlined'
              name='slot'
              value={formData.slot}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#444', 
                '& input': {
                  color: '#fff', 
                },
              }}
              >
              {TimeSelect.map((item)=>(
              <MenuItem value={item.value}>{item.value}</MenuItem>
               
              ))}
              </Select>
            
           
             <Select
              fullWidth
              margin='normal'
              label='End Time'
              variant='outlined'
              name='endTime'
              value={formData.endTime}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#444', 
                '& input': {
                  color: '#fff', 
                },
              }}
              >
                 {TimeSelect.map((item)=>(
              <MenuItem value={item.value}>{item.value}</MenuItem>
               
              ))}
              </Select>
              
            
            <Select
              fullWidth
              margin='normal'
              label='Recruiter Name'
              variant='outlined'
              name='recruiterName'
              value={formData.recruiterName}
              onChange={handleRecruiterChange}
              required
              sx={{
                backgroundColor: '#444', 
                '& input': {
                  color: '#fff', 
                },
              }}
            >
              <MenuItem value='Robert'>Robert</MenuItem>
              <MenuItem value='Dony'>Dony</MenuItem>
              <MenuItem value='Xavier'>Xavier</MenuItem>
              <MenuItem value='Muthuvel Pandien'>Muthuvel Pandien</MenuItem>
              <MenuItem value='Mark Antony'>Mark Antony</MenuItem>
            </Select>
            <Button type='submit' style={{marginTop: '1em', backgroundColor:'yellow' ,color:'black' }} variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      </Box>
    </div>
  )
}

export default TaskScheduler
