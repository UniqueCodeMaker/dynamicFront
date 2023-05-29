
import React, { useState, useEffect } from "react"
import { Button, Card, CardBody, Col, Form, Label, Row } from "reactstrap"
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


const HomeContent = () => {
    const [imgUpload, setImgUpload] = useState(null) 
    const [pageData, setpageData] = useState({})
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({})

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty()
    )

    const handleEditorChange = (state) => {
        setEditorState(state)
    }
    console.log("errors", errors)
    const Submit = async (data) => {
        const rawContentState = draftToHtml(convertToRaw(editorState.getCurrentContent()))

        const response = await fetch('http://localhost:3030/test/home', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, description:rawContentState })
        })
        console.log("response", response)
        if (response) {
            
            toast.success(<ToastComponent title='Form Submitted Successfully' color='success' icon={<Check />} />, {
                icon: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeButton: false
              })
        } else {
            toast.danger(<ToastComponent title='Form Submitted Successfully' color='success' icon={<Check />} />, {
                icon: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeButton: false
              })
        }
    }
    const handlehomeData  = async() => {
        await fetch('http://localhost:3030/test/homedata')
        .then(response => response.json())
        .then(data => {
            console.log(data?.data, "data")
            setImgUpload(data?.data?.upload_image)
          setpageData(data?.data)
        })
        .catch(err => console.error(err))
      
    }
    useEffect(() => {
        handlehomeData()
    }, [])
    const handleimgupload = () => {
      
        // const x = document.getElementById("upload_image").files[0]
        
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

    return <>
    <Breadcrumbs breadCrumbTitle='Home Page' breadCrumbParent="page"  breadCrumbActive='Home Page'/>
        <Card>
            <CardBody>
                <Row>
            
                    <Form onSubmit={handleSubmit(Submit)}>
                        <Col sm="12">
                            <img src={imgUpload ?? "/placeholder.png" } style={{ border: "2px solid #ccc", height: "120px", marginRight: "10px", borderRadius: "10px" }} />
                            <Label htmlFor="upload_image" className="btn btn-primary">
                               Upload Image
                            </Label>
                            <input type="file"  id="upload_image" className="d-none" {...register('upload_image')} onChange={() => handleimgupload() }/>
                        </Col>
                        <Col sm="12" className="mt-1">
                            <Label htmlFor="meta_tag">Meta Tag</Label>
                            <input type="text" className="form-control" id="meta_tag" placeholder="Meta Tag" {...register('meta_tag', {required:true})} name="meta_tag" defaultValue={pageData?.meta_tag}/>
                        </Col>
                        <Col sm="12" className="mt-1">
                            <Label htmlFor="Title">Title</Label>
                            <input type="text" className="form-control" id="Title" placeholder="Meta Tag" {...register('title', {required:true})} name="title" defaultValue={pageData.title}/>
                        </Col>
                        <Col sm="12" className="mt-1">
                            <Label htmlFor="url">Url</Label>
                            <div className="d-flex flex-row  align-items-center"><input id="url" type="text" className="form-control  " autoComplete="off" style={{ marginLeft: "3px", marginRight: "3px" }} placeholder="Url" {...register('url', {required:true})} name="url" defaultValue={pageData?.url}/><div className="urlError"><div className="invalid-feedback"></div></div></div>
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
                            <Button color="success" type="submit">Save</Button>
                        </Col>
                    </Form>
                </Row>
            </CardBody>
        </Card>
    </>
}
export default HomeContent