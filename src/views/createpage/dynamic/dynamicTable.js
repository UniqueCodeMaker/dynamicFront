// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'

// ** Store & Actions
import { getData } from '../../store/actions'
import { useSelector, useDispatch } from 'react-redux'
import ReactHtmlParser from "react-html-parser"
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Plus, Edit, Trash2 } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Button, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'
// import { useSkin } from '@hooks/useSkin'

const dynamicTable = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.dataTables)

  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageData, setpageData] = useState([])
  
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('page_name')
  const [sortDirection, setSortDirection] = useState('asc')
  const handlepagedata = async() => {
    
   await fetch('http://localhost:3030/test/serveall')
    .then(response => response.json())
    .then(data => {
      setpageData(data)
      console.log(data, "opage")
    })
    .catch(err => console.error(err))
  }
  // ** Get data on mount
  useEffect(() => {

    handlepagedata()
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchValue,
        sColumn: sortColumn,
        sDirection: sortDirection
      })
    )
  }, [])

  // ** Function to handle filter
  const handleFilter = e => {
    setSearchValue(e.target.value)

    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: e.target.value,
        sColumn: sortColumn,
        sDirection: sortDirection
      })
    )
  }

  const handleDeleteById = async(id) => {
      const response = await fetch(`http://localhost:3030/test/deletepage/${id}`)
      if (response) {
        console.log("response", response)
        handlepagedata()
      }
    }
  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    dispatch(
      getData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        q: searchValue,
        sColumn: sortColumn,
        sDirection: sortDirection
      })
    )
    setCurrentPage(page.selected + 1)
  }

  const handleSort = (column, sortDirection) => {
    dispatch(
      getData({
        page: 1,
        perPage: rowsPerPage,
        q: searchValue,
        sColumn: column.selector,
        sDirection: sortDirection
      })
    )
    setSortColumn(column.selector)
    setSortDirection(sortDirection)
  }
  // ** Function to handle per page
  const handlePerPage = e => {
    dispatch(
      getData({
        page: currentPage,
        perPage: parseInt(e.target.value),
        q: searchValue,
        sColumn: sortColumn,
        sDirection: sortDirection
      })
    )
    setRowsPerPage(parseInt(e.target.value))
  }

   // data heading
  const serverSideColumns = [
    {
      name: 'Page Name',
      // selector: 'page_name',
      sortable: true,
      cell: row => {
        return (
          <Link to={`/page/edit/${row._id}`} id={`edit-tooltip-${row._id}`}>
            {row.page_name}
          </Link>
        )
      },
      width:"14%"
    },
    {
      name: 'Description',
      // selector: 'description',
      sortable: true,
      cell: row => {
        
        return (
         <>{ReactHtmlParser(row.description)}</>
        )
      },
      width:"50%"
    },
    {
      name: 'Slug',
      cell:(row) => <span>{row.slug_url}</span>,
      sortable: true
    },
    {
      name: 'Category',
      cell:(row) => <span>{row.category === "1" ? "Technical Services" : row.category === 1 ? "" : "" }</span>,
      sortable: true
    },
    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '150px',
      cell: row => {
        return (<>
          <Link to={`/page/edit/${row._id}`} id={`edit-tooltip-${row._id}`}>
            <Edit size={17} className='' />
          </Link>
            <Trash2 size={17} className='mx-1 text-danger cursor-pointer' onClick={() => handleDeleteById(row._id)} />
          </>
        )
      }
    }
  ]

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = parseInt(store.total / rowsPerPage)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count + 1 || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  // ** Table data to render

  return (
    <Fragment>
      
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'> Pages</CardTitle>
          <Link className='btn btn-primary' to="/page/create">
            <Plus size={15} /> Create Page
          </Link>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50 d-flex flex-row justify-content-between'>
          <Col sm='2'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='3'>
            <Label className='mr-1' for='search-input'>
              Search&nbsp;
            </Label>
            <Input
              className='dataTable-filter form-control'
              type='text'
              bsSize='sm'

              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>

      { pageData && <DataTable
          noHeader
          fixedHeader
          responsive={true}
          sortServer
          onSort={ handleSort }
          //progressPending={isSorting}
          sortFunction={row => row}
          defaultSortField='page_name'
          defaultSortAsc
          pagination
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={pageData?.data}
          persistTableHead
        />}
      </Card>
    </Fragment>
  )
}

export default memo(dynamicTable)