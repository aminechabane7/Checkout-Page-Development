// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Checkout from './components/Checkout';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import './styles.css'

const App = () => {
  return (
    <div className="mt-12 container mx-auto">
    <Router>
      <Switch>
        <Route path='/' exact component={Checkout} />
        <Route path='/success' component={SuccessPage} />
        <Route path='/cancel' component={CancelPage} />
      </Switch>
    </Router>
    </div>
  );
};

export default App;
