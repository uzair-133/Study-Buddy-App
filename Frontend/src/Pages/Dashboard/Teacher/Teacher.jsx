import React from 'react'
import { UserContext } from '../../../Context/UserContext'
import { useContext } from 'react'
import { useEffect } from 'react'
const Teacher = () => {
  const { user, fetchUser } = useContext(UserContext) || { role: '', name: '' };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>{user.role || 'Teacher'} {user.name || ''}</div>
  )
}

export default Teacher