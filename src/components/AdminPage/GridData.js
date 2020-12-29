import { TextField } from "@material-ui/core";

const gridData = {}

export const editableFields = [
    'title',
    'items',
    'isActive'
];

export const readableFields = [
    'createdOn',
    'isWon',
    'winnerName',
    'wonAt',
    'modifiedOn'
];

gridData.sampleData = [
    {
        title: 'Get Moving',
        items: 'See this,Another,test,another',
        isActive: true,
        createdOn: new Date(),
        isWon: false,
        winnerName: "",
        modifiedOn: new Date()
    }
]


gridData.allColumns = [
    {
        title: 'Board Title',
        field: editableFields[0],
        cellStyle: {
            width: 250,
            minWidth: 250,
            padding: 8
        },
        headerStyle: {
            width: 250,
            minWidth: 250
        },
        editComponent: props => (
            <TextField
                fullWidth
                size="medium"
                variant="outlined"
                multiline
                rows={2}
                rowsMax={2}
                required
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        ),
        render: rowData => (
            <div style={{ width: '100%' }} >
                { rowData[editableFields[0]]}
            </div>
        )

    },
    {
        title: 'Items',
        field: editableFields[1],
        cellStyle: {
            width: 250,
            minWidth: 250,
            textAlign: 'center',
            padding: 8
        },
        headerStyle: {
            width: 250,
            minWidth: 250
        },
        editComponent: props => (
            <TextField
                fullWidth
                multiline
                rows={16}
                required
                placeholder="Add each option on a new line"
                rowsMax={16}
                variant="outlined"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />

        ),
        render: rowData => {
            const data = rowData[editableFields[1]]
            return (<div style={{ width: '100%', whiteSpace: 'pre-wrap', textAlign: 'left' }} >
                { data}
            </div >)
        }

    },
    {
        title: 'IsActive',
        field: editableFields[2],
        type: 'boolean'

    },
    {
        title: 'Create Date',
        field: readableFields[0], editable: 'never',
        type: 'datetime',
        defaultSort: 'desc',
        render: rowData => {
            return rowData && rowData[readableFields[0]] ? new Date(rowData[readableFields[0]] * 1000).toLocaleString() : ""
        }
    },
    {
        title: 'IsWon',
        field: readableFields[1], editable: 'never'

    },
    {
        title: 'Winner Name',
        field: readableFields[2], editable: 'never',

    },
    {
        title: 'Won At',
        field: readableFields[3], editable: 'never',
        type: 'datetime',
        render: rowData => {
            return rowData && rowData[readableFields[3]] ? new Date(rowData[readableFields[3]] * 1000).toLocaleString() : ""
        }

    },
    {
        title: 'Modified On',
        field: readableFields[4], editable: 'never',
        type: 'datetime',
        render: rowData => {
            return rowData && rowData[readableFields[4]] ? new Date(rowData[readableFields[4]] * 1000).toLocaleString() : ""
        }
    },
]

export default gridData