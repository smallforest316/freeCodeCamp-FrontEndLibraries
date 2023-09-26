const Settings = ({ breakLength, sessionLength, onLengthChange }) => (
    <div className="settings">
        <div className="break">
            <div id="break-label">Break Length</div>
            <div className="controller">
                <i id="break-decrement" className="fa fa-arrow-down fa-2x" onClick={onLengthChange} />
                <span id="break-length">{breakLength}</span>
                <i id="break-increment" className="fa fa-arrow-up fa-2x" onClick={onLengthChange} />
            </div>
        </div>
        <div className="session">
            <div id="session-label">Session Length</div>
            <div className="controller">
                <i id="session-decrement" className="fa fa-arrow-down fa-2x" onClick={onLengthChange} />
                <span id="session-length">{sessionLength}</span>
                <i id="session-increment" className="fa fa-arrow-up fa-2x" onClick={onLengthChange} />
            </div>
        </div>
    </div>
);

const Timer = ({ type, timerColor, calculateTime, onReset, onStartStop }) => (
    <div className="timer">
        <div id="timer-label" style={timerColor}>{type}</div>
        <div id="time-left" style={timerColor}>{calculateTime()}</div>
        <div>
            <button id="start_stop" onClick={onStartStop}>
                <i className="fa fa-play fa-2x" />
                <i className="fa fa-pause fa-2x" />
            </button>
            <button id="reset" onClick={onReset}>
                <i className="fa fa-refresh fa-2x" />
            </button>
        </div>
    </div>
);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'Session',
            status: 'stop',
            breakLength: 5,
            sessionLength: 25,
            time: 1500,
            intervalId: 0,
            timerColor: { color: 'black' }
        };

        this.calculateTime = this.calculateTime.bind(this);
        this.phaseControl = this.phaseControl.bind(this);
        this.beginCountDown = this.beginCountDown.bind(this);
        this.lengthChangeHandler = this.lengthChangeHandler.bind(this);
        this.startStopHandler = this.startStopHandler.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
    }

    calculateTime() {
        const { time } = this.state;

        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        return minutes + ':' + seconds;
    }

    phaseControl() {
        const {
            time,
            type,
            intervalId,
            breakLength,
            sessionLength
        } = this.state;

        if (time === 0) document.getElementById('beep').play();

        if (time < 61) this.setState({ timerColor: { color: '#a50d0d' } });
        else this.setState({ timerColor: { color: 'black' } });

        if (time < 0) {
            clearInterval(intervalId);

            if (type === 'Session') {
                this.beginCountDown();

                this.setState({
                    time: breakLength * 60,
                    type: 'Break'
                });
            } else {
                this.beginCountDown();

                this.setState({
                    time: sessionLength * 60,
                    type: 'Session'
                });
            }
        }
    }

    beginCountDown() {
        this.setState({
            intervalId: setInterval(() => {
                this.setState({ time: this.state.time - 1 });
                this.phaseControl();
            }, 1000)
        });
    }

    lengthChangeHandler(e) {
        const { status } = this.state;
        const [type, sign] = e.target.id.split('-');
        const currentLength = this.state[`${type}Length`];
        const newLength = sign === 'decrement' ? currentLength - 1 : currentLength + 1;

        if (status === 'run') return;
        if (newLength > 0 && newLength < 61) {
            this.setState({ [`${type}Length`]: newLength });

            if (type === 'session') this.setState({ time: newLength * 60 });
        }
    }

    startStopHandler() {
        const { status, intervalId } = this.state;

        if (status === 'run') {
            clearInterval(intervalId);
            this.setState({ status: 'stop' });
        } else {
            this.beginCountDown();
            this.setState({ status: 'run' });
        }
    }

    resetHandler() {
        clearInterval(this.state.intervalId);

        this.setState({
            type: 'Session',
            status: 'stop',
            breakLength: 5,
            sessionLength: 25,
            time: 1500,
            intervalId: '',
            timerColor: { color: 'black' }
        });

        const audio = document.getElementById('beep');

        audio.pause();
        audio.currentTime = 0;
    }

    render() {
        const {
            type,
            timerColor,
            breakLength,
            sessionLength
        } = this.state;

        return (
            <div id="clock">
                <Settings
                    breakLength={breakLength}
                    sessionLength={sessionLength}
                    onLengthChange={this.lengthChangeHandler}
                />
                <Timer
                    type={type}
                    timerColor={timerColor}
                    calculateTime={this.calculateTime}
                    onReset={this.resetHandler}
                    onStartStop={this.startStopHandler}
                />
                <audio
                    id="beep"
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);