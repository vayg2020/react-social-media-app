import React from 'react'

function Footer() {
  const today=new Date();
  return (
    <footer className='footer'>
      <p>Copyright &copy; {today.getFullYear()}</p>
    </footer>
  )
}

export default Footer
