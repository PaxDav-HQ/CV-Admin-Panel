import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboardMain from './components/AdminDashboardMain';
import ManageUsers from './components/ManageUsers';
import AllListings from './components/AllListings';


function App() {
  const uri = useSelector(state=>state.UriReducer.uri)
  const dispatch = useDispatch()
  useEffect(()=>{
    axios.post(`${uri}payment/update-rates`).then((res)=>{
      let { usd, gbp, eur } = res.data.data
      dispatch({type: 'SET_EXCHANGE_RATE', payload: { NGN: 1, USD: usd, GBP: gbp, EUR: eur}})      
    }).catch((err)=>{
      console.log("Error updating currency rates");
    })
  }, [])
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate replace to="/login" />} />
        <Route path='/login' element={<Login />} />        
        <Route path='/admin' element={<Dashboard />}>
          <Route path='/admin/' element={<AdminDashboardMain />} />
          <Route path='/admin/users' element={<ManageUsers />} />
          <Route path='/admin/listings/all' element={<AllListings />} />
          {/* <Route path='/admin/profile' element={<EditProfile />} /> */}
          {/* <Route path='/admin/transactions' element={<TransactionHistory />} /> */}
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;