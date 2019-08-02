import React from 'react';
import HomeScreen from './pages/HomeScreen/HomeScreen'
import Round from './pages/Round/Round'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
      <Router>
          <div>
              <Switch>
                  <Route exact path="/" component={HomeScreen} />
                  <Route exact path="/round" component={Round} />
              </Switch>
          </div>
      </Router>
  );
}

export default App;
