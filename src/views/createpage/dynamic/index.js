import React, { useEffect, useState } from "react"
import { BreadcrumbItem, Button, Card, CardBody, Col, Form, Label, Row } from "reactstrap"
import { Editor } from 'react-draft-wysiwyg'
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { useForm } from "react-hook-form"
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { toast } from 'react-toastify'
import { Check } from "react-feather"
import Breadcrumbs from '@components/breadcrumbs'
import Avatar from '@components/avatar'
import { useParams } from 'react-router'
import { Link } from "react-router-dom/cjs/react-router-dom"
Link
const ToastComponent = ({ title, icon, color }) => (
    <>
      <div className='toastify-header pb-0'>
        <div className='title-wrapper'>
          <Avatar size='sm' color={color} icon={icon} />
          <h6 className='toast-title'>{title}</h6>
        </div>
      </div>
    </>
  )

const dynamic = () => {
    const params = useParams()
    console.log("params", params.id)
    const [pageData, setpageData] = useState([])
    const [Selected, setselected] = useState({})
    const [defaultCategory, setdefaultcategory] = useState("")
    const [imgUpload, setImgUpload] = useState(null) 
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({})

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    const handleEditorChange = (state) => {
        setEditorState(state)
    }
    console.log("errors", errors)
    const Submit = async (data) => {
        const rawContentState = draftToHtml(convertToRaw(editorState.getCurrentContent()))

        if (params && params.id) {
            const response = await fetch(`http://localhost:3030/test/editpage/${params.id}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...data, description:rawContentState })
            })

            if (response) {
                reset()
                setImgUpload("/placeholder.png")
                setEditorState(() => EditorState.createEmpty())
                toast.success(<ToastComponent title='Form Updated Successfully' color='success' icon={<Check />} />, {
                    icon: false,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeButton: false
                  })
            } else {
                toast.danger(<ToastComponent title='Error' color='danger' icon={<Check />} />, {
                    icon: false,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeButton: false
                  })
            }
            
        } else  {
            const response = await fetch('http://localhost:3030/test/serve', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...data, description:rawContentState })
            })
           
            if (response) {
                // reset()
                setEditorState(() => EditorState.createEmpty())
                setImgUpload("/placeholder.png")
                toast.success(<ToastComponent title='Form Submitted Successfully' color='success' icon={<Check />} />, {
                    icon: false,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeButton: false
                  })
            } else {
                toast.danger(<ToastComponent title='Error' color='Danger' icon={<Check />} />, {
                    icon: false,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeButton: false
                  })
            }
        }
       
    }
    const handleimgupload = () => {
      
        const fileInput = document.getElementById('upload_image')
        const file = fileInput.files[0]
      
        if (file) {
          const reader = new FileReader()
          reader.onload = function(e) {
            const uploadedDataURL = e.target.result
            // displayImage(uploadedDataURL)
             setImgUpload(uploadedDataURL)
          }
          reader.readAsDataURL(file)
        }
    }
    const handlepagedata = async() => {
    
        await fetch('http://localhost:3030/test/serveall')
         .then(response => response.json())
         .then(data => {
           setpageData(data.data)
         })
         .catch(err => console.error(err))
       }

    useEffect(() => {
        if (params) {
           handlepagedata()
        }
    }, [params.id])

    useEffect(() => {
        console.log(pageData, "pagedata")
            if (pageData.length) {
                const mutated = pageData.filter((data) => {
                    return data._id === params.id
                })
                console.log("mutated", mutated)
                setselected(mutated[0])
                
                setdefaultcategory(mutated[0]?.category)
                setImgUpload(mutated[0]?.upload_image)
            }    
        }, [pageData])
    return <>
    <Breadcrumbs breadCrumbTitle='Manage Page' breadCrumbParent="page"  breadCrumbActive='Manage Page'>
    <BreadcrumbItem>
          <Link to='#'> Home </Link>
        </BreadcrumbItem>
    </Breadcrumbs>
        <Card>
            <CardBody>
                <Row>
            
                    <Form onSubmit={handleSubmit(Submit)}>
                        <Col sm="12">
                            <img src={imgUpload ?? "/placeholder.png" } style={{ border: "2px solid #ccc", height: "120px", marginRight: "10px", borderRadius: "10px" }} />
                            <Label htmlFor="upload_image" className="btn btn-primary">
                               Upload Image
                            </Label>
                            <input type="file"  id="upload_image" className="d-none" {...register('upload_image')} onChange={() => handleimgupload() } />
                        </Col>
                        <Col sm="12" className="mt-1">
                            <Label htmlFor="page_name">Page Name</Label>
                            <input type="text" className="form-control" id="page_name" placeholder="Page Name" {...register('page_name', {required:true})} defaultValue={Selected?.page_name}/>
                        </Col>
                        <Col sm="12" className="mt-1">
                            <Label htmlFor="slug_url">Slug Url</Label>
                            <div className="d-flex flex-row  align-items-center"><input id="slug_url" type="text" name="url" className="form-control " autoComplete="off" style={{ marginLeft: "3px", marginRight: "3px" }} placeholder="slug url" {...register('slug_url', {required:true})} defaultValue={Selected?.slug_url} /><div className="urlError"><div className="invalid-feedback"></div></div></div>
                        </Col>
                        <Col sm="12" className="mt-1">
                            <Label htmlFor="category">Category</Label>
                            <select className="form-control" id="category" {...register('category', {required:true})} value={defaultCategory} onChange={(e) => setdefaultcategory(e.target.value)}>
                                <option value="">Select Category</option>
                                <option value="1">Technical Service</option>
                                <option value="2">Media Service</option>
                                <option value="3">Digital Service</option>
                                <option value="4">Online Service</option>
                                <option value="5">Other Services</option>

                            </select>
                        </Col>
                        <Col className="mt-1">
                            <Label htmlFor="description-editor">Description</Label>
                            <div id='description-editor'>
                                <Editor placeholder='Description' editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                />
                            </div>
                        </Col>
                        <Col className="mt-1">
                            <Button color="success" type="submit">Submit</Button>
                        </Col>
                    </Form>
                </Row>
            </CardBody>
        </Card>
    </>
}
export default dynamic