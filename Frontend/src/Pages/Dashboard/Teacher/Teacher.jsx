import React, { useContext } from 'react'
import { UserContext } from '../../../Context/UserContext'

const Teacher = () => {
  const { user } = useContext(UserContext) || {};
  return (
    <div>{user?.role || 'Teacher'} {user?.name || ''}</div>
  )
}

export default Teacher