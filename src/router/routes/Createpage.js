import { lazy } from 'react'

const CreatePage = [
  {
    path: '/page/manage',
    component: lazy(() => import('../../views/createpage/dynamic/dynamicTable'))
  },
  {
    path: '/page/create',
    component: lazy(() => import('../../views/createpage/dynamic'))
  },
  {
    path: '/page/edit/:id',
    component: lazy(() => import('../../views/createpage/dynamic'))
  },
  {
    path: '/home/content',
    component: lazy(() => import('../../views/home/content/index'))
  } 
]

export default CreatePage
