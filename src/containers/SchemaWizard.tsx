import React, { useState, useEffect, useContext } from 'react';
import log from 'electron-log';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import GenericTemplate from '../templates/GenericTemplate';
import NameForm from '../components/schema/NameForm';
import CSVImport from '../components/schema/CSVImport';
import StoreContext from '../store/StoreContext';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 800,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    alignItems: 'center',
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function SchemaWizard() {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [error, setError] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [snackOpen, setSnackOpen] = useState(false);
  const [{ schemaWizard: dataState }, dispatch] = useContext(StoreContext);

  useEffect(() => {
    dispatch({
      type: 'SCHEMA_WIZARD_CLEAN',
    });
    return () => {
      dispatch({
        type: 'SCHEMA_WIZARD_CLEAN',
      });
    };
  }, [dispatch]);

  const handleSnackClose = (event, reason) => {
    setSnackOpen(false);
    history.replace(`/table/${dataState.name}`);
  };

  const steps = [t('table name'), t('upload data')];
  const stepLabels = [t('next'), t('create table')];

  const stepActions = [
    () => {}, // 'Next'
    () => {
      // 'Create Table'
      log.info('dataState:', dataState);
      ipcRenderer
        .invoke('schema-post', {
          name: dataState.name,
          definition: dataState.definition,
          etc: {
            memo: dataState.memo,
          },
          docs: dataState.data,
        })
        .then((newSchema) => {
          log.info('schema-post:', newSchema);
          setSnackOpen(true);
          setError('');
        })
        .catch((e) => {
          setError(e.toString());
        });
    },
  ];

  const handleNext = () => {
    stepActions[activeStep]();
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <NameForm />;
      case 1:
        return <CSVImport />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <GenericTemplate title="Create Table" id="create-wizard">
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          {t('create table')}
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                {t('congratulations')}
              </Typography>
              <Typography variant="subtitle1">{t('create succeed')}</Typography>
            </>
          ) : (
            <>
              {getStepContent(activeStep)}
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button
                    disabled={dataState.error}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    {t('back')}
                  </Button>
                )}
                <Button
                  disabled={dataState.error}
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {stepLabels[activeStep]}
                </Button>
              </div>
            </>
          )}
        </>

        <Snackbar
          open={snackOpen}
          autoHideDuration={2000}
          onClose={handleSnackClose}
        >
          <Alert onClose={handleSnackClose} severity="success">
            {t('table created, redirect')}
          </Alert>
        </Snackbar>
      </Paper>
      <Typography color="error" variant="body1" gutterBottom>
        {error}
      </Typography>
    </GenericTemplate>
  );
}
export default SchemaWizard;
