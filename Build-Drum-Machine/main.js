const DrumMachine = () => {
    const drumPadEls = [
      {
        displayName: "Heater 1",
        id: "Q",
        keyCode: 81,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
      },
      {
        displayName: "Heater 2",
        id: "W",
        keyCode: 87,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
      },
      {
        displayName: "Heater 3",
        id: "E",
        keyCode: 69,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
      },
      {
        displayName: "Heater 4",
        id: "A",
        keyCode: 65,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
      },
      {
        displayName: "Open HH",
        id: "S",
        keyCode: 83,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
      },
      {
        displayName: "Closed HH",
        id: "D",
        keyCode: 68,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
      },
      {
        displayName: "Kick",
        id: "Z",
        keyCode: 90,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
      },
      {
        displayName: "Kick n' Hat",
        id: "X",
        keyCode: 88,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
      },
      {
        displayName: "Clap",
        id: "C",
        keyCode: 67,
        audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
      },
    ];
  
    const [on, setOn] = React.useState(true);
    const [display, setDisplay] = React.useState("");
    const [activePad, setActivePad] = React.useState("");
    const drumPadElsRef = React.useRef(drumPadEls);
    const toggle = () => (on ? setOn(false) : setOn(true));
  
    const playAudio = React.useCallback(
      (pad) => {
        if (!on) return;
        setActivePad(pad.id);
        document.getElementById(pad.id).play();
        setTimeout(() => setActivePad(""), 200);
        return setDisplay(pad.displayName);
      },
      [on]
    );
  
    React.useEffect(() => {
      const detectKeyDown = (e) => {
        const found = drumPadElsRef.current.find(
          (el) => el.keyCode === e.keyCode
        );
        if (!found) return;
        return playAudio(found);
      };
      document.addEventListener("keydown", detectKeyDown);
      return () => document.removeEventListener("keydown", detectKeyDown);
    }, [drumPadElsRef, on, playAudio]);
  
    return (
      <div style={containerCSS}>
        <div id="drum-machine" style={drumDivCSS}>
          <div style={drumPadCSS}>
            {drumPadEls.map((el, i) => (
              <div
                key={i}
                id={el.id + "-div"}
                className="drum-pad"
                style={drumPadElCSS(activePad === el.id)}
                onClick={() => playAudio(el)}
              >
                {el.id}
                <audio
                  src={el.audio}
                  className="clip"
                  id={el.id}
                  preload="auto"
                />
              </div>
            ))}
          </div>
          <div style={controlPanelCSS}>
            <div id="power-switch" style={toggleCSS} onClick={toggle}>
              <div style={sliderCSS(on)}>{on ? "ON" : "OFF"}</div>
            </div>
            <div id="display" style={drumDisplayCSS}>
              {display}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const containerCSS = {
    minHeight: "100vh",
    background: "#b9f",
    color: "#B0CAC7",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  
  const drumDivCSS = {
    background: "#875cd9",
    width: 365,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
    borderRadius: 5,
  };
  
  const drumPadCSS = {
    width: 215,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  };
  
  const drumPadElCSS = (active) => ({
    background: active ? "#5929b9" : "#421897",
    cursor: "pointer",
    borderRadius: 5,
    width: 65,
    height: 50,
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    fontWeight: 800,
  });
  
  const controlPanelCSS = {
    width: 120,
    height: 170,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    placeItems: "end",
  };
  
  const drumDisplayCSS = {
    background: "#F7D6BF",
    color: "#005086",
    width: 120,
    height: 40,
    borderRadius: 5,
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    fontWeight: 800,
    fontSize: 13,
  };
  
  const toggleCSS = {
    position: "relative",
    background: "#3d3041",
    width: 44,
    height: 25,
    borderRadius: 5,
  };
  
  const sliderCSS = (on) => ({
    position: "absolute",
    background: "#875cd9",
    color: on ? "inherit" : "#ccc",
    borderRadius: 2,
    width: 19,
    height: 19,
    margin: 3,
    cursor: "pointer",
    left: on ? 0 : 19,
    fontWeight: 600,
    fontSize: 7.5,
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    transition: ".3s",
  });
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
      <DrumMachine />
  );