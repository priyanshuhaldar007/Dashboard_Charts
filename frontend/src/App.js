import "./App.css";
import { useEffect, useState } from "react";
import { Line, getDatasetAtEvent,legend } from "react-chartjs-2";
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
  const [Symbol, setSymbol] = useState("");
  const [DataDate, setDataDate] = useState("");
  const [DropDown, setDropDown] = useState("Select Value");
  const [APIData, setAPIData] = useState([]);
  const [GraphData, setGraphData] = useState([]);

  useEffect(() => {
    // axios('http://localhost:5000/getData?key="MSFT"', {
    //   method: "GET",
    //   mode: "no-cors",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-Type": "application/json",
    //   },
    //   withCredentials: true,
    //   credentials: "same-origin",
    // }).then((response) => {
    //   console.log(response.data.values[0]);
    //   setDataDate(response.data.Date);
    //   setAPIData(response.data.values);
    // });
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

  function fetchData() {
   setSymbol(Symbol.toUpperCase());
    let query = 'http://localhost:5000/getData?key="' + Symbol + '"';
    // console.log(query);
    setGraphData([]);
    setDropDown("Select Value");
    axios(query, {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "same-origin",
    }).then((response) => {
      setDataDate(response.data.Date);
      console.log(response.data.values);
      setAPIData(response.data.values);
    });
  }

  const data = {
    labels: APIData.map((data) => data.Time),
    datasets: [
      {
        label:'API data',
        data: GraphData,
        // backgroundColor: "transparent",
        borderColor: "#f26c6d",
        pointBorderColor: "red",
        pointBorderWidth: 2,
        tension: 0.5,
      },
    ],
  };
  // const data = {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange","Pink"],
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: [12, 19, 3, 5,  3],
  //       borderWidth: 1,
  //       pointBorderColor:"red",
  //     },
  //     {
  //       label: "of Votes",
  //       data: [, , , , 3, 5,9],
  //       borderWidth: 1,
  //       pointBorderColor:"blue",
  //     },
  //   ],
  // };
  const options = {
    plugins: {
      legend: {
        display:true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
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
      <header className="cl">
        <span>Date:&nbsp;</span>
        <span>{DataDate}</span>
      </header>
      <main>
        <form className="cr">
          <section>
            <label>Enter a symbol:</label>
            <input
              type="text"
              className="input-box"
              placeholder="Symbol"
              value={Symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </section>
          <section>
            <label>Select mode:</label>
            <select
              className="dropdown-select"
              onChange={(e) => {
                setDropDown(e.target.value);
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
          </section>
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchData();
            }}
          >
            Fetch Data
          </button>
        </form>
        <div className="graph">
          <Line className="myChart" data={data} options={options}></Line>
        </div>
      </main>
    </div>
  );
}

export default App;
