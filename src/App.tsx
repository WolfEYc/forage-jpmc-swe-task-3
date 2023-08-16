import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean
  interval: NodeJS.Timeout | undefined
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
      interval: undefined
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (!this.state.showGraph) return <></>

    return (
      <div className="Graph">
        <Graph data={this.state.data} />
      </div>
    )
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      this.setState({ ...this.state, data: [...this.state.data, ...serverResponds] });
    });
  }

  streamDataFromServer() {
    const interval = setInterval(() => { this.getDataFromServer() }, 100);
    this.setState({ ...this.state, showGraph: true, interval: interval })

  }

  toggleStream() {
    if (this.state.interval == undefined) {
      this.streamDataFromServer()
      return
    }

    clearInterval(this.state.interval);
    this.setState({ ...this.state, interval: undefined })
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 3
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => { this.toggleStream() }}>
            Start Streaming Data
          </button>
          {this.renderGraph()}
        </div>
      </div>
    )
  }
}

export default App;
