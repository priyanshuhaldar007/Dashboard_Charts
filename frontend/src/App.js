import "./App.css";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
  // const [openData, setOpenData] = useState([]);
  // const [closeData, setCloseData] = useState([]);
  // const [highData, setHighData] = useState([]);
  // const [lowData, setLowData] = useState([]);
  // const [volumeData, setVolumeData] = useState([]);
  // const [chartLabel, setChartLabel] = useState([]);
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

      //getting labels
      //   let arr = Object.keys(response.data);
      //   for (let i = 0; i < arr.length; i++) {
      //     arr[i] = arr[i].slice(11, 16);
      //   }
      //   setChartLabel(arr);
      //   setDataDate(Object.keys(response.data)[0].slice(0, 10));

      //   //getting the data
      //   let arr1 = [],
      //     arr2 = [],
      //     arr3 = [],
      //     arr4 = [],
      //     arr5 = [];
      //   console.log();
      //   Object.values(response.data).forEach((ele) => {
      //     arr1.push(Object.values(ele)[0]);
      //     arr2.push(Object.values(ele)[1]);
      //     arr3.push(Object.values(ele)[2]);
      //     arr4.push(Object.values(ele)[3]);
      //     arr5.push(Object.values(ele)[4]);
      //   });
      //   setOpenData(arr1);
      //   setHighData(arr2);
      //   setLowData(arr3);
      //   setCloseData(arr4);
      //   setVolumeData(arr5);
      //   setGraphData(arr1);
    });
  }, []);

  function setData(s) {
    let tempArr=[]
    switch (s) {
      case "Open":
        tempArr=APIData.map((data) => data.Open);
        console.log("open dataset");
        break;
      case "Close":
        tempArr=APIData.map((data) => data.Close);
        console.log("close dataset");
        break;
      case "High":
        tempArr=APIData.map((data) => data.High);
        console.log("high dataset");
        break;
      case "Low":
        tempArr=APIData.map((data) => data.Low);
        console.log("low dataset");
        break;
      case "Volume":
        tempArr=APIData.map((data) => data.Volume);
        console.log("volume dataset");
        break;
      default:
        break;
    }
    setGraphData(tempArr);
    console.log(GraphData);
  }

  const data = {
    labels: GraphData.map((data) => data.Time),
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
      // legend:true
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        // min: 4,
        // max: 10,
        ticks: {
          stepsize: 2,
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
            <option value="Open" defaultValue>
              Open
            </option>
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
