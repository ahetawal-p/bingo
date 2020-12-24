import React, { useState, useEffect } from 'react';
import LaunchScreen from "../LaunchScreen";
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import gridData from './GridData'
import tableIcons from './tableIcons'
import hekaBackend from '../../services/hekaBackend'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 8,
    flexDirection: 'column'
  }
}));


function AdminPage({ user, openSnackbar }) {
  const classes = useStyles();
  const { allBoards, loading, error } = hekaBackend.getAdminBoards(false)

  const addNewEntry = () => {

  }

  const editEntry = async () => {
    alert('Not implemented');
    throw new Error("not ")
  }

  useEffect(() => {
    if (error) {
      openSnackbar(error)
    }
  }, [error, openSnackbar]);

  return (
    <div className={classes.root}>
      {loading && <LaunchScreen />}
      {!loading && (
        <MaterialTable
          icons={tableIcons}
          title="All Boards"
          columns={gridData.allColumns}
          style={{ marginBottom: 10 }}
          data={allBoards}
          options={{
            paging: false,
            search: false,
            addRowPosition: 'first',
            headerStyle: {
              padding: 10,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              backgroundColor: '#039be5'
            }

          }}
          editable={{
            onRowAdd: addNewEntry,
            onRowUpdate: editEntry
          }}
        />
      )}
    </div>

  );
}

export default AdminPage;