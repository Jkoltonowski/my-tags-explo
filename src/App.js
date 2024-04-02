import React from 'react';
import Container from '@mui/material/Container';
import TagsTable from './components/TagsTable';

function App() {
  return (
    <Container maxWidth="md">
      <h1>StackOverflow Tags Explorer</h1>
      <TagsTable />
    </Container>
  );
}

export default App;
