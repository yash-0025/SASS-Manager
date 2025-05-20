import React, { useState } from 'react'
import {Card, CardContent, Button} from '@mui/material'
import {Link, useNavigate} from 'react-router-dom'
import api from '../../utils/api/axios'


const Datatable = ({tableField, tableData, fetchData, title, Rpage}) => {
    const [data, setData] = useState(tableData)
    const navigate = useNavigate()
    

    const handleDelete = (id) => {
        if(title == 'Service') {
            api.delete(`/api/deleteservice/${id}`).then(res => {
                if(res.status === 500) {
                    console.log("Not Deleted")
                }
            else {
                console.log(`${id} Deleted successfully`)
                
                fetchData()
            }
        }).catch(err => {
            console.log(err.message)
        })
    } else if(title === 'User') {
        api.delete(`api/deleteuser/${id}`).then(res => {
            if(res.status === 500) {
                console.log('Failed to delete')
            } else {
                console.log(res)
                fetchData()
            }
        }).catch(err => {
            console.log(err.message)
        })
    }
}

const handleClick = (e, user) => {
    navigate(Rpage, {state: user})
}

const actionColumn = [
    {
        field: 'action',
        headerName:'Action',
        width:200,
        renderCell: (params) => {
            return(
                <div className="cellAction">
                <Button variant="outlined" onClick={(e) => handleClick(e, params.row)}>Edit</Button>
                <Button variant="contained" onClick={() => handleDelete(params.row.id)}>
                Delete
                </Button>
                </div>
            )
        }
    }
]


  return (
    <Card sx={{ borderRadius: 0, p: 1 }}>
      <CardContent>
        <div className="datatable">
          <div className="datatableTitle">
            Add New {title}
            <Link to={window.location.pathname+"/new"} className="link">
              Add New
            </Link>
          </div>
          <DataGrid
            className="datagrid"
            rows={tableData}
            columns={tableField.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default Datatable
