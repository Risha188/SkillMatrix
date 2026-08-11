import {RouterProvider} from 'react-router-dom'
import router from './router/AppRouter.jsx';

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
