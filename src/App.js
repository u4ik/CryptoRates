import { useState, useEffect } from "react";
import "./App.css";
import bitCoinGif from "./assets/bitcoin.gif";
import env from "react-dotenv";
//RATE LIMITED....FACK
function App() {
  const [coinData, setCoinData] = useState([]);

  const [sortedByRate, setSortedByRate] = useState();
  const [sortByRateToggle, setSortByRateToggle] = useState(false);
  const [backupData, setBackupData] = useState([]);

  const [imgData, setImgData] = useState();

  const fetchCoinData = async () => {
    let newArr = [];
    let cleanArr = [];
    if (backupData.length < 1) {

      const response = await fetch(
        `http://api.coinlayer.com/api/live?access_key=${env.REACT_APP_API}&expand=1`
      );
      const result = await response.json();

      const imgDataRes = await fetch(
        `http://api.coinlayer.com/list?access_key=${env.REACT_APP_API}`
      );
      const imgData = await imgDataRes.json();

      console.log(result, imgData);

      // console.log(result, imgData);
      
      const handleData = (coinDataJson, imgData) => {
  
        let obj;
        Object.entries(coinDataJson.rates).forEach((i) => {
          obj = i[1];
          
          Object.assign(obj, {
            name: i[0],
          });
          
          Object.entries(imgData.crypto).forEach((j) => {
            if (obj.name === j[0]) {
              Object.assign(obj, {
                img: j[1].icon_url,
              });
            }
          });
          
          newArr.push(obj);
        });
        
        cleanArr = newArr.map((i) => ({
          Name: i.name,
          Rate: i.rate,
          High: i.high,
          Low: i.low,
          Img: i.img,
          Volume: Math.round(parseInt(i.vol)),
          Cap: i.cap,
          Supply: i.sup,
          Change: i.change,
          Change_Percent: i.change,
        }));
        // console.log(cleanArr);
        // setSortedByRate(backupData?.sort((a, b) => b.Rate - a.Rate))
        setCoinData(cleanArr);
        setBackupData(cleanArr);
      };
      handleData(result, imgData);
    }else{
   
      // setBackupData(cleanArr)
    }
  };

  const sortByRateFunc = (boolean) => {
    if (boolean) {
      setSortByRateToggle(boolean);
      setCoinData(backupData.sort((a, b) => b.Rate - a.Rate));
    } else {
      setSortByRateToggle(boolean);
      setCoinData([])
      fetchCoinData()
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, [coinData]);

  return (
    <div className="App">
      <header className="">
        <img src={bitCoinGif} alt="coin" />
        <h1>Crypto Rates</h1>
      </header>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "20vw",
            justifyContent: "center",
          }}
        >
          <label style={{ marginBottom: "5%" }}>Search</label>
          <input
            placeholder="Symbol ex. BTC or btc"
            className="searchInput"
            onChange={(e) => {
              setSortByRateToggle(false);
              coinData.find((i) => {
                if (i.Name === e.target.value.toUpperCase()) {
                  // console.log(i);
                  setCoinData([i]);
                } else if (e.target.value === "") {
                  setCoinData(backupData);
                }
              });
            }}
          />
        </div>
      </div>
      <label>Sort</label>
      <div style={{ display: "" }}>
        <button
          onClick={() => {
            sortByRateFunc(true);
          }}
          >
          Rate
        </button>
        {/* <button>Volume</button> */}
        {/* <button>High</button> */}
        <button
          onClick={() => {
            
            sortByRateFunc(false);
          
      
          }}
        >
          A-Z
        </button>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {
          //  sortByRateToggle === false ?
          coinData?.map((coin, index) => {
            return (
              <div
                className="crypto-container"
                key={index}
                style={{
                  margin: "2%",
                  border: "1px solid white",
                  borderRadius: "5px",
                  padding: "4%",
                  minWidth: "200px",
                }}
              >
                <img alt="crypto icon" className="coinImg" src={coin.Img}></img>
                <h2>{coin.Name}</h2>
                <label className="infoLabel">Rate USD</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3
                    style={{
                      marginRight: "2%",
                      color: "green",
                      fontWeight: 800,
                    }}
                  >
                    $
                  </h3>
                  <p>{coin.Rate}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      color: "green",
                      fontSize: "1.5em",
                      fontWeight: 1000,
                    }}
                  >
                    ↑
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "1%",
                      maxWidth: "100px",
                      minWidth: "100px",
                    }}
                  >
                    <label className="infoLabel">High</label>
                    <p>{isNaN(coin.High) ? "Unavailable" : coin.High}</p>
                  </div>
                  <p>|</p>
                  <p>|</p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: "100px",
                      minWidth: "100px",
                    }}
                  >
                    <label className="infoLabel2">Low</label>
                    <p>{isNaN(coin.Low) ? "Unavailable" : coin.Low}</p>
                  </div>
                  <p
                    style={{
                      color: "red",
                      fontSize: "1.5em",
                      fontWeight: 1000,
                    }}
                  >
                    ↓
                  </p>

                </div>
                <label className="infoLabel">Supply</label>
                <p>{coin.Supply === null ? "Unavailable" : coin.Supply}</p>
                <label className="infoLabel">Volume</label>
                <p>{isNaN(coin.Volume) ? "Unavailable" : coin.Volume}</p>
              </div>
            );


          })
          //  :

          // sortedByRate?.map((coin, index) => {
          //   return (
          //     <div className='crypto-container' key={index} style={{ margin: '2%', border: '1px solid white', borderRadius: '5px', padding: '4%', minWidth: '200px' }}>
          //       <img alt='crypto icon' className='coinImg' src={coin.Img}></img>
          //       <h2>{coin.Name}</h2>
          //       <label className='infoLabel'>Rate USD</label>
          //       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          //         <h3 style={{ marginRight: '2%', color: 'green', fontWeight: 800 }}>$</h3>
          //         <p>{coin.Rate}</p>
          //       </div>
          //       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          //         <p style={{ color: 'green', fontSize: '1.5em', fontWeight: 1000 }}>↑</p>

          //         <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1%', maxWidth: '100px', minWidth: '100px' }}>
          //           <label className='infoLabel'>High</label>
          //           <p>{isNaN(coin.High) ? 'Unavailable' : coin.High}</p>
          //         </div>
          //         <p>|</p>
          //         <p>|</p>
          //         <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100px', minWidth: '100px' }}>
          //           <label className='infoLabel2'>Low</label>
          //           <p>{isNaN(coin.Low) ? 'Unavailable' : coin.Low}</p>
          //         </div>
          //         <p style={{ color: 'red', fontSize: '1.5em', fontWeight: 1000 }}>↓</p>

          //       </div>
          //       <label className='infoLabel'>Supply</label>
          //       <p>{coin.Supply === null ? 'Unavailable' : coin.Supply}</p>
          //       <label className='infoLabel'>Volume</label>
          //       <p>{isNaN(coin.Volume) ? 'Unavailable' : coin.Volume}</p>

          //     </div>
          //   )
          // })
        }
      </div>
    </div>
  );
}

export default App;
