import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, FormControl, InputLabel, Select, MenuItem, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      background: {
        default: '#121212',
        paper: '#333333', 
      },
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: '#555',
            },
          },
        },
      },
    },
  });
  
  const TagsTable = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('popular');
    const [sortOrder, setSortOrder] = useState('desc');
  
    useEffect(() => {
      const fetchTags = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await axios.get(`https://api.stackexchange.com/2.2/tags?order=${sortOrder}&sort=${sortField}&site=stackoverflow&page=${page + 1}&pagesize=${rowsPerPage}`);
          setTags(data.items || []);
        } catch (error) {
          console.error('Failed to fetch tags:', error);
          setError('Failed to load tags. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchTags();
    }, [page, rowsPerPage, sortField, sortOrder]);
  
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && (
            <>
              <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2, bgcolor: 'background.paper' }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Sort Field</InputLabel>
                  <Select
                    value={sortField}
                    label="Sort Field"
                    onChange={(e) => setSortField(e.target.value)}
                  >
                    <MenuItem value="popular">Popular</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                  </Select>
                </FormControl>
  
                <FormControl fullWidth margin="normal">
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Sort Order"
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <MenuItem value="desc">Descending</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
              <TablePagination
                component="div"
                count={-1} 
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                sx={{ bgcolor: 'background.paper' }}
              />  
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tag</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.name}>
                        <TableCell>{tag.name}</TableCell>
                        <TableCell align="right">{tag.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </>
          )}
        </Container>
      </ThemeProvider>
    );
  };
  
  export default TagsTable;
