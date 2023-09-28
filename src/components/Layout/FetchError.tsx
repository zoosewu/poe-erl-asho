import React from 'react'
const FetchError: React.FC = () => {
  return (
    <div className='my-5'>
      Fetch API error, maybe Browser blocked CORS. <a href='https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS'>Click me</a> to see more information.
    </div>
  )
}

export default FetchError
