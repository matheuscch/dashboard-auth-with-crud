import React,  { useState, useEffect }from 'react'
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import { Input, HelperText, Label, Select, Textarea,   Table,
  Modal, ModalHeader, ModalBody, ModalFooter,  
  TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Badge,
    Avatar,
    Button,
    Pagination,} from '@windmill/react-ui'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
import InfoCard from '../components/Cards/InfoCard'

import { MailIcon } from '../icons'

function CRUD() {
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const [paginated, setPaginated] = useState([])

  
    const [is_closed, setIsClosed] = useState()
    const [name, setLeadName] = useState()
    const [email, setLeadEmail] = useState()

    const resultsPerPage = 10
    const totalResults = data.length

    // pagination setup
  function catchData() {
    fetch(`http://localhost:3000/api/user/leads`, {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      })
    }).then((response) => response.json())
    .then((resjson) => {
      setData(resjson)
    })
    .catch(error => console.warn(error))
  }


    function addLead() {
      fetch(`http://localhost:3000/api/lead`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({is_closed:is_closed,name:name,email:email}),
      headers: new Headers({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      })
    }).then((response) =>      console.log(JSON.stringify({is_closed:is_closed,name:name,email:email})))
    .then((resjson) => {
      console.log(JSON.stringify({is_closed:is_closed,name:name,email:email}))
    })
    .catch(error => console.warn(error))

    }

    // pagination change control
    function onPageChange(p) {
      setPage(p)
    }

    function openModalDelete() {
      setIsModalDeleteOpen(true)
    }
  
    function closeModalDelete() {
      setIsModalDeleteOpen(false)
    }

    function openModal() {
      setIsModalUpdateOpen(true)
    }
  
    function closeModal() {
      setIsModalUpdateOpen(false)
    }
    
    useEffect(() => {
      catchData()
    }, [page])

  return (     
    <>
      <PageTitle>CRUD Leads Panel</PageTitle>


      <SectionTitle>Leads</SectionTitle>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Created</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.slice((page - 1) * resultsPerPage, page * resultsPerPage).map((lead, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{lead.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type={lead.is_closed ? 'danger ': 'success'}>{lead.is_closed ? 'closed': 'open'}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(lead.created_at).toLocaleDateString()}</span>
                </TableCell>              
                <TableCell>
                  <span className="text-sm">{new Date(lead.updated_at).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <Button Button layout="outline" size="small" onClick={openModal}>
                    UPDATE
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="bg-orange-100 dark:bg-orange-500"  size="small" onClick={openModalDelete}>
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    
      {/* <!-- Cards --> */}
      
      <SectionTitle></SectionTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2">
        <InfoCard title="Total leads" value={data.length}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Leads open status" value={data.filter(e => e.is_closed === false).length}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
            {/* <!-- Form --> */}
            
      <SectionTitle>Input Lead</SectionTitle>
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="mt-4">
        <Label>
          <span>Lead Name</span>
          <Input className="mt-1" placeholder="Jane Doe" onChange={event => setLeadName(event.target.value)} />
        </Label> 
        </div>    
        <div className="mt-4">
          <Label>
            <span>E-mail</span>
            <Input className="mt-1" placeholder="Jane Doe" onChange={event => setLeadEmail(event.target.value)} />
          </Label>  
        </div>
        <div className="mt-4">
          <Label>Status</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="false" name="accountType" onChange={event => setIsClosed(event.target.value)}/>
              <span className="ml-2">Open</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="true" name="accountType" onChange={event => setIsClosed(event.target.value)}/>
              <span className="ml-2">Closed</span>
            </Label>
          </div>
        </div>
          <Label className="mt-6" check>      
              <Button onClick={addLead}>
              Add Lead
            </Button>
          </Label>
    </div>

      {/* <!-- Modal --> */}

      <Modal isOpen={isModalDeleteOpen} onClose={closeModalDelete}>
        <ModalHeader>Delete data confirmation</ModalHeader>
        <ModalBody>
          Are you sure to remove this data? This will be permanent.
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModalDelete}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button>Delete</Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalUpdateOpen} onClose={closeModal}>
         <ModalHeader>Update data form</ModalHeader>
         <ModalBody>
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="mt-4">
                <Label>
                  <span>Lead Name</span>
                  <Input className="mt-1" placeholder="Jane Doe" />
                </Label> 
                </div>    
                <div className="mt-4">
                  <Label>
                    <span>E-mail</span>
                    <Input className="mt-1" placeholder="Jane Doe" />
                  </Label>  
                </div>
                <div className="mt-4">
                  <Label>Status</Label>
                  <div className="mt-2">
                    <Label radio>
                      <Input type="radio" value="false" name="accountType" />
                      <span className="ml-2">Open</span>
                    </Label>
                    <Label className="ml-6" radio>
                      <Input type="radio" value="true" name="accountType" />
                      <span className="ml-2">Closed</span>
                    </Label>
                  </div>
                </div>
            </div>
         </ModalBody>
         <ModalFooter>
           <div className="hidden sm:block">
             <Button layout="outline" onClick={closeModal}>
               Cancel
             </Button>
           </div>
           <div className="hidden sm:block">
             <Button>Save</Button>
           </div>
         </ModalFooter>
       </Modal>
    </>
  )
}

export default CRUD
