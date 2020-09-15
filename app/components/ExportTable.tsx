import React, { useState, useEffect } from 'react';
import { ipcRenderer, shell } from 'electron';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GridOnIcon from '@material-ui/icons/GridOn';
import ListIcon from '@material-ui/icons/List';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function ExportTable({ table }) {
  const classes = useStyles();
  const [text, setText] = useState('');

  useEffect(() => {
    const exportCSVListener = (event, arg) => {
      console.log(arg);
      setText(arg);
    };
    ipcRenderer.on('export-csv', exportCSVListener);
    return () => {
      ipcRenderer.removeListener('export-csv', exportCSVListener);
    };
  }, []);
  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ListIcon />}
        onClick={() => ipcRenderer.send('export-csv', table)}
      >
        Export to CSV
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<GridOnIcon />}
        onClick={() => console.log('Export to Excel')}
      >
        Export to Excel
      </Button>
      <Typography variant="body1" gutterBottom>
        {text}
      </Typography>
    </div>
  );
}