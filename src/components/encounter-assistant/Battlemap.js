import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Battlemap.css'

export class Battlemap extends Component {

    renderRow = (row, rowkey) => {
        const { boardSize, squareSize, selectedSquare, highlightedSquare, localEnts, ghostEnts, tabColors } = this.props;
        return (
        <tr className="battlemapRow" key={rowkey}>
            {row.map((square, sqkey) => {
                // everything here happens at an individual square
                
                // is square local entity
                let localSq = Object.keys(localEnts).filter(ent => {
                    return parseInt(localEnts[ent].x)===sqkey && parseInt(localEnts[ent].y)===boardSize-rowkey-1;
                })[0];
                // get global entities
                let ghostSqs = []; let ghostSqEnts = [];
                ghostEnts.forEach((tab, tabkey) => {
                    Object.keys(tab).forEach(ent => {
                        if (parseInt(tab[ent].x)===sqkey && parseInt(tab[ent].y)===boardSize-rowkey-1) {
                            ghostSqs.push(tabkey); ghostSqEnts.push(ent);
                        }
                    });
                });
                // display local rather than global
                if (localSq) ghostSqs = [];
                // global entities' nationalities
                let ghostConflicts = ghostSqs.map((sq,i) => {
                                // color                            starting %                      ending %
                    return `${tabColors[sq%tabColors.length]} ${(100/ghostSqs.length)*(i)}% ${(100/ghostSqs.length)*(i+1)}%`;
                });
                // global entity nationality
                let ghostColor = ghostSqs.length!==0?ghostSqs.length===1?tabColors[ghostSqs[0]%tabColors.length]:"":"";
                console.log(localSq===selectedSquare)
                return (
                <td
                    className={"battlemapSquare ".concat(localSq?"is-local-ent":(ghostSqs.length!==0?"is-ghost-ent":"")).concat(highlightedSquare===localSq?" is-highlighted":"")}
                    key={sqkey}
                    style={{
                        width: squareSize,
                        height: squareSize,
                        background: ghostSqs.length>1?`linear-gradient(135deg, ${ghostConflicts})`:ghostColor,
                        borderRadius: "8px",
                    }}
                    onMouseOver={() => ghostSqs.length!==0?this.props.highlightTabs(ghostSqs):localSq!=null?this.props.highlightSquare(localSq):null}
                    onMouseOut={() => ghostSqs.length!==0?this.props.unHighlightTabs():localSq!=null?this.props.unHighlightSquare():null}
                    onClick={() => this.props.activateTab(localSq, ghostSqs, ghostSqEnts)}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => this.props.handleDrop(sqkey, boardSize-rowkey-1, e)}>
                        {localSq?
                        <div
                            className="cell"
                            draggable="true"
                            style={{
                                border: localSq===selectedSquare?"4px solid #eace17":"",
                                borderRadius: "2px",
                            }}
                            onDragStart={(evt) => {
                                let dt = evt.dataTransfer;
                                dt.setData('Text', localSq);
                            }}
                            onClick={() => this.props.selectSquare(localSq)}>
                        </div>
                        :null}
                </td>);
            })}
        </tr>
        );
    }

    render() {
        let { boardSize } = this.props;

        return (
        <table className="battlemap" tabIndex="0" style={{margin: `${this.props.squareSize/4}px`}}>
        <tbody>
            {Array(boardSize).fill(Array(boardSize).fill(null)).map((row, key) => 
                this.renderRow(row, key)
            )}
        </tbody>
        </table>
        );
    }
}

Battlemap.propTypes = {
    boardSize: PropTypes.number.isRequired,
    squareSize: PropTypes.number.isRequired,
    selectSquare: PropTypes.func.isRequired,
    localEnts: PropTypes.object.isRequired,
    ghostEnts: PropTypes.array.isRequired,
};

export default Battlemap;
