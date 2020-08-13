import React, { PureComponent } from 'react';
import './style.css';

class App extends PureComponent {
    state = {
        columnLen: 3,
        rowLen: 3,
        symbolLen: 3,
        startGame: false,
        turn:false,
        winner:false,
        draw:false
    }

    tryAgain=()=>{
        this.setState({
            turn:true,
            startGame: false,
            columnLen: 3,
            rowLen: 3,
            symbolLen: 3,
            winner:false,
            draw:false
        })
    }

    check = (x,y)=>{
        let { symbolLen,turn, columnLen, rowLen, winner} = this.state;
        let el = document.querySelectorAll(".row")[y].parentNode
        let getElement = (x,y) =>  el.children[y].children[x]
        let cases = [
            {
                opOne:(val,i)=> val+i,
                opTwo:(val,i)=> val+i,
                opThree:(val,i)=> val-i,
                opFour:(val,i)=> val-i,
            },
            {
                opOne:(val,i)=> val,
                opTwo:(val,i)=> val+i,
                opThree:(val,i)=> val,
                opFour:(val,i)=> val-i,
            },
            {
                opOne:(val,i)=> val+i,
                opTwo:(val,i)=> val,
                opThree:(val,i)=> val-i,
                opFour:(val,i)=> val,
            },
            {
                opOne:(val,i)=> val-i,
                opTwo:(val,i)=> val+i,
                opThree:(val,i)=> val+i,
                opFour:(val,i)=> val-i,
            }
        ]
    
        let checkEl; 
        let turnStr =  turn ? "X":"O";
        cases.forEach(({opOne, opTwo, opThree, opFour}) => {
            let len_scope = 1;
            let sideTwo = true;
            let sideOne = true;
            let likeEl = [getElement(x,y)];
            let i=1;
            while(sideTwo||sideOne) {
                if(
                    sideOne&&
                    opOne(x,i)>=0&&
                    opTwo(y,i)>=0&&
                    opOne(x,i)<rowLen&&
                    opTwo(y,i)<columnLen
                ){
                    checkEl = getElement(opOne(x,i), opTwo(y,i));
                    if (checkEl.innerText === turnStr) {
                        likeEl.push(checkEl)
                        len_scope++
                    } else{
                        sideOne=false
                    }
                } else{
                    sideOne=false
                }
    
                if (
                    sideTwo&&
                    opThree(x,i)>=0&&
                    opFour(y,i)>=0&&
                    opThree(x,i)<rowLen&&
                    opFour(y,i)<columnLen
                ) {
                    checkEl = getElement(opThree(x,i), opFour(y,i));
                    if (checkEl.innerText === turnStr) {
                        likeEl.push(checkEl)
                        len_scope++;
                    } else{
                        sideTwo = false;
                    }
                } else{
                    sideTwo=false
                }
                if (len_scope>=symbolLen) {
                    winner = true;
                    likeEl.forEach(element=>{
                        element.classList.add("correct")
                    })
                }
                i++
            }

        });
        if(!winner){
            this.setState({turn:!turn})
        }
        this.setState({winner})
    }

    detectClick = (x, y) => {
        let { turn, winner, draw } = this.state;
        let clickedEl = document.querySelectorAll("#game .row")[y].children[x]

        if (clickedEl.innerText === ""&&!winner&&!draw) {
            try {
                this.check(x,y)
                clickedEl.innerText = turn ? "X":"O";
                clickedEl.classList.add("clicked");
                if(!Boolean(document.querySelectorAll("#game .row .cell-item:not(.clicked)").length)){
                    this.setState({draw:true});
                }
            } catch (e) {
                alert("An error occurred!\nPlease Try Again");
                this.tryAgain()
            }
        } 
    }

    Game = () => {
            const { columnLen, rowLen} = this.state;
            let column=[]
            for (let x = 0; x < columnLen; x++) {
                let row=[]
                for (let y = 0; y < rowLen; y++) {
                    row.push(<button className="cell-item" key={y} onClick={() => { this.detectClick(y, x) }} ></button>)
                }
                column.push(<div className="row" key={x}>{ row }</div>)
            }            
            return (
                <div className="cell">{ column }</div>
            )
        
        
    }

    typeColumn = input => {
        this.setState({ columnLen: parseInt(input.target.value) })
    }

    typeRow = input => {
        this.setState({ rowLen: input.target.value })
    }

    typeSymbol = input => {
        this.setState({ symbolLen: input.target.value })
    }

    runGame = () => {
        const { columnLen, rowLen, symbolLen } = this.state;
        if(rowLen&&symbolLen&&columnLen){
            this.setState({ startGame: true })
        }
    }
    render() {
        const { columnLen, rowLen, symbolLen, startGame, turn, winner, draw} = this.state;
        const { typeColumn, typeRow, Game, typeSymbol, runGame, tryAgain } = this;
        return (
            <section>
                {
                    !startGame ?
                        <form id="game-rules">
                            <div>
                                <label>დაფის სიგრძე</label>
                                <input type="number" value={columnLen} onChange={typeColumn} />
                            </div>
                            <div>
                                <label>დაფის სიგანე</label>
                                <input type="number" value={rowLen} onChange={typeRow} />
                            </div>
                            <div>
                                <label>სიმბოლოების რაოდენობა</label>
                                <input type="number" value={symbolLen} onChange={typeSymbol} />
                            </div>
                            <button type="button" className="start-btn" onClick={runGame}>დაწყება</button>
                        </form> : ""
                }
                <div id="game" >
                    {startGame&&!winner&&!draw ?  <h1 className="turn">Turn: {turn ? "X":"O"}  </h1> : "" }
                    {startGame ? <Game /> : ""}
                    {
                        winner||draw?
                        <div className="geme-over">
                            {winner ? <p>Winner: {turn ? "X":"O"}</p>:""}
                            {!winner&&draw ? <p>Draw</p>:""}
                            <button onClick={tryAgain}>Try Again</button>
                        </div>:""
                    }
                </div>
            </section>
        );
    }
}
export default App