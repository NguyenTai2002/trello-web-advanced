import React, { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
import { set } from 'react-hook-form'

function AccountVerification() {
  let [searchParams] = useSearchParams( )

  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])
  console.log(email, token)

  const [verified, setVerified] = useState(false)

  // Goi API de verify tai khoan

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])

  // Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to="404" />
  }
  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..."/>
  }

  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về trang login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification