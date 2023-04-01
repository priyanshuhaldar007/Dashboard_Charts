import "./App.css";
import { useEffect, useState } from "react";
import { Line, getDatasetAtEvent } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [DataDate, setDataDate] = useState("");
  const [APIData, setAPIData] = useState([]);
  const [GraphData, setGraphData] = useState([]);

  useEffect(() => {
    axios('http://localhost:5000/getData?key="MSFT"', {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "same-origin",
    }).then((response) => {
      console.log(response.data.values[0]);
      setDataDate(response.data.Date);
      setAPIData(response.data.values);
    });
  }, []);

  function setData(s) {
    switch (s) {
      case "Open":
        setGraphData(APIData.map((data) => data.Open));
        // console.log("open dataset");
        break;
      case "Close":
        setGraphData(APIData.map((data) => data.Close));
        // console.log("close dataset");
        break;
      case "High":
        setGraphData(APIData.map((data) => data.High));
        // console.log("high dataset");
        break;
      case "Low":
        setGraphData(APIData.map((data) => data.Low));
        // console.log("low dataset");
        break;
      case "Volume":
        setGraphData(APIData.map((data) => data.Volume));
        // console.log("volume dataset");
        break;
      default:
        setGraphData([]);
        break;
    }
    // console.log(GraphData);
  }

  const data = {
    labels: APIData.map((data) => data.Time),
    datasets: [
      {
        data: GraphData,
        backgroundColor: "transparent",
        borderColor: "#f26c6d",
        pointBorderColor: "red",
        pointBorderWidth: 2,
        tension: 0.5,
      },
    ],
  };
  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepsize: 1,
          callback: (value) => value + "k",
        },
      },
    },
  };

  return (
    <div className="App">
      <div className="Controls">
        <div className="cl">
          <span>Date:&nbsp;</span>
          <span>{DataDate}</span>
        </div>
        <div className="cr">
          <div className="input" placeholder="Symbol"></div>
          <select
            onChange={(e) => {
              setData(e.target.value);
            }}
          >
            <option value="Select Value" defaultValue>
              Select Value
            </option>
            <option value="Open">Open</option>
            <option value="Close">Close</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Volume">Volume</option>
          </select>
        </div>
      </div>
      <div className="graph">
        <Line data={data} options={options}></Line>
      </div>
      <button>Refresh</button>
    </div>
  );
}

export default App;
