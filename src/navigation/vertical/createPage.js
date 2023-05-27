import {  Book, Circle } from 'react-feather'

export default [
  {
    id: 'Manage Page',
    title: 'Page',
    icon: <Book size={20} />,
    navLink: '/page',
    children:[
      {
        id: 'manage_page',
        title: 'Manage Page',
        icon: <Circle size={12} />,
        navLink: '/page/manage',
        action: 'supplier',
        resource: 'customers'
      }
    ]
  }
]
