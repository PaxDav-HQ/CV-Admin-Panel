import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboardMain from './components/adminDashboard/AdminDashboardMain';
import ManageUsers from './components/manageUsers/ManageUsers';
import AllListings from './components/allListings/AllListings';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ListPropertyType from './components/ListPropertyType';
import CreateListingWizard from './components/createListing/CreateListingWizard';
import ManageVerifications from './components/verifications/ManageVerifications';
import ManagePayouts from './components/payouts/ManagePayouts';
import UnderConstruction from './pages/UnderConstruction'


function App() {
  const uri = useSelector(state=>state.UriReducer.uri)
  const dispatch = useDispatch()
  const theme = createTheme({
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
  });
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
      <ThemeProvider theme={theme}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate replace to="/login" />} />
        <Route path='/login' element={<Login />} />        
        <Route path='/admin' element={<Dashboard />}>
          <Route path='/admin/' element={<AdminDashboardMain />} />
          <Route path='/admin/users' element={<ManageUsers />} />
          <Route path='/admin/listings/all' element={<AllListings />} />
          <Route 
            path="/admin/services" 
            element={<UnderConstruction featureName="Service Management" />} 
          />
          <Route 
            path="/admin/verification" 
            element={<ManageVerifications />} 
          />
          <Route path='/admin/transactions' element={<ManagePayouts />} />
          <Route path='/admin/analytics' element={<UnderConstruction featureName="Analytics" />} />
        </Route>
        <Route path='/admin/property-types' element={<ListPropertyType />} />
        <Route path='/list-property/details' element={<CreateListingWizard />} />
        <Route element={<CreateListingWizard />} path="/listings/edit/:id" />
        <Route path='*' element={<NotFound />} />
      </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;