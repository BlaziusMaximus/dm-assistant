import React, { Component } from 'react'
// import $ from 'jquery'
import './CommandLine.css'
import PropTypes from 'prop-types'

export class CommandLine extends Component {
    state = {
        command: "",
        history: [],
        selected: 0,
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, selected: this.state.history.length });
    }

    onSubmit = (e) => {
        e.preventDefault();

        let { command, history, selected } = this.state;
        let ogCommand = selected===history.length?command:history[selected];
        command = ogCommand.toLowerCase();
        // tokenize command
        let tokens = command.split(' ').filter(el => el !== ' ' && el !== '');
        if (tokens!=null) {
            this.props.submitCommand(tokens);
            history.push(ogCommand);
            this.setState({ command: '', history, selected: history.length });
        }
    }

    onKeyDown = (e) => {
        let { history, selected } = this.state;
        switch (e.keyCode) {
        case 38: //up
            if (selected > 0) selected--;
            break;
        case 40: //down
            if (selected < history.length) selected++;
            break;
        default:
        }
        this.setState({ selected });
    }

    render() {
        const { command, history, selected } = this.state;

        return (
        <div className="columns is-centered commandLine" style={{width: "100%",backgroundColor:"whitesmoke"}}>
        <div className="column is-half">
        <form onSubmit={this.onSubmit}>
        <div className="field commandField">
            <div className="control commInp">
                <input
                    className="input is-rounded"
                    name="command"
                    type="text"
                    ref="input"
                    placeholder="command..."
                    value={selected===history.length?command:history[selected]}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </div>
            <div className="control commBtn">
                <button className="button is-rounded is-info">Enter</button>
            </div>
        </div>
        </form>
        </div>
        </div>
        )
    }
}

CommandLine.propTypes = {
    submitCommand: PropTypes.func.isRequired,
};

export default CommandLine
