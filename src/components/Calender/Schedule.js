import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import axios from 'axios';


const Schedule = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4001/api/getbooking') // Assuming this is the correct endpoint
          .then(response => {
            setBookings(response.data.bookings);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
   
    
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <TableContainer component={Box} sx={{ maxWidth: '80%' }}>
        <Table>
          <TableHead>
            <TableRow> 
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Start-Time</TableCell>
              <TableCell>End-Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {bookings.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.startTime}</TableCell>
                <TableCell>{row.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Schedule
