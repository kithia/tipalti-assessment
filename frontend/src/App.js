import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Typography from '@mui/material/Typography';

/**
 * Functional component for the expenses list
 * @returns JSX Representation of the component
 */
export default function App() {
  // Functional states
  const [expenses, setExpenses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Page title
  document.title = "Expenses | Tipalti"

  // Styling
  const centreBoxStyle = { 
    display: 'flex',
    justifyContent: 'center'
  }

  const tableEntryStyle = { 
    textTransform: 'capitalize'
  }

  // Executes on load and everytime any dependacy changes
  useEffect(() => {
    // Fetches the card details from the Tipalti API
    const loadExpenses = async () => {
      fetch("https://expenses-backend-mu.vercel.app/expenses", {
        headers: {
        "Content-Type": "application/json",
        Username: "Obed.Ngigi"
        }})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setExpenses(data);
            setIsLoading(false);
        })
        .catch((error) => {
            console.log(error);
            document.title = "An error occured"
            setIsLoading(false);
            setIsError(true);
        })
    }

    loadExpenses();

}, [setExpenses, setIsLoading, setIsError]);

  /**
   * Takes a JS Data ovject and returns
   * the MMM-DD representation
   */
  function getFormattedDate(date) {
    const dateObject = new Date(date);
    const options = { day: '2-digit', month: 'short' };

    /**
     * en-US local is required, as en-GB locale displays
     * DD-MMM
     */
    return dateObject.toLocaleString('en-US', options);
  }

  return (
    <Container component="main" sx={{ my: 8 }} maxWidth="md">
        {/** 
         * Loading circle upon component load
         */}
        {isLoading ? <Box sx={centreBoxStyle}>
            <CircularProgress className='mx-auto' />
        </Box> : <></>}

         {/** 
          * Error message upon API error response
          * 
          * Currently it assumes a 404 error.
          * If I had more time, I would identify the error
          * status, and give a more appropriate, specific 
          * error message to the user.
          */}
        {isError ? <Box sx={centreBoxStyle}>
            <Typography variant="h2" gutterBottom>
                An error has occured, please refresh the page.
            </Typography>
        </Box> : <></>}

        {/**
         * Expenses table
         * 
         * If I had more time, I would align the text to the left.
         */}
        {expenses ? <div>
            <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
              Expenses
            </Typography>

            <hr/>
            {/**
             * Adapted from 
             * https://mui.com/material-ui/react-table/
             */}
            <TableContainer>
              <Table aria-label="simple table" sx={{ textAlign: 'left' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Merchant</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Description</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow
                      key={expense.id}
                    >
                      <TableCell component="th" scope="row">
                        {getFormattedDate(expense.date)}
                      </TableCell>
                      <TableCell align="right">{expense.merchant}</TableCell>
                      <TableCell align="right">{`$${expense.amount}`}</TableCell>
                      <TableCell align="right" sx={tableEntryStyle}>{expense.category}</TableCell>
                      <TableCell align="right">{expense.description}</TableCell>
                      <TableCell align="right" sx={tableEntryStyle}>{expense.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </div> : <></>}
    </Container>
  );
}
