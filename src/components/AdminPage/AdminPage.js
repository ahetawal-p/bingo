import React, { useEffect } from 'react';
import LaunchScreen from "../LaunchScreen";
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
  const theme = useTheme();
  const { allBoards, loading, error } = hekaBackend.getAdminBoards(false)

  const addNewEntry = async (newData) => {
    const inValids = [];
    const titleValue = newData.title
    if (!titleValue || 0 === titleValue.length || !titleValue.trim()) {
      inValids.push("Title is required")
    }
    const boardItems = newData.items
    let cleanItems = []
    if (!boardItems || 0 === boardItems.length || !boardItems.trim()) {
      inValids.push("Items is required")
    } else {
      const allRawItems = boardItems.split("\n")
      cleanItems = allRawItems.filter(eachItem => {
        if (0 === eachItem.length || !eachItem.trim()) {
          return false
        }
        return true
      })
      if (cleanItems.length !== 16) {
        inValids.push("Not all board items configured == 16")
      }
    }
    if (inValids.length > 0) {
      alert('Invalid fields: \n' + inValids.join('\n'));
      throw new Error('Invalid fields');
    }
    const toBeSavedBoard = {
      title: newData.title,
      items: cleanItems,
      isActive: newData.isActive
    }
    const newDoc = await hekaBackend.saveAdminBoard(toBeSavedBoard)
    return newDoc
  }

  const editEntry = async (newData, oldData) => {
    const oldIsActive = oldData.isActive
    const newIsActive = newData.isActive
    if ((oldIsActive !== newIsActive
      && oldData.title === newData.title
      && oldData.items === newData.items) || !oldData.winnerId) {
      const allRawItems = newData.items.split("\n")
      const result = await hekaBackend.updateAdminBoardActiveStatus(newData.id,
        newData.isActive,
        allRawItems)
      return result
    } else {
      alert("Only isActive status can be updated at this time")
      throw new Error("Invalid actions")
    }
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
            tableLayout: 'fixed',
            paging: false,
            search: false,
            addRowPosition: 'first',
            headerStyle: {
              padding: 10,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              backgroundColor: `${theme.palette.primary.main}`,
              color: '#fff'
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